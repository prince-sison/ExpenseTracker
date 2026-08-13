import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DailySpending } from "./dashboard.types";

interface DailySpendingChartProps {
  dailySpending: DailySpending[];
}

export default function DailySpendingChart({
  dailySpending,
}: DailySpendingChartProps) {
  const chartData = dailySpending.map((item) => ({
    day: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    total: item.total,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" />
      </BarChart>
    </ResponsiveContainer>
  );
}
