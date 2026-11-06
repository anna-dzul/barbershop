import { NavLink, Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <>
      <a className="skip-link" href="#main">Перейти до вмісту</a>
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">B</span>
            <div>
              <h1>BARBERSHOP</h1>
              <p>Стиль починається з деталей</p>
            </div>
          </div>
          <nav aria-label="Основна навігація" className="nav-links">
            <NavLink to="/" end>Головна</NavLink>
            <NavLink to="/services">Послуги</NavLink>
            <NavLink to="/bookings">Записи</NavLink>
            <NavLink to="/bookings/new">Створити запис</NavLink>
          </nav>
        </div>
      </header>
      <main id="main" className="container">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <strong>BARBERSHOP</strong>
          <p>Чоловічі стрижки та догляд за бородою</p>
          <span>Навчальний застосунок · локальні дані</span>
        </div>
      </footer>
    </>
  );
}
