import { mockBookingService } from "./mockBookingService.js";
import { createApiBookingService } from "./apiBookingService.js";
const source = import.meta.env.VITE_DATA_SOURCE ?? "mock";
function selectService() {
  if (source === "mock") return mockBookingService;
  if (source === "api") return createApiBookingService(import.meta.env.VITE_API_BASE_URL);
  throw new Error(`Невідоме джерело: ${source}`);
}
export const bookingService = selectService();
