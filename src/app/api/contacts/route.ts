import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, colony, status, tag, tagClass, nextAction, visitInfo } = body;
    
    // Simplification for the demo: save without responsible user relationship
    // In the future, responsibleId should map to a real User in the database
    const contact = await prisma.contact.create({
      data: {
        name,
        colony,
        status,
        tag,
        tagClass,
        nextAction,
        visitInfo,
      }
    });
    
    return NextResponse.json(contact);
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
  }
}
