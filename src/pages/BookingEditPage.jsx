import { usePageActive } from "../hooks/usePageActive.js";
import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BookingForm from "../components/BookingForm.jsx";
import Notice from "../components/Notice.jsx";
import { useBookings } from "../context/BookingsContext.jsx";

export default function BookingEditPage() {
  const { id } = useParams();
  const { getBooking, updateBooking } = useBookings();
  const navigate = useNavigate();
  const active = usePageActive(id);
  const booking = getBooking(id);
  const initialValues = useMemo(() => booking ? ({ ...booking }) : {}, [booking]);
  if (!booking) return <><Notice /><div className="empty-state"><h2>Запис не знайдено</h2><p>Можливо, запис було видалено або сторінку відкрито за неправильним посиланням.</p><Link to="/bookings">Повернутися до записів</Link></div></>;
  async function handleSubmit(draft) {
    const result = await updateBooking(id, draft);
    if (result.ok && active.current === id) navigate(`/bookings/${id}`);
    return result;
  }
  return <><Notice /><section className="page-intro"><p className="eyebrow">РЕДАГУВАННЯ</p><h2>Редагування запису</h2><p>Оновіть потрібні поля та збережіть зміни.</p></section><BookingForm key={id} initialValues={initialValues} onSubmit={handleSubmit} submitLabel="Зберегти зміни" /><p><Link to={`/bookings/${id}`}>← До перегляду запису</Link></p></>;
}
