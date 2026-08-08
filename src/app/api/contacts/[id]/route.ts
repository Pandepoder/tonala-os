import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Extrayendo los campos actualizables
    const { name, colony, status, tag, tagClass, nextAction, responsibleId } = body;
    
    const contact = await prisma.contact.update({
      where: { id },
      data: {
        name,
        colony,
        status,
        tag,
        tagClass,
        nextAction,
        responsibleId
      }
    });
    
    return NextResponse.json(contact);
  } catch (error) {
    console.error("Error updating contact:", error);
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Eliminamos las visitas relacionadas primero por seguridad
    await prisma.visit.deleteMany({
      where: { contactId: id }
    });
    
    await prisma.contact.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 });
  }
}
