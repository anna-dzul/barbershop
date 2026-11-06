import { initialBookings } from "../data/bookings.js";
import { ServiceError } from "./ServiceError.js";
import { toBookingInput, toBookingList } from "./bookingContract.js";
const storageKey = "barbershop.bookings.v1";
const failures = new Set();
let delay = 600;
export function failNextMockBooking(operation) { failures.add(operation); }
export function setMockDelay(ms) { delay = Math.max(0, Number(ms) || 0); }
function pause(signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException("Aborted", "AbortError"));
    const timer = setTimeout(() => { signal?.removeEventListener("abort", abort); resolve(); }, delay);
    function abort() {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
      reject(new DOMException("Aborted", "AbortError"));
    }
    signal?.addEventListener("abort", abort, { once: true });
  });
}
async function before(operation, signal) {
  await pause(signal);
  if (failures.delete(operation)) throw new ServiceError("Навчальна відмова сервісу. Повторіть дію.", { code: "MOCK_FAILURE" });
}
function read() {
  try {
    const raw = localStorage.getItem(storageKey);
    return toBookingList(raw === null ? initialBookings : JSON.parse(raw));
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError("Не вдалося прочитати локальні дані.", { code: "STORAGE_READ" });
  }
}
function write(records) {
  try { localStorage.setItem(storageKey, JSON.stringify(records)); }
  catch { throw new ServiceError("Не вдалося зберегти локальні дані.", { code: "STORAGE_WRITE" }); }
}
function find(records, id) {
  const record = records.find(item => item.id === id);
  if (!record) throw new ServiceError("Запис не знайдено.", { code: "NOT_FOUND" });
  return record;
}
export const mockBookingService = {
  async getAll({ signal } = {}) { await before("getAll", signal); return read(); },
  async getById(id, { signal } = {}) { await before("getById", signal); return find(read(), id); },
  async create(input) {
    const value = toBookingInput(input);
    await before("create");
    const records = read();
    const record = { ...value, id: `booking-${crypto.randomUUID()}`, createdAt: new Date().toISOString() };
    write([...records, record]);
    return { ...record };
  },
  async update(id, input) {
    const value = toBookingInput(input);
    await before("update");
    const records = read();
    const existing = find(records, id);
    const record = { ...value, id, createdAt: existing.createdAt, updatedAt: new Date().toISOString() };
    write(records.map(item => item.id === id ? record : item));
    return { ...record };
  },
  async delete(id) {
    await before("delete");
    const records = read();
    find(records, id);
    write(records.filter(item => item.id !== id));
  }
};
