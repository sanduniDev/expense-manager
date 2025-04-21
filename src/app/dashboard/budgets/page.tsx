"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Edit2, Plus, Trash2, AlertCircle } from "lucide-react";
import { useBudgets } from "@/hooks/use-budget";
import { getCurrentMonthYear, formatBudgetPeriod } from "@/lib/dates";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Budget } from "@/types/types";
import { z } from "zod";
import CreateBudgetDialog from "@/components/budget/create-budget-dialog";
import UpdateBudgetDialog from "@/components/budget/update-budget-dialog";
import DeleteBudgetDialog from "@/components/budget/delete-budget-dialog";
const EXPENSE_CATEGORIES = [
  "Food",
  "Housing",
  "Transport",
  "Utilities",
  "Entertainment",
  "Healthcare",
  "Other Expense",
];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const budgetSchema = z.object({
  category: z.enum(EXPENSE_CATEGORIES as [string, ...string[]], {
    required_error: "Please select a category",
  }),
  amount: z.coerce
    .number({
      required_error: "Please enter an amount",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be greater than 0")
    .min(0.01, "Amount must be at least 0.01"),
  period: z.enum(["weekly", "monthly", "yearly"], {
    required_error: "Please select a period",
  }),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

export default function BudgetPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);

  const { budgets, isLoading, createMutation, updateMutation, deleteMutation } =
    useBudgets();

  const currentMonthYear = getCurrentMonthYear();

  const { data: spentAmounts = {}, isLoading: isLoadingSpent } = useQuery<
    Record<string, number>
  >({
    queryKey: ["spentAmounts", currentMonthYear],
    queryFn: async () => {
      const res = await fetch(
        `/api/transactions/spent-amounts?monthYear=${currentMonthYear}`
      );
      if (!res.ok) throw new Error("Failed to fetch spent amounts");
      return res.json();
    },
  });

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const openUpdateDialog = (budget: Budget) => {
    console.log(budget);

    setEditingBudget(budget);
    setIsUpdateDialogOpen(true);
  };

  const closeUpdateDialog = () => {
    setEditingBudget(null);
    setIsUpdateDialogOpen(false);
  };

  const openDeleteDialog = (budgetId: string) => {
    setBudgetToDelete(budgetId);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setBudgetToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleCreateBudget = (values: BudgetFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Budget created successfully");
        closeCreateDialog();
      },
      onError: (error) => {
        toast.error(`Failed to create budget: ${error.message}`);
      },
    });
  };

  const handleUpdateBudget = (budget: Budget) => {
    updateMutation.mutate(budget, {
      onSuccess: () => {
        toast.success("Budget updated successfully");
        closeUpdateDialog();
      },
      onError: (error) => {
        toast.error(`Failed to update budget: ${error.message}`);
      },
    });
  };

  const handleDeleteBudget = () => {
    if (budgetToDelete) {
      deleteMutation.mutate(budgetToDelete, {
        onSuccess: () => {
          toast.success("Budget deleted successfully");
          closeDeleteDialog();
        },
        onError: (error) => {
          toast.error(`Failed to delete budget: ${error.message}`);
        },
      });
    }
  };

  // Calculate totals
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = Object.values(spentAmounts).reduce(
    (sum, amount) => sum + amount,
    0
  );
  const totalRemaining = totalBudget - totalSpent;
  const totalPercentage =
    totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  if (isLoading || isLoadingSpent) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Budget Management
          </h2>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Budget
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card data-testid="total-budget-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalBudget.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Current month: {currentMonthYear}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {totalPercentage.toFixed(1)}% of total budget
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalRemaining.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Available to spend
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Budget Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalPercentage.toFixed(1)}%
              </div>
              <Progress value={totalPercentage} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Budget Alert */}
        {totalPercentage > 90 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Budget Alert</AlertTitle>
            <AlertDescription>
              You&apos;ve used {totalPercentage.toFixed(1)}% of your total
              budget. Consider reviewing your spending.
            </AlertDescription>
          </Alert>
        )}

        {/* Budget Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => {
            const spent = spentAmounts[budget.category] || 0;
            const percentage = (spent / budget.amount) * 100;
            const isOverBudget = percentage > 100;
            const isNearLimit = percentage > 80 && percentage <= 100;

            return (
              <Card
                key={budget.id}
                className={
                  isOverBudget
                    ? "border-red-500"
                    : isNearLimit
                    ? "border-amber-500"
                    : ""
                }
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{budget.category}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openUpdateDialog(budget)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(budget.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    {formatBudgetPeriod(budget.period)} budget
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        Budget: ${budget.amount.toFixed(2)}
                      </p>
                      <p className="text-sm">Spent: ${spent.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Remaining</p>
                      <p
                        className={`text-sm font-bold ${
                          isOverBudget ? "text-red-500" : ""
                        }`}
                      >
                        ${(budget.amount - spent).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Progress
                      value={percentage > 100 ? 100 : percentage}
                      className={`${
                        isOverBudget
                          ? "bg-red-200"
                          : isNearLimit
                          ? "bg-amber-200"
                          : ""
                      }`}
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </CardContent>
                {(isOverBudget || isNearLimit) && (
                  <CardFooter className="pt-0">
                    <Alert
                      variant={isOverBudget ? "destructive" : "default"}
                      className="w-full py-2"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        {isOverBudget
                          ? `Exceeded by $${(spent - budget.amount).toFixed(2)}`
                          : `${percentage.toFixed(1)}% spent`}
                      </AlertDescription>
                    </Alert>
                  </CardFooter>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Create Budget Dialog */}
      <CreateBudgetDialog
        isOpen={isCreateDialogOpen}
        onClose={closeCreateDialog}
        onCreateBudget={handleCreateBudget}
        isPending={createMutation.isPending}
      />

      {/* Update Budget Dialog */}
      <UpdateBudgetDialog
        isOpen={isUpdateDialogOpen}
        onClose={closeUpdateDialog}
        onUpdateBudget={handleUpdateBudget}
        budget={editingBudget}
        isPending={updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteBudgetDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onDelete={handleDeleteBudget}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
