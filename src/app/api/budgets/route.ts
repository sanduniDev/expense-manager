import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getsession } from "@/auth";
import { getCurrentMonthYear } from "@/lib/dates";
export async function GET() {
    const session = await getsession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const currentMonthYear = getCurrentMonthYear();
        const budgets = await prisma.budget.findMany({
            where: {
                userId: session.user.id,
                monthYear: currentMonthYear
            }
        });

        return NextResponse.json(budgets);
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: "Failed to fetch budgets" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const session = await getsession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { category, amount, period } = await request.json();
        const currentMonthYear = getCurrentMonthYear();

        const existingBudget = await prisma.budget.findFirst({
            where: {
                userId: session.user.id,
                category,
                monthYear: currentMonthYear
            }
        });

        if (existingBudget) {
            return NextResponse.json(
                { error: "Budget for this category already exists" },
                { status: 400 }
            );
        }

        const newBudget = await prisma.budget.create({
            data: {
                userId: session.user.id,
                category,
                amount: parseFloat(amount),
                period,
                monthYear: currentMonthYear
            }
        });

        return NextResponse.json(newBudget);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Failed to create or update budget" },
            { status: 500 }
        );
    }
}
