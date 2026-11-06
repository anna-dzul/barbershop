import { Outlet } from "react-router-dom";
import { useBookings } from "../context/BookingsContext.jsx";
export default function BookingsGate() {
  const { status, error, reload } = useBookings();
  if (status === "loading") return <p role="status">Завантаження записів…</p>;
  if (status === "error") return <section><p role="alert">{error}</p><button onClick={() => void reload()}>Спробувати ще раз</button></section>;
  return <Outlet />;
}
