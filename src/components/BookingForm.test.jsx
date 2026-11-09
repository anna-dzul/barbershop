import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { expect, test, vi } from "vitest";
import BookingForm from "./BookingForm.jsx";
import { validInput, savedBooking } from "../test/fixtures.js";
import { deferred } from "../test/deferred.js";
import { fillBookingForm } from "../test/formActions.js";
function editor(onSubmit) {
  render(<MemoryRouter><BookingForm onSubmit={onSubmit} submitLabel="Створити запис" /></MemoryRouter>);
}
test("некоректна форма не викликає збереження й фокусує перше поле", async () => {
  const onSubmit = vi.fn(); const user = userEvent.setup(); editor(onSubmit);
  await user.click(screen.getByRole("button", { name: "Створити запис" }));
  const field = screen.getByRole("textbox", { name: /Ім’я клієнта/ });
  expect(field).toHaveAttribute("aria-invalid", "true");
  expect(field).toHaveFocus();
  expect(onSubmit).not.toHaveBeenCalled();
});
test("до відповіді блокує повтор і передає нормалізовані поля", async () => {
  const pending = deferred(); const onSubmit = vi.fn().mockReturnValue(pending.promise);
  const user = userEvent.setup(); editor(onSubmit); await fillBookingForm(user);
  await user.click(screen.getByRole("button", { name: "Створити запис" }));
  const button = screen.getByRole("button", { name: "Збереження…" });
  expect(button).toBeDisabled();
  expect(screen.getByRole("textbox", { name: /Ім’я клієнта/ })).toBeDisabled();
  await user.click(button); expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(onSubmit).toHaveBeenCalledWith(validInput);
  await act(async () => { pending.resolve({ ok: true, booking: savedBooking }); await pending.promise; });
  expect(screen.getByRole("button", { name: "Створити запис" })).toBeEnabled();
});
test("після відмови залишає введення й дозволяє свідомий повтор", async () => {
  const onSubmit = vi.fn().mockResolvedValueOnce({ ok: false, message: "Сервіс недоступний." })
    .mockResolvedValueOnce({ ok: true, booking: savedBooking });
  const user = userEvent.setup(); editor(onSubmit); await fillBookingForm(user);
  await user.click(screen.getByRole("button", { name: "Створити запис" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Сервіс недоступний.");
  expect(screen.getByRole("textbox", { name: /Ім’я клієнта/ })).toHaveValue(` ${validInput.clientName} `);
  await user.click(screen.getByRole("button", { name: "Створити запис" }));
  expect(onSubmit).toHaveBeenCalledTimes(2);
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
