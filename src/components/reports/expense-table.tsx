"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "@prisma/client";

interface ExpenseTableProps {
  type: "all" | "income" | "expense";
  startDate: Date;
  endDate: Date;
}
interface TransactionTotals {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  totalCount: number;
}
export function ExpenseTable({ type, startDate, endDate }: ExpenseTableProps) {
  const { data } = useQuery({
    queryKey: ["reports", "transactions", type, startDate, endDate],
    queryFn: async () => {
      const res = await fetch(
        `/api/reports/transactions?type=${type}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      return res.json();
    },
  });

  const transactions = data?.transactions || [];
  const totals: TransactionTotals = data?.totals || {
    totalIncome: 0,
    totalExpenses: 0,
    netAmount: 0,
    totalCount: 0,
  };
  // Calculate totals

  return (
    <div className="space-y-4">
      {/* Totals Section */}
      <div className="grid gap-2 md:grid-cols-3">
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium text-muted-foreground">
            Total Income
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            ${totals.totalIncome.toFixed(2)}
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium text-muted-foreground">
            Total Expenses
          </div>
          <div className="text-2xl font-bold text-red-600">
            ${totals.totalExpenses.toFixed(2)}
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium text-muted-foreground">
            Net Amount
          </div>
          <div
            className={`text-2xl font-bold ${
              totals.netAmount >= 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            ${totals.netAmount.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((transaction: Transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{transaction.category}</Badge>
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className="capitalize">{transaction.type}</TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    transaction.type === "income"
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}$
                  {transaction.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
