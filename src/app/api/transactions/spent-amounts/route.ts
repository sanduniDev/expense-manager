import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getsession } from "@/auth";

export async function GET(request: Request) {
    const session = await getsession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const monthYear = searchParams.get("monthYear");

    try {
        const startDate = new Date(monthYear + "-01");
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const spentAmounts = await prisma.transaction.groupBy({
            by: ["category"],
            where: {
                userId: session.user.id,
                type: "expense",
                date: {
                    gte: startDate,
                    lt: endDate
                }
            },
            _sum: {
                amount: true
            }
        });

        const result = spentAmounts.reduce((acc, item) => {
            acc[item.category] = item._sum.amount || 0;
            return acc;
        }, {} as Record<string, number>);

        return NextResponse.json(result);
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: "Failed to fetch spent amounts" },
            { status: 500 }
        );
    }
}