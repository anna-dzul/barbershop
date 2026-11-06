import { failNextMockBooking, setMockDelay } from "./mockBookingService.js";
if (import.meta.env.DEV && (import.meta.env.VITE_DATA_SOURCE ?? "mock") === "mock") {
  window.barbershopMock = { failNext: failNextMockBooking, setDelay: setMockDelay };
}
