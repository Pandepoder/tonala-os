import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { resultType, summary, status } = body;
    
    const visit = await prisma.visit.update({
      where: { id },
      data: {
        resultType,
        summary,
        status: status || "completada",
      }
    });
    
    return NextResponse.json(visit);
  } catch (error) {
    console.error("Error updating visit:", error);
    return NextResponse.json({ error: "Failed to update visit" }, { status: 500 });
  }
}
