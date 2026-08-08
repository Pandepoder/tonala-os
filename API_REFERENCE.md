# 🔌 Referencia de la API

Esta guía explica todas las puertas traseras (API Routes) de Tonalá OS. Si quieres conectar una aplicación móvil (Android/iOS) en el futuro, o hacer peticiones manuales desde Postman, esta es tu biblia.

Todas las peticiones inician con `http://localhost:3000` (o la URL de producción).

---

## 🛡️ Rutas de Autenticación (`/api/auth`)

### 1. Iniciar Sesión (`POST /api/auth/login`)
Se encarga de verificar tu correo y contraseña. Si son correctos, te da una cookie segura (`tonala_auth_token`).

- **Cuerpo (JSON):**
  ```json
  {
    "email": "admin@tonala.os",
    "password": "password123"
  }
  ```
- **Respuesta Exitosa (200 OK):**
  ```json
  { "success": true }
  ```

### 2. Obtener Sesión Actual (`GET /api/auth/me`)
Devuelve la información de la persona que tiene iniciada la sesión actualmente en el navegador. Ideal para saber el Rol (Admin, Organizador, etc.).

- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "user": {
      "id": 1,
      "email": "admin@tonala.os",
      "name": "Admin Principal",
      "role": "admin"
    }
  }
  ```

### 3. Cerrar Sesión (`POST /api/auth/logout`)
Destruye la cookie de sesión y desconecta al usuario de inmediato.

---

## 👥 Rutas del CRM (`/api/contacts`)

### 1. Listar / Crear Contactos
- **`GET /api/contacts`**: Trae una lista de todos los ciudadanos registrados.
- **`POST /api/contacts`**: Registra un nuevo ciudadano.
  - **Cuerpo (JSON):** `{ "name": "Juan Perez", "phone": "3312345678", "address": "Loma Dorada" }`

### 2. Modificar / Borrar un Contacto
- **`PUT /api/contacts/[id]`**: Actualiza los datos del contacto con el ID especificado.
- **`DELETE /api/contacts/[id]`**: Borra permanentemente a ese ciudadano de la base de datos (junto con sus visitas).

---

## 📍 Rutas del Mapa (`/api/reports`)

### 1. Obtener Marcadores (`GET /api/reports`)
Trae todos los reportes (Pines) para pintarlos en el mapa de Leaflet.

- **Respuesta (200 OK):**
  ```json
  [
    {
      "id": 1,
      "type": "bache",
      "description": "Bache profundo",
      "latitude": 20.6243,
      "longitude": -103.2405
    }
  ]
  ```

---

## 🤖 Rutas del Webhook IA (`/api/webhook`)

### 1. Recibir mensajes (`POST /api/webhook/whatsapp`)
El punto de entrada donde Meta/Twilio envía los mensajes que los ciudadanos escriben en WhatsApp.
También funciona para responder al `hub.challenge` de Meta si haces una petición `GET`.

- **Cuerpo de prueba (JSON):**
  ```json
  {
    "sender": "+523312345678",
    "content": "Hay un bache gigante en mi calle"
  }
  ```

### 2. Bandeja de Entrada (`GET /api/webhook/messages`)
La ruta que alimenta el Dashboard del Administrador. Trae los últimos 50 mensajes de WhatsApp en crudo para ser auditados.
