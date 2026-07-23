interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

export default function LoadingSpinner({
  size = "md",
  label,
}: LoadingSpinnerProps) {
  const sizeClass = {
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
  }[size];

  return (
    <div className="flex items-center justify-center gap-2 p-4">
      <span className={`loading loading-spinner ${sizeClass}`} />
      {label && <span className="text-base-content/70">{label}</span>}
    </div>
  );
}
