import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reports = await prisma.eventReport.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, latitude, longitude, zone } = body;
    
    const report = await prisma.eventReport.create({
      data: {
        title,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        zone,
      }
    });
    
    return NextResponse.json(report);
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 });
  }
}
