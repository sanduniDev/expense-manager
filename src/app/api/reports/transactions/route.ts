// src/app/api/reports/transactions/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getsession } from "@/auth";
export async function GET(request: Request) {
    const session = await getsession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") || "all";
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        // Base where clause
        const where: {
            userId: string;
            date: {
                gte?: Date;
                lte?: Date;
            };
            type?: string;
        } = {
            userId: session.user.id,
            date: {
                gte: startDate ? new Date(startDate) : undefined,
                lte: endDate ? new Date(endDate) : undefined,
            }
        };

        // Add type filter if specified
        if (type !== "all") {
            where.type = type;
        }

        // Fetch transactions
        const transactions = await prisma.transaction.findMany({
            where,
            orderBy: { date: "desc" },
        });

        // Calculate aggregates
        const aggregates = await prisma.transaction.aggregate({
            where,
            _sum: {
                amount: true
            },
            _count: true
        });

        // Calculate totals
        const income = await prisma.transaction.aggregate({
            where: { ...where, type: "income" },
            _sum: { amount: true }
        });

        const expenses = await prisma.transaction.aggregate({
            where: { ...where, type: "expense" },
            _sum: { amount: true }
        });

        return NextResponse.json({
            transactions,
            totals: {
                totalIncome: income._sum.amount || 0,
                totalExpenses: expenses._sum.amount || 0,
                netAmount: (income._sum.amount || 0) - (expenses._sum.amount || 0),
                totalCount: aggregates._count
            }
        });

    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        return NextResponse.json(
            { error: "Failed to fetch transactions" },
            { status: 500 }
        );
    }
}