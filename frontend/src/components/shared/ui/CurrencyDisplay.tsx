interface CurrencyDisplayProps {
  amount: number;
  currency?: string;
  locale?: string;
  className?: string;
}

export default function CurrencyDisplay({
  amount,
  currency = "PHP",
  locale = "en-PH",
  className,
}: CurrencyDisplayProps) {
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);

  return <span className={className}>{formatted}</span>;
}
