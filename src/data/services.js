export const services = [
  { id: "haircut", name: "Чоловіча стрижка", category: "Стрижки", description: "Класична чоловіча стрижка з укладанням.", duration: 45, price: 400, available: true },
  { id: "beard", name: "Стрижка бороди", category: "Борода", description: "Акуратне оформлення та моделювання бороди.", duration: 30, price: 250, available: true },
  { id: "combo", name: "Стрижка + борода", category: "Комплекси", description: "Комплексна стрижка волосся та оформлення бороди.", duration: 75, price: 600, available: true },
  { id: "styling", name: "Укладання", category: "Догляд", description: "Фінальне укладання та рекомендації з догляду.", duration: 20, price: 180, available: true }
];

export function getServiceById(id) {
  return services.find((service) => service.id === id);
}
