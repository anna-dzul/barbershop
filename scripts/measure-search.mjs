import { performance } from 'node:perf_hooks';
import { selectBookings } from '../src/domain/selectBookings.js';
import { initialBookings } from '../src/data/bookings.js';
// Вимірюється тільки обчислення пошуку, без DOM, React і затримки сервісу.
const options = { q: 'Олександр', serviceId: 'all', sort: 'date-asc' };
const repetitions = 1000;
for (let i = 0; i < 100; i++) selectBookings(initialBookings, options);
const samples = [];
for (let round = 0; round < 7; round++) {
  const started = performance.now();
  for (let i = 0; i < repetitions; i++) selectBookings(initialBookings, options);
  samples.push((performance.now() - started) / repetitions);
}
const sorted = [...samples].sort((a, b) => a - b);
console.log(JSON.stringify({ runtime: process.version, records: initialBookings.length,
  query: options.q, repetitions, samplesMs: samples, medianMs: sorted[3],
  scope: 'Лише чиста функція selectBookings у Node.js; не швидкість браузера.' }, null, 2));
