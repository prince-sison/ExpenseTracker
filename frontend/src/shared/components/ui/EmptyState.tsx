import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-10 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-base-content/70">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
