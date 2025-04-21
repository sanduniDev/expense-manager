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
        const categoryData = await prisma.transaction.groupBy({
            by: ['category'],
            where: {
                userId: session.user.id,
                type: "expense",
                date: {
                    gte: new Date(startDate || 0),
                    lte: new Date(endDate || Date.now()),
                }
            },
            _sum: {
                amount: true
            }
        })

        return NextResponse.json(categoryData.map(item => ({
            name: item.category,
            value: item._sum.amount
        })))

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Failed to fetch category data" },
            { status: 500 }
        )
    }
}