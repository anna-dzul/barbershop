import { expect, test } from "vitest";
import { selectBookings } from "./selectBookings.js";
import { savedBooking } from "../test/fixtures.js";
test("поєднує пошук, послугу й порядок, не змінюючи колекцію", () => {
  const records = Object.freeze([
    Object.freeze({ ...savedBooking, id: "late", time: "15:00" }),
    Object.freeze({ ...savedBooking, id: "early", time: "10:00" }),
    Object.freeze({ ...savedBooking, id: "other", serviceId: "beard" })
  ]);
  expect(selectBookings(records, { q: " ТЕСТОВИЙ ", serviceId: "haircut" }).map(x => x.id)).toEqual(["early", "late"]);
  expect(records.map(x => x.id)).toEqual(["late", "early", "other"]);
});
test("порожній результат не видаляє джерело", () => {
  const records = [savedBooking];
  expect(selectBookings(records, { q: "немаєтакого" })).toEqual([]);
  expect(records).toEqual([savedBooking]);
});
