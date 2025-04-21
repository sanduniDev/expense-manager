import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getsession } from "@/auth"

export async function GET() {
    const session = await getsession()
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId: session.user.id },
            orderBy: { date: "desc" },
            take: 30
        })
        return NextResponse.json(transactions)
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Failed to fetch transactions" },
            { status: 500 }
        )
    }
}
export async function POST(request: Request) {
    const session = await getsession()
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const data = await request.json()

        const transaction = await prisma.transaction.create({
            data: {
                ...data,
                amount: parseFloat(data.amount),
                date: new Date(data.date),
                userId: session.user.id
            }
        })

        return NextResponse.json(transaction)
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: "Failed to create transaction" },
            { status: 500 }
        )
    }
}