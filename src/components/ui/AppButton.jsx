export default function AppButton({
  children,
  type = "button",
  disabled = false,
  onClick
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}