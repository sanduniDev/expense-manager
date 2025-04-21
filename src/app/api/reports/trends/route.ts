import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getsession } from "@/auth";

export async function GET(request: Request) {
    const session = await getsession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = parseInt(searchParams.get("period")?.replace("months", "") || "3");

    // Calculate start date for filtering
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - period);

    try {
        const transactions = await prisma.transaction.aggregateRaw({
            pipeline: [
                {
                    $match: {
                        userId: { $eq: { $toObjectId: session.user.id } },
                        date: { $gte: startDate },
                    },
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                        income: {
                            $sum: {
                                $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
                            },
                        },
                        expenses: {
                            $sum: {
                                $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
                            },
                        },
                    },
                },
                { $sort: { _id: -1 } },
            ],
        });

        return NextResponse.json(
            (Array.isArray(transactions) ? transactions : []).map((item: { _id: string; income: number; expenses: number }) => ({
                name: new Date(item._id + "-01").toLocaleString("default", { month: "short" }),
                income: Number(item.income),
                expenses: Number(item.expenses),
            }))
        );
    } catch (error) {
        console.error("Error fetching trends:", error);
        return NextResponse.json({ error: "Failed to fetch trends" }, { status: 500 });
    }
}
