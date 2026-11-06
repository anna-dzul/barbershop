import { Link } from "react-router-dom";
import { services } from "../data/services.js";
import Notice from "../components/Notice.jsx";

export default function HomePage() {
  return (
    <>
      <Notice />
      <section className="hero-panel">
        <p className="eyebrow">BARBERSHOP · КИЇВ</p>
        <h2>Твій стиль. Твій барбер.</h2>
        <p>Чоловічі стрижки, оформлення бороди та догляд у спокійній атмосфері.</p>
        <div className="hero-actions">
          <Link className="button" to="/services">Переглянути послуги</Link>
          <Link className="button button-secondary" to="/bookings/new">Записатися</Link>
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <div><p className="eyebrow">НАШІ ПОСЛУГИ</p><h2>Вибери свій формат</h2></div>
          <Link to="/services">Усі послуги →</Link>
        </div>
        <div className="service-grid">
          {services.slice(0, 3).map((service) => (
            <article className="service-card" key={service.id}>
              <span className="service-category">{service.category}</span>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="card-meta"><strong>{service.price} грн</strong><span>{service.duration} хв</span></div>
              <Link to={`/bookings/new?serviceId=${service.id}`}>Обрати послугу →</Link>
            </article>
          ))}
        </div>
      </section>
      <section className="callout">
        <div><p className="eyebrow">ЗРУЧНО ТА ПРОСТО</p><h2>Заплануй свій візит</h2><p>Створи локальний запис і переглянь його в розділі записів.</p></div>
        <Link className="button" to="/bookings/new">Створити запис</Link>
      </section>
    </>
  );
}
