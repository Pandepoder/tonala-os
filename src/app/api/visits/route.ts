import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const visits = await prisma.visit.findMany({
      include: { contact: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(visits);
  } catch (error) {
    console.error("Error fetching visits:", error);
    return NextResponse.json({ error: "Failed to fetch visits" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contactId, scheduledFor } = body;
    
    const visit = await prisma.visit.create({
      data: {
        contactId,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined
      },
      include: { contact: true }
    });
    
    return NextResponse.json(visit);
  } catch (error) {
    console.error("Error creating visit:", error);
    return NextResponse.json({ error: "Failed to create visit" }, { status: 500 });
  }
}
