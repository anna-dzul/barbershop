import { usePageActive } from "../hooks/usePageActive.js";
import { useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import BookingForm from "../components/BookingForm.jsx";
import Notice from "../components/Notice.jsx";
import { useBookings } from "../context/BookingsContext.jsx";
import { getServiceById } from "../data/services.js";

export default function BookingCreatePage() {
  const { createBooking } = useBookings();
  const navigate = useNavigate();
  const active = usePageActive();
  const [params] = useSearchParams();
  const initialValues = useMemo(() => ({ serviceId: getServiceById(params.get("serviceId")) ? params.get("serviceId") : "" }), [params]);
  async function handleSubmit(draft) {
    const result = await createBooking(draft);
    if (result.ok && active.current === "page") navigate(`/bookings/${result.booking.id}`);
    return result;
  }
  return <><Notice /><section className="page-intro"><p className="eyebrow">НОВИЙ ЗАПИС</p><h2>Створення запису</h2><p>Заповніть дані клієнта та бажаного візиту.</p></section><BookingForm key={initialValues.serviceId} initialValues={initialValues} onSubmit={handleSubmit} submitLabel="Створити запис" /><p><Link to="/bookings">← До списку записів</Link></p></>;
}
