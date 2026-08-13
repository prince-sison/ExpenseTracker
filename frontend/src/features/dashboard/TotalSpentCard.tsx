import CurrencyDisplay from "@/shared/components/ui/CurrencyDisplay";

interface TotalSpentCardProps {
  total: number;
}

export default function TotalSpentCard({ total }: TotalSpentCardProps) {
  return (
    <div className="stats shadow">
      <div className="stat">
        <div className="stat-title">Total Spent</div>
        <div className="stat-value text-primary">
          <CurrencyDisplay amount={total}></CurrencyDisplay>
        </div>
      </div>
    </div>
  );
}
