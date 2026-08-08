import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const messages = await prisma.webhookMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50 // Limitamos a los últimos 50 para el dashboard
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching webhook messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
