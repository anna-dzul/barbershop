# Контракт запису клієнта

Команда: clientName, phone, serviceId, date, time, notes — рядки.
Пробіли обрізаються, зайві поля відкидаються. Каталог послуг локальний.
Запис: команда + непорожній рядковий id, createdAt, можливий updatedAt.
Джерело створює id; update замінює всі редаговані поля і зберігає id.
Прочитані історичні записи перевіряються за структурою, дата в минулому не приховує історію.

| Метод | Успіх Promise | Відмова |
| --- | --- | --- |
| getAll({signal} = {}) | масив, включно з [] | ServiceError або AbortError |
| getById(id, {signal} = {}) | один запис | NOT_FOUND, ServiceError, AbortError |
| create(input) | повний створений запис | VALIDATION, STORAGE_WRITE, MOCK_FAILURE, мережа |
| update(id, input) | повний оновлений запис | також NOT_FOUND |
| delete(id) | undefined | NOT_FOUND або помилка операції |

ServiceError: message, code, необов’язкові status і errors.
Провайдер: {ok:true, booking} або {ok:false, message, errors, code}.
При delete booking дорівнює undefined. Автоматичного повтору запису немає.

REST контракт підготовленого адаптера:
GET /bookings → 200 масив; GET /bookings/:id → 200 запис;
POST /bookings → 201 створений запис; PUT /bookings/:id → 200 оновлений запис;
DELETE /bookings/:id → 204 без тіла. 404 означає NOT_FOUND.
Відповіді мають бути JSON без зовнішньої обгортки. Числові id чи інші поля
потрібно явно адаптувати під час фактичного підключення.
response.ok перевіряється до JSON, для 204 тіло не читається, id кодується.
Помилка API не перемикає програму на mock. Сумісний API не надано.
