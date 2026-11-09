import { getServiceById } from "../data/services.js";
const PHONE_PATTERN = /^\+?[0-9\s()-]+$/;

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
  const digits = phone.replace(/\D/g, "").length;
  if (!PHONE_PATTERN.test(phone) || digits < 10 || digits > 20) {
    errors.phone = "Введіть номер телефону: 10–20 цифр, можна використати +, пробіли, дужки та дефіси.";
  }
  if (!getServiceById(serviceId)) errors.serviceId = "Оберіть наявну послугу.";
  if (!date) {
    errors.date = "Оберіть бажану дату.";
  } else {
    const selected = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const realDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(selected.getTime()) &&
      selected.getFullYear() === Number(date.slice(0, 4)) &&
      selected.getMonth() + 1 === Number(date.slice(5, 7)) &&
      selected.getDate() === Number(date.slice(8, 10));
    if (!realDate || selected < today) {
      errors.date = "Оберіть коректну дату, не раніше сьогодні.";
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
