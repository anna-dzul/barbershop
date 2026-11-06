import AvailabilityBadge from '../components/services/AvailabilityBadge'
import BookingFormPreview from '../components/booking/BookingFormPreview'
import EmptyState from '../components/ui/EmptyState'
import Section from '../components/ui/Section'
import formatPrice from '../utils/formatPrice'

export default function BookingPage({ item }) {
  return (
    <Section id="booking" title="Підготовка запису" eyebrow="Наступний крок">
      {item ? (
        <div className="booking-layout">
          <aside className="booking-service" aria-label="Приклад послуги для запису">
            <p className="eyebrow">Приклад послуги</p>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <div className="booking-meta">
              <strong className="price">{formatPrice(item.price)}</strong>
              <span>{item.duration} хв</span>
            </div>
            <AvailabilityBadge available={item.available} />
            <p className="preview-note">Тут показано макет форми для цієї послуги.</p>
          </aside>
          <BookingFormPreview idPrefix="booking" serviceName={item.name} />
        </div>
      ) : (
        <EmptyState title="Послугу не задано">
          <p>Перегляньте каталог послуг. Макет запису наразі недоступний.</p>
        </EmptyState>
      )}
    </Section>
  )
}
