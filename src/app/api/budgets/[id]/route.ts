import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getsession } from "@/auth";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const session = await getsession();
    const { id: paramid } = await params
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await request.json();

        const updatedBudget = await prisma.budget.update({
            where: { id: paramid, userId: session.user.id },
            data: {
                category: data.category,
                amount: parseFloat(data.amount),
                period: data.period
            }
        });

        return NextResponse.json(updatedBudget);

    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: "Failed to update budget" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const session = await getsession();
    const { id: paramid } = await params
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await prisma.budget.delete({
            where: { id: paramid, userId: session.user.id }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: "Failed to delete budget" },
            { status: 500 }
        );
    }
}