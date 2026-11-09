import { afterEach, expect, test, vi } from "vitest";
import { createApiBookingService } from "./apiBookingService.js";
import { savedBooking } from "../test/fixtures.js";
afterEach(() => vi.unstubAllGlobals());
const base = "https://example.test/api";
test("HTTP 404 відхиляється як NOT_FOUND", async () => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 404 })); vi.stubGlobal("fetch", fetchMock);
  await expect(createApiBookingService(base).getById("missing")).rejects.toMatchObject({ code: "NOT_FOUND", status: 404 });
  expect(fetchMock).toHaveBeenCalledWith(`${base}/bookings/missing`, expect.objectContaining({ method: "GET" }));
});
test("DELETE 204 не читає JSON і кодує id", async () => {
  const response = new Response(null, { status: 204 }); const json = vi.spyOn(response, "json");
  const fetchMock = vi.fn().mockResolvedValue(response); vi.stubGlobal("fetch", fetchMock);
  await expect(createApiBookingService(base).delete("a/b")).resolves.toBeUndefined();
  expect(json).not.toHaveBeenCalled();
  expect(fetchMock).toHaveBeenCalledWith(`${base}/bookings/a%2Fb`, expect.objectContaining({ method: "DELETE" }));
});
test.each([{ items: [] }, [{ ...savedBooking, clientName: 7 }], [savedBooking, savedBooking]])("некоректні дані не доходять до UI %#", async body => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status: 200 })));
  await expect(createApiBookingService(base).getAll()).rejects.toMatchObject({ code: "BAD_DATA" });
});
