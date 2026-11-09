import { getServiceById } from "../data/services.js";
// Повертає новий масив. Вихідна колекція не сортується на місці.
export function selectBookings(bookings, { q = "", serviceId = "all", sort = "date-asc" } = {}) {
  const query = q.trim().toLocaleLowerCase("uk");
  return bookings.filter(booking => {
    const service = getServiceById(booking.serviceId);
    const text = `${booking.clientName} ${booking.phone} ${service?.name || ""}`.toLocaleLowerCase("uk");
    return text.includes(query) && (serviceId === "all" || booking.serviceId === serviceId);
  }).sort((a, b) => sort === "date-desc"
    ? `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`)
    : sort === "name" ? a.clientName.localeCompare(b.clientName, "uk")
    : `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}
