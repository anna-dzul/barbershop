import { Link } from "react-router-dom";
export default function NotFoundPage() {
  return <div className="empty-state"><p className="eyebrow">404</p><h2>Сторінку не знайдено</h2><p>Перевірте адресу або поверніться на головну.</p><Link className="button" to="/">На головну</Link></div>;
}
