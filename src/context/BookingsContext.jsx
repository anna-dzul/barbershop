import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { bookingService } from "../services/bookingService.js";
import { errorMessage } from "../services/ServiceError.js";
const BookingsContext = createContext(null);
export function BookingsProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [notice, setNotice] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [isMutating, setIsMutating] = useState(false);
  const activeRead = useRef(null);
  const version = useRef(0);
  const lock = useRef(false);
  const mounted = useRef(false);
  const reload = useCallback(async () => {
    if (lock.current) return;
    activeRead.current?.abort();
    const controller = new AbortController();
    activeRead.current = controller;
    const current = ++version.current;
    setStatus("loading");
    setError("");
    try {
      const records = await bookingService.getAll({ signal: controller.signal });
      if (controller.signal.aborted || current !== version.current) return;
      setBookings(records);
      setStatus("success");
    } catch (cause) {
      if (controller.signal.aborted || current !== version.current) return;
      setError(errorMessage(cause));
      setStatus("error");
    }
  }, []);
  useEffect(() => {
    mounted.current = true;
    void reload();
    return () => { mounted.current = false; activeRead.current?.abort(); version.current++; };
  }, [reload]);
  async function mutate(operation, apply, text) {
    if (lock.current || status !== "success") return { ok: false, message: "Дочекайтеся завершення поточної операції." };
    lock.current = true;
    setIsMutating(true);
    setNotice(null);
    activeRead.current?.abort();
    version.current++;
    try {
      const booking = await operation();
      if (mounted.current) {
        setBookings(previous => apply(previous, booking));
        setNotice({ type: "success", text });
      }
      return { ok: true, booking };
    } catch (cause) {
      return { ok: false, message: errorMessage(cause), errors: cause.errors, code: cause.code };
    } finally {
      lock.current = false;
      if (mounted.current) setIsMutating(false);
    }
  }
  function createBooking(input) {
    return mutate(() => bookingService.create(input), (items, record) => [...items.filter(item => item.id !== record.id), record], "Запис успішно створено.");
  }
  function updateBooking(id, input) {
    return mutate(() => bookingService.update(id, input), (items, record) => items.map(item => item.id === id ? record : item), "Зміни запису збережено.");
  }
  function deleteBooking(id) {
    return mutate(() => bookingService.delete(id), items => items.filter(item => item.id !== id), "Запис видалено.");
  }
  return <BookingsContext.Provider value={{ bookings, status, error, reload, isMutating,
    createBooking, updateBooking, deleteBooking, getBooking: id => bookings.find(item => item.id === id),
    notice, showNotice: setNotice, clearNotice: () => setNotice(null) }}>{children}</BookingsContext.Provider>;
}
export function useBookings() {
  const context = useContext(BookingsContext);
  if (!context) throw new Error("useBookings must be used inside BookingsProvider");
  return context;
}
