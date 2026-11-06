import { useState } from "react";
import { usePageActive } from "../hooks/usePageActive.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useBookings } from "../context/BookingsContext.jsx";
import { getServiceById } from "../data/services.js";
import Notice from "../components/Notice.jsx";

export default function BookingDetailsPage() {
  const { id } = useParams();
  const { getBooking, deleteBooking, isMutating } = useBookings();
  const navigate = useNavigate();
  const active = usePageActive(id);
  const [error, setError] = useState("");
  const booking = getBooking(id);
  if (!booking) return <><Notice /><div className="empty-state"><h2>Запис не знайдено</h2><p>Можливо, його вже видалено або посилання неправильне.</p><Link to="/bookings">Повернутися до списку</Link></div></>;
  const service = getServiceById(booking.serviceId);
  async function handleDelete() {
    if (isMutating) return;
    setError("");
    const confirmed = window.confirm(`Видалити запис клієнта «${booking.clientName}» на ${booking.date} о ${booking.time}? Цю дію не можна скасувати.`);
    if (!confirmed) return;
    const result = await deleteBooking(id);
    if (active.current !== id) return;
    if (result.ok) navigate("/bookings");
    else setError(result.message);
  }
  return <>
    <Notice />
    {error && <p role="alert">{error}</p>}
    <section className="page-intro page-intro-row"><div><p className="eyebrow">ДЕТАЛІ ЗАПИСУ</p><h2>{booking.clientName}</h2><p>{service?.name || "Послугу не знайдено"}</p></div><span className="status-pill">Локальний запис</span></section>
    <section className="details-card">
      <dl className="details-grid">
        <div><dt>Клієнт</dt><dd>{booking.clientName}</dd></div>
        <div><dt>Телефон</dt><dd>{booking.phone}</dd></div>
        <div><dt>Послуга</dt><dd>{service?.name || "Послугу не знайдено"}</dd></div>
        <div><dt>Вартість</dt><dd>{service ? `${service.price} грн` : "—"}</dd></div>
        <div><dt>Дата</dt><dd>{booking.date}</dd></div>
        <div><dt>Час</dt><dd>{booking.time}</dd></div>
        <div className="detail-wide"><dt>Побажання</dt><dd>{booking.notes || "Не вказано"}</dd></div>
      </dl>
      <div className="form-actions"><Link className="button" to={`/bookings/${id}/edit`}>Редагувати запис</Link><button type="button" className="button-danger" disabled={isMutating} onClick={handleDelete}>{isMutating ? "Видалення…" : "Видалити запис"}</button><Link className="button button-secondary" to="/bookings">До списку</Link></div>
    </section>
  </>;
}
