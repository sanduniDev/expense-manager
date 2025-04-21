"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonthlyExpenseChart } from "@/components/reports/monthly-expense-chart";
import { CategoryBreakdownChart } from "@/components/reports/category-breakdown-chart";
import { ExpenseTable } from "@/components/reports/expense-table";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsPage() {
  const { data: session } = useSession();
  const [period, setPeriod] = useState("3months");
  const [reportType, setReportType] = useState("summary");

  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (period) {
    case "thisMonth":
      startDate = startOfMonth(now);
      endDate = now; // Up to today in the current month
      break;
    case "1month":
      startDate = startOfMonth(subMonths(now, 1));
      endDate = endOfMonth(subMonths(now, 1));
      break;
    case "3months":
      startDate = startOfMonth(subMonths(now, 3));
      endDate = endOfMonth(subMonths(now, 1)); // End at last month
      break;
    case "6months":
      startDate = startOfMonth(subMonths(now, 6));
      endDate = endOfMonth(subMonths(now, 1)); // End at last month
      break;
    case "12months":
      startDate = startOfMonth(subMonths(now, 12));
      endDate = endOfMonth(subMonths(now, 1)); // End at last month
      break;
    default:
      startDate = startOfMonth(subMonths(now, 3));
      endDate = endOfMonth(subMonths(now, 1)); // End at last month
  }

  const { data: summaryData, isLoading } = useQuery({
    queryKey: ["reports", "summary", period],
    queryFn: async () => {
      const res = await fetch(
        `/api/reports/summary?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      return res.json();
    },
    enabled: !!session?.user,
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Financial Reports
          </h2>
          <div className="w-[300px]">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-full" id="period">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="12months">Last 12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold text-emerald-600">
                  ${summaryData?.totalIncome?.toFixed(2) || "0.00"}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold text-red-600">
                  ${summaryData?.totalExpenses?.toFixed(2) || "0.00"}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">
                  ${summaryData?.netSavings?.toFixed(2) || "0.00"}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Savings Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">
                  {summaryData?.savingsRate?.toFixed(1) || "0.0"}%
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Timeline Overview</CardTitle>
                <CardDescription>Income vs. Expenses over time</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <MonthlyExpenseChart startDate={startDate} endDate={endDate} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>By category</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryBreakdownChart startDate={startDate} endDate={endDate} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Reports</CardTitle>
            <CardDescription>
              View detailed financial reports by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="summary"
              value={reportType}
              onValueChange={setReportType}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
              </TabsList>
              <TabsContent value="summary">
                <ExpenseTable
                  type="all"
                  startDate={startDate}
                  endDate={endDate}
                />
              </TabsContent>
              <TabsContent value="income">
                <ExpenseTable
                  type="income"
                  startDate={startDate}
                  endDate={endDate}
                />
              </TabsContent>
              <TabsContent value="expenses">
                <ExpenseTable
                  type="expense"
                  startDate={startDate}
                  endDate={endDate}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
