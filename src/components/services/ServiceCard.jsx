import { useState } from "react";
import AppButton from "../ui/AppButton";

export default function ServiceCard({
  service,
  selected,
  onSelect
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  function handleToggle() {
    setDetailsOpen((previous) => !previous);
  }

  return (
    <article className="service-card">
      <h3>{service.name}</h3>

      <p>{service.duration}</p>

      <strong>{service.price} грн</strong>

      <AppButton onClick={handleToggle}>
        {detailsOpen ? "Сховати опис" : "Показати опис"}
      </AppButton>

      {detailsOpen && (
        <p>{service.description}</p>
      )}

      <AppButton onClick={() => onSelect(service.id)}>
        {selected ? "Обрано" : "Вибрати"}
      </AppButton>

      {selected && (
        <p className="selection-note">
          Цю послугу вибрано для запису.
        </p>
      )}
    </article>
  );
}
