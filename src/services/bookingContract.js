import { validateBooking } from "../domain/bookingValidation.js";
import { ServiceError } from "./ServiceError.js";
const fields = ["clientName", "phone", "serviceId", "date", "time", "notes"];
export function toBookingInput(input) {
  const value = Object.fromEntries(fields.map(key => [key, String(input?.[key] ?? "").trim()]));
  const errors = validateBooking(value);
  if (Object.keys(errors).length) throw new ServiceError("Перевірте поля запису.", { code: "VALIDATION", errors });
  return value;
}
export function toBooking(value) {
  if (!value || typeof value.id !== "string" || !value.id ||
      !fields.every(key => typeof value[key] === "string")) {
    throw new ServiceError("Джерело повернуло некоректний запис.", { code: "BAD_DATA" });
  }
  return { id: value.id, ...Object.fromEntries(fields.map(key => [key, value[key]])),
    ...(typeof value.createdAt === "string" ? { createdAt: value.createdAt } : {}),
    ...(typeof value.updatedAt === "string" ? { updatedAt: value.updatedAt } : {}) };
}
export function toBookingList(value) {
  if (!Array.isArray(value)) throw new ServiceError("Некоректний список записів.", { code: "BAD_DATA" });
  const records = value.map(toBooking);
  if (new Set(records.map(record => record.id)).size !== records.length)
    throw new ServiceError("Повторні ідентифікатори.", { code: "BAD_DATA" });
  return records;
}
