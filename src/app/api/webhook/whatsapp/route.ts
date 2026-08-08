import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Webhook GET (para validación de Meta/Twilio si es necesario)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode && token) {
    if (mode === "subscribe" && token === "TONALA_SECURE_TOKEN") {
      return new NextResponse(challenge, { status: 200 });
    }
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// Webhook POST (recibe mensajes)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Lógica simulada de recepción de WhatsApp
    // Aquí es donde en la vida real desempaquetaríamos el payload de Meta/Twilio
    
    // Por motivos de simulación, asumimos que nos mandan:
    // { "sender": "+523312345678", "content": "Hola, quiero reportar un bache" }
    
    const sender = body.sender || "unknown";
    const content = body.content || "";
    
    if (!content) {
      return NextResponse.json({ error: "No content" }, { status: 400 });
    }
    
    // Guardar en la base de datos para la Auditoría de IA
    const message = await prisma.webhookMessage.create({
      data: {
        sender,
        content,
        source: "whatsapp",
        status: "pending" // La IA lo procesará después
      }
    });

    return NextResponse.json({ success: true, messageId: message.id }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}
