import { expect, test } from "vitest";
import { validateBooking } from "./bookingValidation.js";
import { toBookingInput } from "../services/bookingContract.js";
import { validInput } from "../test/fixtures.js";
test.each([2, 60])("приймає ім’я граничної довжини %i", length => {
  expect(validateBooking({ ...validInput, clientName: "а".repeat(length) })).toEqual({});
});
test.each([1, 61])("відхиляє ім’я довжини %i", length => {
  expect(validateBooking({ ...validInput, clientName: "а".repeat(length) }).clientName).toBeTruthy();
});
test("телефон має містити щонайменше десять цифр, а не десять символів", () => {
  expect(validateBooking({ ...validInput, phone: "123 456 789" }).phone).toBeTruthy();
});
test.each(["2099-02-30", "2020-01-01"])("відхиляє некоректну або минулу дату %s", date => {
  expect(validateBooking({ ...validInput, date }).date).toBeTruthy();
});
test("відхиляє послугу поза локальним каталогом", () => {
  expect(validateBooking({ ...validInput, serviceId: "missing" }).serviceId).toBeTruthy();
});
test("приймає 300 символів побажань, відхиляє 301", () => {
  expect(validateBooking({ ...validInput, notes: "а".repeat(300) })).toEqual({});
  expect(validateBooking({ ...validInput, notes: "а".repeat(301) }).notes).toBeTruthy();
});
test("нормалізує команду, відкидає id і не змінює введення", () => {
  const input = Object.freeze({ ...validInput, clientName: ` ${validInput.clientName} `, id: "injected" });
  expect(toBookingInput(input)).toEqual(validInput);
  expect(input.clientName.startsWith(" ")).toBe(true);
});
