import { useBookings } from "../context/BookingsContext.jsx";
export default function Notice() {
  const { notice, clearNotice } = useBookings();
  if (!notice) return null;
  return (
    <div className={`notice notice-${notice.type}`} role="status" aria-live="polite">
      <span>{notice.text}</span>
      <button type="button" className="text-button" onClick={clearNotice} aria-label="Закрити повідомлення">×</button>
    </div>
  );
}
