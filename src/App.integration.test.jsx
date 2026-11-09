import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import App from "./App.jsx";
import { BookingsProvider } from "./context/BookingsContext.jsx";
import { bookingService } from "./services/bookingService.js";
import { ServiceError } from "./services/ServiceError.js";
import { validInput, savedBooking } from "./test/fixtures.js";
import { deferred } from "./test/deferred.js";
import { fillBookingForm } from "./test/formActions.js";
vi.mock("./services/bookingService.js", () => ({ bookingService: {
  getAll: vi.fn(), getById: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn()
} }));
beforeEach(() => {
  for (const method of Object.values(bookingService)) method.mockReset();
  bookingService.getAll.mockResolvedValue([{ ...savedBooking }]);
  bookingService.create.mockImplementation(async input => ({ ...input, id: "booking-created" }));
  bookingService.update.mockImplementation(async (id, input) => ({ ...input, id }));
  bookingService.delete.mockResolvedValue(undefined);
});
afterEach(() => vi.restoreAllMocks());
function LocationProbe() { const location = useLocation(); return <output data-testid="location">{location.pathname}{location.search}</output>; }
function renderApp(path = "/bookings") {
  render(<MemoryRouter initialEntries={[path]}><BookingsProvider><App/><LocationProbe/></BookingsProvider></MemoryRouter>);
  return userEvent.setup();
}
test("loading приховує порожній стан до відповіді", async () => {
  const pending = deferred(); bookingService.getAll.mockReturnValueOnce(pending.promise); renderApp();
  expect(screen.getByText("Завантаження записів…")).toBeInTheDocument();
  expect(screen.queryByText("Записів ще немає")).not.toBeInTheDocument();
  await act(async () => { pending.resolve([savedBooking]); await pending.promise; });
  expect(await screen.findByText(savedBooking.clientName)).toBeInTheDocument();
});
test("відмова getAll і повтор відновлюють дані", async () => {
  bookingService.getAll.mockRejectedValueOnce(new ServiceError("Навчальна відмова."));
  const user = renderApp(); expect(await screen.findByRole("alert")).toHaveTextContent("Навчальна відмова.");
  await user.click(screen.getByRole("button", { name: "Спробувати ще раз" }));
  expect(await screen.findByText(savedBooking.clientName)).toBeInTheDocument();
});
test("порожня успішна колекція має наступну дію без помилки", async () => {
  bookingService.getAll.mockResolvedValueOnce([]); renderApp();
  expect(await screen.findByText("Записів ще немає")).toBeInTheDocument();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.queryByRole("table")).not.toBeInTheDocument();
});
test.each([
  ["/bookings/booking-test-1", "Тестовий Клієнт"],
  ["/bookings/booking-test-1/edit", "Редагування запису"],
  ["/bookings/missing", "Запис не знайдено"],
  ["/unknown", "Сторінку не знайдено"]
])("маршрут %s відкриває потрібний екран", async (path, title) => {
  renderApp(path); expect(await screen.findByRole("heading", { name: title, exact: true })).toBeInTheDocument();
});
test("параметр послуги з каталогу заповнює форму", async () => {
  renderApp("/bookings/new?serviceId=beard");
  expect(await screen.findByRole("combobox", { name: /Послуга/ })).toHaveValue("beard");
});
test("невідома послуга не підставляється в нову форму", async () => {
  renderApp("/bookings/new?serviceId=missing");
  expect(await screen.findByRole("combobox", { name: /Послуга/ })).toHaveValue("");
});
test("URL без збігів і скидання не змінюють джерело", async () => {
  const user = renderApp("/bookings?q=немаєтакого&serviceId=all");
  expect(await screen.findByText("За цими параметрами нічого не знайдено")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Очистити фільтри" }));
  expect(screen.getByText(savedBooking.clientName)).toBeInTheDocument();
  expect(bookingService.delete).not.toHaveBeenCalled();
});
test("створення відкриває саме підтверджений сервісом id", async () => {
  bookingService.getAll.mockResolvedValueOnce([]); const pending = deferred();
  bookingService.create.mockReturnValueOnce(pending.promise);
  const user = renderApp("/bookings/new?serviceId=haircut");
  await screen.findByRole("combobox", { name: /Послуга/ }); await fillBookingForm(user);
  await user.click(screen.getByRole("button", { name: "Створити запис", exact: true }));
  expect(screen.getByTestId("location")).toHaveTextContent("/bookings/new");
  await act(async () => { pending.resolve({ ...validInput, id: "server-confirmed" }); await pending.promise; });
  expect(await screen.findByRole("heading", { name: validInput.clientName })).toBeInTheDocument();
  expect(screen.getByTestId("location")).toHaveTextContent("/bookings/server-confirmed");
  expect(bookingService.create).toHaveBeenCalledOnce();
  expect(bookingService.create).toHaveBeenCalledWith(validInput);
});
test("редагування оновлює спільні деталі та зберігає id", async () => {
  const user = renderApp("/bookings/booking-test-1/edit");
  const field = await screen.findByRole("textbox", { name: /Побажання/ });
  await user.clear(field); await user.type(field, "Нові побажання");
  await user.click(screen.getByRole("button", { name: "Зберегти зміни" }));
  await screen.findByRole("heading", {
  name: validInput.clientName,
  exact: true
});
  expect(await screen.findByText("Нові побажання")).toBeInTheDocument();
  expect(screen.getByTestId("location")).toHaveTextContent("/bookings/booking-test-1");
  expect(bookingService.update).toHaveBeenCalledWith(savedBooking.id, { ...validInput, notes: "Нові побажання" });
});
test("скасований діалог не викликає delete", async () => {
  vi.spyOn(window, "confirm").mockReturnValue(false); const user = renderApp("/bookings/booking-test-1");
  await screen.findByRole("heading", { name: validInput.clientName });
  await user.click(screen.getByRole("button", { name: "Видалити запис" }));
  expect(bookingService.delete).not.toHaveBeenCalled();
});
test("відмова видалення залишає запис і адресу", async () => {
  vi.spyOn(window, "confirm").mockReturnValue(true);
  bookingService.delete.mockRejectedValueOnce(new ServiceError("Не вдалося видалити."));
  const user = renderApp("/bookings/booking-test-1"); await screen.findByRole("heading", { name: validInput.clientName });
  await user.click(screen.getByRole("button", { name: "Видалити запис" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Не вдалося видалити.");
  expect(screen.getByRole("heading", { name: validInput.clientName })).toBeInTheDocument();
  expect(screen.getByTestId("location")).toHaveTextContent("/bookings/booking-test-1");
});
test("підтверджене видалення прибирає запис зі спільного списку", async () => {
  vi.spyOn(window, "confirm").mockReturnValue(true); const user = renderApp("/bookings/booking-test-1");
  await screen.findByRole("heading", { name: validInput.clientName });
  await user.click(screen.getByRole("button", { name: "Видалити запис" }));
  expect(await screen.findByText("Записів ще немає")).toBeInTheDocument();
  expect(bookingService.delete).toHaveBeenCalledWith(savedBooking.id);
});
