"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface DataItem {
  name: string;
  income: number;
  expense: number;
}

export function Overview({
  data,
  isLoading,
}: {
  data?: DataItem[];
  isLoading?: boolean;
}) {
  // Custom tooltip component
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-4 shadow-sm">
          <p className="font-medium text-sm">{label}</p>
          <div className="mt-2 space-y-1">
            <p className="text-emerald-500 text-sm">
              Income: ${payload[0].value.toLocaleString()}
            </p>
            <p className="text-red-500 text-sm">
              Expense: ${payload[1].value.toLocaleString()}
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[350px]" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] text-muted-foreground">
        No financial data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <Tooltip
          cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
          content={<CustomTooltip />}
        />
        <Bar
          dataKey="income"
          name="Income"
          fill="#22c55e"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
        <Bar
          dataKey="expense"
          name="Expense"
          fill="#ef4444"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
