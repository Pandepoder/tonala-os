# 🏛️ Arquitectura de Tonalá OS

Este documento explica de forma sencilla cómo están conectados los cables detrás de Tonalá OS. Si eres nuevo en el proyecto, lee esto antes de tocar el código.

---

## 🧩 Las 3 Capas del Sistema

Tonalá OS funciona como un restaurante. Tenemos a los meseros (Frontend), la cocina (Backend) y la bodega de comida (Base de Datos).

### 1. Frontend (Lo que ve el usuario)
Está construido con **React** usando **Next.js**.
- **Archivo principal:** `src/app/page.tsx`
- **Componentes:** El menú lateral (`Sidebar`), la barra móvil (`MobileNav`) y el Mapa interactivo (`MapComponent`) viven en la carpeta `/src/components`.
- **CSS:** Todo el diseño visual está hecho desde cero en `globals.css` y `page.module.css` sin usar librerías externas pesadas (como Bootstrap).

### 2. Backend (El cerebro de las operaciones)
También usamos **Next.js**, pero en su formato de Rutas de API. Todas las reglas de negocio viven en la carpeta `/src/app/api/`.
- Aquí es donde recibimos las peticiones para "Crear Ciudadano" o "Leer Reportes" e interactuamos con la base de datos de manera segura.
- **Middleware (`src/middleware.ts`):** Es nuestro cadenero (guardia de seguridad). Revisa todas las peticiones que entran al sistema. Si no traes tu llave JWT válida, te patea a la pantalla de `/login`.

### 3. Base de Datos
Usamos **Prisma ORM** conectado a una base de datos **SQLite** (un archivo local llamado `dev.db`).
- **Archivo principal:** `prisma/schema.prisma`
- Prisma se encarga de traducir nuestras peticiones de código a lenguaje SQL sin que tengamos que escribir consultas complejas a mano.

---

## 📡 Flujo del Webhook de WhatsApp (Fase 4)

Una de las características más avanzadas es la capacidad de recibir mensajes automáticamente. Así funciona:

1. El ciudadano escribe un mensaje de WhatsApp: *"Hay un bache en Avenida Tonaltecas"*.
2. El proveedor (Twilio o Meta) manda ese mensaje por internet hacia nuestra URL: `miservidor.com/api/webhook/whatsapp`.
3. Tonalá OS agarra el texto en crudo, revisa de qué número viene, y lo guarda en la tabla `WebhookMessage` con estado `pending` (Pendiente).
4. El Administrador puede ver estos mensajes en la pestaña "Auditoría de Eventos".
5. *(Futuro)* La Inteligencia Artificial leerá estos mensajes pendientes, entenderá que es un "bache" y creará el marcador en el mapa de forma automática.

---

## 🗺️ Mapa (Leaflet)

El mapa funciona puramente del lado del cliente (en el navegador del usuario).
Como Next.js mezcla código de Servidor y Cliente, usamos una técnica especial (`dynamic()`) para forzar a que el mapa solo se cargue en el navegador (CSR), evitando que el servidor se trabe intentando renderizar mapas geográficos.
