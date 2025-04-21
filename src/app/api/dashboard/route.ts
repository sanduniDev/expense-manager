import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getsession } from "@/auth";
import { getCurrentMonth, getPreviousMonth } from "@/lib/dates";
import { Budget } from "@prisma/client";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";

export async function GET() {
    const session = await getsession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const currentMonth = getCurrentMonth();
        const previousMonth = getPreviousMonth();

        // Get balance data
        const income = await prisma.transaction.aggregate({
            _sum: { amount: true },
            where: {
                userId: session.user.id,
                type: "income",
                date: { gte: currentMonth.start }
            }
        });

        const expenses = await prisma.transaction.aggregate({
            _sum: { amount: true },
            where: {
                userId: session.user.id,
                type: "expense",
                date: { gte: currentMonth.start }
            }
        });

        // Monthly comparisons
        const currentMonthIncome = await prisma.transaction.aggregate({
            _sum: { amount: true },
            where: {
                userId: session.user.id,
                type: "income",
                date: { gte: currentMonth.start }
            }
        });

        const previousMonthIncome = await prisma.transaction.aggregate({
            _sum: { amount: true },
            where: {
                userId: session.user.id,
                type: "income",
                date: { gte: previousMonth.start, lt: previousMonth.end }
            }
        });
        const previousMonthExpenses = await prisma.transaction.aggregate({
            _sum: { amount: true },
            where: {
                userId: session.user.id,
                type: "expense",
                date: { gte: previousMonth.start, lt: previousMonth.end }
            }
        });

        const currentMonthExpenses = await prisma.transaction.aggregate({
            _sum: { amount: true },
            where: {
                userId: session.user.id,
                type: "expense",
                date: { gte: currentMonth.start }
            }
        });

        // Budget data
        const budgets = await prisma.budget.findMany({
            where: {
                userId: session.user.id,
                monthYear: getCurrentMonth().formatted
            }
        });

        const spentAmounts = await prisma.transaction.groupBy({
            by: ['category'],
            _sum: { amount: true },
            where: {
                userId: session.user.id,
                type: "expense",
                date: { gte: currentMonth.start }
            }
        });

        // Recent transactions
        const recentTransactions = await prisma.transaction.findMany({
            where: {
                userId: session.user.id,
                date: { gte: currentMonth.start }
            },
            orderBy: { date: "desc" },
            take: 5,

        });

        return NextResponse.json({
            totalBalance: (income._sum.amount || 0) - (expenses._sum.amount || 0),
            monthlyIncome: currentMonthIncome._sum.amount || 0,
            monthlyExpenses: currentMonthExpenses._sum.amount || 0,
            incomeChange: calculatePercentageChange(
                currentMonthIncome._sum.amount || 0,
                previousMonthIncome._sum.amount || 0
            ),
            expenseChange: calculatePercentageChange(
                currentMonthExpenses._sum.amount || 0,
                previousMonthExpenses._sum.amount || 0
            ),
            budgetStatus: calculateBudgetStatus(budgets, spentAmounts),
            overviw: overviewData(),
            recentTransactions
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: "Failed to fetch dashboard data" },
            { status: 500 }
        );
    }
}

function calculatePercentageChange(current: number, previous: number) {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
}

function calculateBudgetStatus(budgets: Budget[], spentAmounts: { category: string; _sum: { amount: number | null } }[]) {
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = spentAmounts.reduce((sum, s) => sum + (s._sum.amount || 0), 0);
    return totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
}

async function overviewData() {
    const session = await getsession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Calculate date range for last 6 months
        const currentDate = new Date();
        const sixMonthsAgo = subMonths(currentDate, 5); // Get starting point for 6 months range

        // Generate array of last 6 months
        const months = Array.from({ length: 6 }, (_, i) => {
            const date = subMonths(currentDate, 5 - i);
            return {
                start: startOfMonth(date),
                end: endOfMonth(date),
                name: format(date, "MMM yy")
            };
        });

        // Get transactions for the last 6 months
        const transactions = await prisma.transaction.findMany({
            where: {
                userId: session.user.id,
                date: {
                    gte: sixMonthsAgo,
                    lte: currentDate
                }
            }
        });

        // Initialize overview data structure
        const overviewData = months.map(month => ({
            name: month.name,
            income: 0,
            expense: 0
        }));

        // Calculate totals for each month
        transactions.forEach(transaction => {
            const transactionDate = new Date(transaction.date);
            const monthIndex = months.findIndex(m =>
                transactionDate >= m.start && transactionDate <= m.end
            );

            if (monthIndex !== -1) {
                if (transaction.type === "income") {
                    overviewData[monthIndex].income += transaction.amount;
                } else {
                    overviewData[monthIndex].expense += transaction.amount;
                }
            }
        });

        // Format the numbers
        const formattedOverview = overviewData.map(month => ({
            ...month,
            income: Number(month.income.toFixed(2)),
            expense: Number(month.expense.toFixed(2))
        }));

        return formattedOverview

    } catch (error) {
        console.error("Error fetching overview data:", error);
        return NextResponse.json(
            { error: "Failed to fetch overview data" },
            { status: 500 }
        );
    }
}