import { Link, useSearchParams } from "react-router-dom";
import { useBookings } from "../context/BookingsContext.jsx";
import { getServiceById } from "../data/services.js";
import Notice from "../components/Notice.jsx";

export default function BookingsPage() {
  const { bookings, reload, isMutating } = useBookings();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const serviceId = params.get("serviceId") || "all";
  const sort = params.get("sort") || "date-asc";
  const filtered = bookings.filter((b) => {
    const service = getServiceById(b.serviceId);
    return `${b.clientName} ${b.phone} ${service?.name || ""}`.toLocaleLowerCase("uk").includes(q.trim().toLocaleLowerCase("uk")) &&
      (serviceId === "all" || b.serviceId === serviceId);
  }).sort((a, b) => sort === "date-desc" ? `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`) : sort === "name" ? a.clientName.localeCompare(b.clientName, "uk") : `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  function change(key, value) {
    const next = new URLSearchParams(params);
    if (!value || value === "all" || (key === "sort" && value === "date-asc")) next.delete(key);
    else next.set(key, value);
    setParams(next);
  }
  return (
    <>
      <Notice />
      <section className="page-intro page-intro-row"><div><p className="eyebrow">КЕРУВАННЯ ЗАПИСАМИ</p><h2>Записи клієнтів</h2><p>Створюй, переглядай, редагуй і видаляй записи.</p></div><Link className="button" to="/bookings/new">+ Новий запис</Link></section>
      <button disabled={isMutating} onClick={() => void reload()}>Оновити дані</button>
      <section className="filter-panel">
        <div className="form-field"><label htmlFor="booking-search">Пошук</label><input id="booking-search" value={q} onChange={(e) => change("q", e.target.value)} placeholder="Ім’я, телефон або послуга" /></div>
        <div className="form-field"><label htmlFor="booking-service">Фільтр за послугою</label><select id="booking-service" value={serviceId} onChange={(e) => change("serviceId", e.target.value)}><option value="all">Усі послуги</option>{(awaitlessServices()).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
        <div className="form-field"><label htmlFor="booking-sort">Порядок</label><select id="booking-sort" value={sort} onChange={(e) => change("sort", e.target.value)}><option value="date-asc">За датою: спочатку ранні</option><option value="date-desc">За датою: спочатку пізні</option><option value="name">За ім’ям клієнта</option></select></div>
        <button type="button" className="button-secondary" onClick={() => setParams({})}>Скинути</button>
      </section>
      <p className="result-count">Показано {filtered.length} із {bookings.length} записів</p>
      {bookings.length === 0 ? <div className="empty-state"><h3>Записів ще немає</h3><p>Створіть перший запис клієнта.</p><Link to="/bookings/new">Створити запис →</Link></div>
        : filtered.length === 0 ? <div className="empty-state"><h3>За цими параметрами нічого не знайдено</h3><p>Спробуйте змінити пошук або фільтр.</p><button type="button" className="button-secondary" onClick={() => setParams({})}>Очистити фільтри</button></div>
        : <div className="table-wrap"><table><thead><tr><th>Клієнт</th><th>Послуга</th><th>Дата й час</th><th>Телефон</th><th>Дії</th></tr></thead><tbody>{filtered.map(b => <tr key={b.id}><td><strong>{b.clientName}</strong></td><td>{getServiceById(b.serviceId)?.name || "Послугу видалено"}</td><td>{b.date} · {b.time}</td><td>{b.phone}</td><td className="table-actions"><Link to={`/bookings/${b.id}`}>Перегляд</Link><Link to={`/bookings/${b.id}/edit`}>Редагувати</Link></td></tr>)}</tbody></table></div>}
      <p className="muted">Дані надходять через асинхронний сервіс. Зміни інших вкладок можна отримати кнопкою «Оновити дані».</p>
    </>
  );
}

function awaitlessServices() {
  return [
    { id: "haircut", name: "Чоловіча стрижка" },
    { id: "beard", name: "Стрижка бороди" },
    { id: "combo", name: "Стрижка + борода" },
    { id: "styling", name: "Укладання" }
  ];
}
