"use client";
import { Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { useDashboards } from "@/hooks/use-dashboard";
import { useOverview } from "@/hooks/use-overview";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboards();
  const overviewData = useOverview();
  if (error) return <div>Error loading dashboard</div>;

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button asChild>
              <Link href="/dashboard/transactions">Add Transaction</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Balance"
            value={data?.totalBalance}
            icon={
              data?.totalBalance < 0 ? (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              ) : (
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              )
            }
            isLoading={isLoading}
          />
          <DashboardCard
            title="Monthly Income"
            value={data?.monthlyIncome}
            change={data?.incomeChange}
            icon={<ArrowUpRight className="h-4 w-4 text-emerald-500" />}
            isLoading={isLoading}
          />
          <DashboardCard
            title="Monthly Expenses"
            value={data?.monthlyExpenses}
            change={data?.expenseChange}
            icon={<ArrowDownRight className="h-4 w-4 text-red-500" />}
            isLoading={isLoading}
          />
          <DashboardCard
            title="Budget Status"
            value={data?.budgetStatus}
            isPercentage
            icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
            isLoading={isLoading}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              {isLoading ? (
                <Skeleton className="h-[350px] w-full" />
              ) : (
                <Overview
                  data={overviewData.data}
                  isLoading={overviewData.isLoading}
                />
              )}
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                {isLoading
                  ? "Loading..."
                  : `${data?.recentTransactions?.length} transactions this month`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-[60px] w-full" />
                  ))}
                </div>
              ) : (
                <RecentTransactions transactions={data?.recentTransactions} />
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/transactions">
                  View All Transactions
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
