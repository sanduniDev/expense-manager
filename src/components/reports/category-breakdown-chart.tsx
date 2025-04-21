"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface CategoryBreakdownChartProps {
  startDate: Date;
  endDate: Date;
}

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#94a3b8",
];

export function CategoryBreakdownChart({
  startDate,
  endDate,
}: CategoryBreakdownChartProps) {
  const { data } = useQuery({
    queryKey: ["reports", "categories", startDate, endDate],
    queryFn: async () => {
      const res = await fetch(
        `/api/reports/categories?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      return res.json();
    },
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        >
          {data?.map((entry: object, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
