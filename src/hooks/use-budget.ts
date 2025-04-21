"use client"

import { Budget } from "@/types/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useBudgets = () => {
    const queryClient = useQueryClient();

    const { data: budgets = [], isLoading } = useQuery<Budget[]>({
        queryKey: ["budgets"],
        queryFn: async () => {
            const res = await fetch("/api/budgets");
            if (!res.ok) throw new Error("Failed to fetch budgets");
            return res.json();
        }
    });

    const createMutation = useMutation({
        mutationFn: async (newBudget: Omit<Budget, "id" | "monthYear">) => {
            const res = await fetch("/api/budgets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newBudget)
            });
            const data = await res.json();
            if (!res.ok) {

                throw new Error(data.error || "Failed to create budget");
            }
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budgets"] }),
        onError: (error: Error) => {
            throw new Error(error.message)
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (updatedBudget: Budget) => {
            const res = await fetch(`/api/budgets/${updatedBudget.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    category: updatedBudget.category,
                    amount: updatedBudget.amount,
                    period: updatedBudget.period
                })
            });
            if (!res.ok) {
                throw new Error("Failed to update budget");
            }
            return res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budgets"] })
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
            if (!res.ok) {
                throw new Error("Failed to delete budget");
            }
            return res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budgets"] })
    });

    return {
        budgets,
        isLoading,
        createMutation,
        updateMutation,
        deleteMutation
    };
};