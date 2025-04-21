// src/app/api/dashboard/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getsession } from "@/auth";
import { subMonths, format, startOfMonth, endOfMonth } from "date-fns";

export async function GET() {
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

        return NextResponse.json(
            // ... other dashboard data
            formattedOverview
            // ... rest of the response
        );

    } catch (error) {
        console.error("Error fetching overview data:", error);
        return NextResponse.json(
            { error: "Failed to fetch overview data" },
            { status: 500 }
        );
    }
}