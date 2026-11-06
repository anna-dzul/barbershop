import { ServiceError } from "./ServiceError.js";
import { toBooking, toBookingInput, toBookingList } from "./bookingContract.js";
export function createApiBookingService(baseUrl) {
  if (!baseUrl?.trim()) throw new ServiceError("Не налаштовано адресу API.", { code: "CONFIG" });
  const base = baseUrl.trim().replace(/\/+$/, "");
  async function request(path, { method = "GET", body, signal } = {}) {
    let response;
    try {
      response = await fetch(`${base}${path}`, {
        method, signal,
        headers: { Accept: "application/json", ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
        ...(body === undefined ? {} : { body: JSON.stringify(body) })
      });
    } catch (error) {
      if (error.name === "AbortError") throw error;
      throw new ServiceError("Не вдалося зв’язатися із сервісом.", { code: "NETWORK" });
    }
    if (!response.ok) {
      const messages = { 400: "Сервіс відхилив дані.", 401: "Потрібна автентифікація.",
        403: "Дію заборонено.", 404: "Запис не знайдено.", 409: "Оновіть дані перед повтором.",
        422: "Перевірте значення полів.", 429: "Повторіть пізніше." };
      throw new ServiceError(messages[response.status] || "Помилка сервісу.", {
        code: response.status === 404 ? "NOT_FOUND" : "HTTP", status: response.status
      });
    }
    if (response.status === 204) return undefined;
    try { return await response.json(); }
    catch (error) {
      if (error.name === "AbortError") throw error;
      throw new ServiceError("Сервіс повернув некоректний JSON.", { code: "BAD_DATA" });
    }
  }
  const path = id => `/bookings/${encodeURIComponent(id)}`;
  function sameId(record, id) {
    if (record.id !== id) throw new ServiceError("Сервіс повернув інший id.", { code: "BAD_DATA" });
    return record;
  }
  return {
    async getAll({ signal } = {}) { return toBookingList(await request("/bookings", { signal })); },
    async getById(id, { signal } = {}) { return sameId(toBooking(await request(path(id), { signal })), id); },
    async create(input) { return toBooking(await request("/bookings", { method: "POST", body: toBookingInput(input) })); },
    async update(id, input) { return sameId(toBooking(await request(path(id), { method: "PUT", body: toBookingInput(input) })), id); },
    async delete(id) { await request(path(id), { method: "DELETE" }); }
  };
}
