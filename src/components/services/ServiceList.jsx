import ServiceCard from "./ServiceCard";

export default function ServiceList({
  services = [],
  selectedId = null,
  onSelect = () => {},
}) {
  return (
    <div className="service-grid">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          selected={service.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
