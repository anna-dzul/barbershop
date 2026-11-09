import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { mockBookingService as service, failNextMockBooking, setMockDelay } from './mockBookingService.js';
import { validInput } from '../test/fixtures.js';
beforeEach(() => { localStorage.clear(); setMockDelay(600); vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); localStorage.clear(); });
async function complete(promise) { await vi.runAllTimersAsync(); return promise; }
test('створений запис читається повторно зі сховища', async () => {
  const created = await complete(service.create(validInput));
  expect(created.id).toEqual(expect.any(String));
  expect(await complete(service.getById(created.id))).toEqual(created);
  expect(JSON.parse(localStorage.getItem('barbershop.bookings.v1'))).toContainEqual(created);
});
test('після видалення всіх записів порожня колекція зберігається', async () => {
  for (const record of await complete(service.getAll())) await complete(service.delete(record.id));
  expect(await complete(service.getAll())).toEqual([]);
  expect(localStorage.getItem('barbershop.bookings.v1')).toBe('[]');
});
test('відмова create не змінює сховище', async () => {
  failNextMockBooking('create');
  const pending = service.create(validInput);
  const assertion = expect(pending).rejects.toMatchObject({ code: 'MOCK_FAILURE' });
  await vi.runAllTimersAsync(); await assertion;
  expect(localStorage.getItem('barbershop.bookings.v1')).toBeNull();
});
