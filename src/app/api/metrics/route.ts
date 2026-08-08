import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalContacts = await prisma.contact.count();
    const pendingContacts = await prisma.contact.count({ where: { status: "pendiente" } });
    const assignedContacts = await prisma.contact.count({ where: { status: "asignado" } });
    
    const totalVisits = await prisma.visit.count();
    const completedVisits = await prisma.visit.count({ where: { status: "completada" } });
    
    const totalReports = await prisma.eventReport.count();

    return NextResponse.json({
      contacts: {
        total: totalContacts,
        pending: pendingContacts,
        assigned: assignedContacts,
      },
      visits: {
        total: totalVisits,
        completed: completedVisits,
        pending: totalVisits - completedVisits
      },
      reports: {
        total: totalReports
      }
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}
