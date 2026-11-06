import AppButton from '../ui/AppButton'
import FormField from '../ui/FormField'

export default function BookingFormPreview({ idPrefix, serviceName }) {
  const nameId = `${idPrefix}-name`
  const phoneId = `${idPrefix}-phone`
  const dateId = `${idPrefix}-date`
  const noteId = `${idPrefix}-note`

  return (
    <form className="booking-form" aria-label={`Макет запису на послугу ${serviceName}`}>
      <div className="form-grid">
        <FormField id={nameId} label="Ваше ім’я" hint="Як до вас звертатися">
          <input id={nameId} name="clientName" type="text" autoComplete="given-name"
            placeholder="Наприклад, Олександр" defaultValue=""
            aria-describedby={`${nameId}-hint`} />
        </FormField>
        <FormField id={phoneId} label="Номер телефону" hint="Для уточнення деталей візиту">
          <input id={phoneId} name="phone" type="tel" autoComplete="tel"
            placeholder="+380" defaultValue="" aria-describedby={`${phoneId}-hint`} />
        </FormField>
        <FormField id={dateId} label="Бажана дата" hint="Дата ще не означає бронювання">
          <input id={dateId} name="date" type="date" defaultValue=""
            aria-describedby={`${dateId}-hint`} />
        </FormField>
      </div>
      <FormField id={noteId} label="Побажання до візиту" hint="Наприклад, бажана довжина або стиль стрижки">
        <textarea id={noteId} name="note" rows={3} placeholder="Ваші побажання"
          defaultValue="" aria-describedby={`${noteId}-hint`} />
      </FormField>
      <p className="booking-notice">Онлайн-запис поки недоступний. Введені дані не надсилаються та не зберігаються.</p>
      <div className="form-actions">
        <AppButton type="button" disabled>Підтвердити запис</AppButton>
        <AppButton type="reset" variant="secondary">Очистити поля</AppButton>
      </div>
    </form>
  )
}
