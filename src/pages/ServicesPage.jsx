import { Link, useSearchParams } from "react-router-dom";
import { services } from "../data/services.js";
import Notice from "../components/Notice.jsx";

export default function ServicesPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const category = params.get("category") || "all";
  const sort = params.get("sort") || "name";
  const visible = services.filter((service) =>
    service.name.toLocaleLowerCase("uk").includes(q.trim().toLocaleLowerCase("uk")) &&
    (category === "all" || service.category === category)
  ).sort((a, b) => sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : a.name.localeCompare(b.name, "uk"));
  function change(key, value) {
    const next = new URLSearchParams(params);
    if (!value || value === "all" || (key === "sort" && value === "name")) next.delete(key);
    else next.set(key, value);
    setParams(next);
  }
  return (
    <>
      <Notice />
      <section className="page-intro"><p className="eyebrow">КАТАЛОГ</p><h2>Послуги та ціни</h2><p>Оберіть послугу для свого наступного візиту.</p></section>
      <section className="filter-panel" aria-label="Фільтри послуг">
        <div className="form-field"><label htmlFor="service-search">Пошук за назвою</label><input id="service-search" value={q} onChange={(e) => change("q", e.target.value)} placeholder="Наприклад, борода" /></div>
        <div className="form-field"><label htmlFor="service-category">Категорія</label><select id="service-category" value={category} onChange={(e) => change("category", e.target.value)}><option value="all">Усі категорії</option>{[...new Set(services.map(s => s.category))].map(c => <option key={c}>{c}</option>)}</select></div>
        <div className="form-field"><label htmlFor="service-sort">Сортування</label><select id="service-sort" value={sort} onChange={(e) => change("sort", e.target.value)}><option value="name">За назвою</option><option value="price-asc">Ціна: від дешевшої</option><option value="price-desc">Ціна: від дорожчої</option></select></div>
        <button className="button-secondary" type="button" onClick={() => setParams({})}>Скинути фільтри</button>
      </section>
      <p className="result-count">Знайдено послуг: {visible.length}</p>
      {visible.length ? <div className="service-grid">{visible.map(service => <article className="service-card" key={service.id}><span className="service-category">{service.category}</span><h3>{service.name}</h3><p>{service.description}</p><div className="card-meta"><strong>{service.price} грн</strong><span>{service.duration} хв</span></div><Link to={`/bookings/new?serviceId=${service.id}`}>Записатися →</Link></article>)}</div> : <div className="empty-state"><h3>Нічого не знайдено</h3><p>Змініть пошуковий запит або категорію.</p></div>}
    </>
  );
}
