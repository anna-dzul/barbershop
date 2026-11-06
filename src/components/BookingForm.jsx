import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { services } from "../data/services.js";
import { validateBooking } from "../domain/bookingValidation.js";

const emptyDraft = { clientName: "", phone: "", serviceId: "", date: "", time: "", notes: "" };

export default function BookingForm({ initialValues = emptyDraft, submitLabel = "Зберегти запис", onSubmit }) {
  const [draft, setDraft] = useState(() => ({ ...emptyDraft, ...initialValues }));
  const [today] = useState(() => new Date().toLocaleDateString("en-CA"));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);
  const alive = useRef(false);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setFormError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting.current) return;
    const nextErrors = validateBooking(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setFormError("Перевірте поля, позначені повідомленнями про помилки. Введені дані збережено у формі.");
      return;
    }
    submitting.current = true;
    setIsSubmitting(true);
    setFormError("");
    try {
    const result = await onSubmit({
      ...draft,
      clientName: draft.clientName.trim(),
      phone: draft.phone.trim(),
      notes: draft.notes.trim()
    });
    if (!result?.ok && alive.current) {
      setErrors(result?.errors || {});
      setFormError(result?.message || "Не вдалося зберегти запис. Перевірте дані та спробуйте ще раз.");
    }
    } catch {
      if (alive.current) setFormError("Не вдалося завершити збереження. Введені дані збережено.");
    } finally {
      submitting.current = false;
      if (alive.current) setIsSubmitting(false);
    }
  }

  function fieldError(name) {
    return errors[name] ? <span className="field-error" id={`${name}-error`}>{errors[name]}</span> : null;
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit} aria-busy={isSubmitting} noValidate>
      {formError && <p className="form-error" role="alert">{formError}</p>}
      <fieldset disabled={isSubmitting} style={{ border: 0, padding: 0, margin: 0 }}><legend className="muted">Дані запису</legend>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="clientName">Ім’я клієнта *</label>
          <input id="clientName" name="clientName" value={draft.clientName} onChange={handleChange}
            minLength={2} maxLength={60} autoComplete="name" aria-invalid={Boolean(errors.clientName)}
            aria-describedby={errors.clientName ? "clientName-error" : "clientName-hint"} />
          <small id="clientName-hint">Від 2 до 60 символів.</small>{fieldError("clientName")}
        </div>
        <div className="form-field">
          <label htmlFor="phone">Номер телефону *</label>
          <input id="phone" name="phone" type="tel" value={draft.phone} onChange={handleChange}
            autoComplete="tel" placeholder="+380 67 123 45 67" aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : "phone-hint"} />
          <small id="phone-hint">10–20 цифр; дозволені +, пробіли, дужки та дефіси.</small>{fieldError("phone")}
        </div>
        <div className="form-field">
          <label htmlFor="serviceId">Послуга *</label>
          <select id="serviceId" name="serviceId" value={draft.serviceId} onChange={handleChange}
            aria-invalid={Boolean(errors.serviceId)} aria-describedby={errors.serviceId ? "serviceId-error" : undefined}>
            <option value="">Оберіть послугу</option>
            {services.map((service) => <option key={service.id} value={service.id}>{service.name} — {service.price} грн</option>)}
          </select>{fieldError("serviceId")}
        </div>
        <div className="form-field">
          <label htmlFor="date">Бажана дата *</label>
          <input id="date" name="date" type="date" value={draft.date} onChange={handleChange}
            min={today} aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? "date-error" : undefined} />
          {fieldError("date")}
        </div>
        <div className="form-field">
          <label htmlFor="time">Бажаний час *</label>
          <input id="time" name="time" type="time" value={draft.time} onChange={handleChange}
            aria-invalid={Boolean(errors.time)} aria-describedby={errors.time ? "time-error" : undefined} />
          {fieldError("time")}
        </div>
        <div className="form-field form-field-wide">
          <label htmlFor="notes">Побажання до візиту</label>
          <textarea id="notes" name="notes" rows={4} maxLength={300} value={draft.notes} onChange={handleChange}
            aria-invalid={Boolean(errors.notes)} aria-describedby={errors.notes ? "notes-error" : "notes-hint"} />
          <small id="notes-hint">{draft.notes.length}/300 символів. Поле необов’язкове.</small>{fieldError("notes")}
        </div>
      </div>
      <div className="form-actions">
        <button type="submit">{isSubmitting ? "Збереження…" : submitLabel}</button>
        {!isSubmitting && <Link className="button button-secondary" to="/bookings">Скасувати</Link>}
      </div>
      </fieldset>
      <p className="muted">* Обов’язкові поля. Навчальний запис. У режимі mock дані зберігаються в цьому браузері після перезавантаження; у режимі API — у вибраному сервісі.</p>
    </form>
  );
}
