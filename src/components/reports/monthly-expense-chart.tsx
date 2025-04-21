"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Line,
  LineChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MonthlyExpenseChartProps {
  startDate: Date;
  endDate: Date;
}

export function MonthlyExpenseChart({
  startDate,
  endDate,
}: MonthlyExpenseChartProps) {
  const { data } = useQuery({
    queryKey: ["reports", "monthly", startDate, endDate],
    queryFn: async () => {
      const res = await fetch(
        `/api/reports/monthly?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      return res.json();
    },
  });

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickFormatter={(value) => format(new Date(value), "MMM yyyy")}
        />
        <YAxis />
        <Tooltip
          formatter={(value: number) => `$${value.toFixed(2)}`}
          labelFormatter={(label) => format(new Date(label), "MMM yyyy")}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="income"
          name="Income"
          stroke="#22c55e"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="expenses"
          name="Expenses"
          stroke="#ef4444"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
