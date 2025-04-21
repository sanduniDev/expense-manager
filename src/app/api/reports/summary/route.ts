import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getsession } from "@/auth"

export async function GET(request: Request) {
    const session = await getsession()
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    try {
        const whereClause = {
            userId: session.user.id,
            date: {
                gte: new Date(startDate || 0),
                lte: new Date(endDate || Date.now()),
            }
        }

        const [income, expenses] = await Promise.all([
            prisma.transaction.aggregate({
                where: { ...whereClause, type: "income" },
                _sum: { amount: true }
            }),
            prisma.transaction.aggregate({
                where: { ...whereClause, type: "expense" },
                _sum: { amount: true }
            })
        ])

        const totalIncome = income._sum.amount || 0
        const totalExpenses = expenses._sum.amount || 0
        const netSavings = totalIncome - totalExpenses
        const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0

        return NextResponse.json({
            totalIncome,
            totalExpenses,
            netSavings,
            savingsRate: Number(savingsRate.toFixed(1))
        })

    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: "Failed to fetch report summary" },
            { status: 500 }
        )
    }
}