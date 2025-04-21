// src/app/api/reports/monthly/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getsession } from "@/auth";

export async function GET(request: Request) {
  const session = await getsession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : new Date(0);
  const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : new Date();

  try {
    // Fetch transactions in the given date range
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        date: true,
        type: true,
        amount: true,
      },
    });

    // Process data in JavaScript
    const monthlyData: Record<string, { income: number; expenses: number }> = {};

    transactions.forEach(({ date, type, amount }) => {
      const monthKey = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0 };
      }

      if (type === "income") {
        monthlyData[monthKey].income += amount;
      } else if (type === "expense") {
        monthlyData[monthKey].expenses += amount;
      }
    });

    // Convert the data into an array format
    const result = Object.entries(monthlyData)
      .map(([month, { income, expenses }]) => ({
        month: new Date(month),
        income,
        expenses,
      }))
      .sort((a, b) => a.month.getTime() - b.month.getTime());

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching monthly data:", error);
    return NextResponse.json({ error: "Failed to fetch monthly data" }, { status: 500 });
  }
}
