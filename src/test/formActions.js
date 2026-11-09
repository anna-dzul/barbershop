import { fireEvent, screen } from "@testing-library/react";
import { validInput } from "./fixtures.js";
export async function fillBookingForm(user) {
  await user.type(screen.getByRole("textbox", { name: /Ім’я клієнта/ }), ` ${validInput.clientName} `);
  await user.type(screen.getByRole("textbox", { name: /Номер телефону/ }), validInput.phone);
  await user.selectOptions(screen.getByRole("combobox", { name: /Послуга/ }), validInput.serviceId);
  // Нативні date/time не мають ролі textbox: шукаємо за підписом.
  fireEvent.change(screen.getByLabelText(/Бажана дата/), { target: { value: validInput.date } });
  fireEvent.change(screen.getByLabelText(/Бажаний час/), { target: { value: validInput.time } });
  await user.type(screen.getByRole("textbox", { name: /Побажання/ }), validInput.notes);
}
