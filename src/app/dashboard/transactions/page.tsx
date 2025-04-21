"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddTransactionDialog } from "@/components/add-transaction-dialog";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Transaction } from "@prisma/client";
import { format } from "date-fns";
export default function TransactionsPage() {
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await fetch("/api/transactions");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!session?.user,
  });

  // Filter transactions based on search query and filters
  const filteredTransactions = transactions.filter(
    (transaction: Transaction) => {
      // Search query filter
      const matchesSearch =
        searchQuery === "" ||
        transaction.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        categoryFilter === "all" || transaction.category === categoryFilter;

      // Type filter
      const matchesType =
        typeFilter === "all" || transaction.type === typeFilter;

      return matchesSearch && matchesCategory && matchesType;
    }
  );

  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(transactions.map((t) => t.category)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              View, search, and filter all your transactions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search transactions..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:w-2/5">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-full" id="category">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full" id="type">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction: Transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {format(
                            new Date(transaction.createdAt),
                            "yyyy-MMM-dd"
                          )}
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {transaction.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {transaction.type === "income" ? (
                              <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                            ) : (
                              <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                            )}
                            <span className="capitalize">
                              {transaction.type}
                            </span>
                          </div>
                        </TableCell>
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddTransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
