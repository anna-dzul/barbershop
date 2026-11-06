const PHONE_PATTERN = /^\+?[0-9\s()-]{10,20}$/;

export function validateBooking(draft) {
  const errors = {};
  const name = String(draft.clientName ?? "").trim();
  const phone = String(draft.phone ?? "").trim();
  const serviceId = String(draft.serviceId ?? "").trim();
  const date = String(draft.date ?? "").trim();
  const time = String(draft.time ?? "").trim();
  const notes = String(draft.notes ?? "").trim();

  if (name.length < 2 || name.length > 60) {
    errors.clientName = "Ім’я має містити від 2 до 60 символів.";
  }
  if (!PHONE_PATTERN.test(phone)) {
    errors.phone = "Введіть номер телефону: 10–20 цифр, можна використати +, пробіли, дужки та дефіси.";
  }
  if (!serviceId) errors.serviceId = "Оберіть послугу.";
  if (!date) {
    errors.date = "Оберіть бажану дату.";
  } else {
    const selected = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(selected.getTime()) || selected < today) {
      errors.date = "Дата не може бути в минулому.";
    }
  }
  if (!time) {
    errors.time = "Оберіть бажаний час.";
  } else if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    errors.time = "Вкажіть час у форматі ГГ:ХХ.";
  }
  if (notes.length > 300) errors.notes = "Побажання не можуть перевищувати 300 символів.";

  return errors;
}
