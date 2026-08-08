# 🌍 Tonalá OS

> **Sistema Operativo Territorial para el municipio de Tonalá.**
> Tonalá OS es una plataforma integral diseñada para conectar al gobierno con los ciudadanos mediante la gestión de reportes geolocalizados, control de cuadrillas (CRM) y un sistema preparado para recibir reportes automáticos vía WhatsApp usando Inteligencia Artificial.

---

## 🚀 ¿Qué hace este proyecto?

Este proyecto está dividido en 4 grandes módulos que trabajan en equipo:

1. **🔐 Sistema de Seguridad y Roles (Login):** 
   Nadie entra sin permiso. Tenemos 3 tipos de usuarios:
   - **Administrador:** El jefe supremo. Ve todas las estadísticas, mapas y cuentas.
   - **Organizador:** El jefe de zona. Ve solo a sus ciudadanos y reportes locales.
   - **Ciudadano:** El habitante normal. Solo entra a poner reportes de su calle.

2. **🗺️ Mapa Interactivo en Tiempo Real:**
   Un mapa de Tonalá donde caen "Pines" (marcadores) cada vez que alguien reporta un bache, una luminaria fundida o falta de agua.

3. **👥 CRM (Directorio de Ciudadanos):**
   Una agenda digital donde los organizadores pueden registrar los datos de los ciudadanos, agendarles visitas y llevar un control exacto de quién es quién.

4. **🤖 Bandeja de IA (Webhooks):**
   El sistema está "escuchando" internet. Si alguien manda un WhatsApp al gobierno, Tonalá OS lo recibe, lo guarda en la bandeja de entrada, y lo prepara para que una Inteligencia Artificial lo lea y ponga el pin en el mapa sin que un humano mueva un dedo.

---

## 🛠️ Tecnologías que usamos

- **Next.js (React):** El motor principal de la página web. Hace que todo cargue rapidísimo.
- **Prisma & SQLite:** Nuestra base de datos. Aquí se guardan los usuarios, reportes y mensajes.
- **Leaflet:** La tecnología mágica detrás de los mapas interactivos.
- **JWT (JSON Web Tokens):** Las "llaves digitales" que garantizan que el sistema no sea hackeado.

---

## 📖 Guía de Instalación ("A prueba de tontos")

Si acabas de descargar este código y quieres correrlo en tu computadora, sigue estos pasos al pie de la letra. No te saltes ninguno.

### Paso 1: Instalar dependencias
Abre tu consola (Terminal) en la carpeta del proyecto y escribe esto para descargar los motores necesarios:
```bash
npm install
```

### Paso 2: Preparar la Base de Datos
Necesitamos construir las tablas donde se guardará la información. Escribe esto:
```bash
npx prisma db push
```

### Paso 3: Crear el súper usuario (Admin)
La base de datos está vacía. Para poder entrar, necesitas crear el primer administrador. Corre este comando:
```bash
npx tsx seed-users.ts
```
*(Si te da error diciendo que tsx no existe, instálalo primero con `npm install -g tsx`)*

### Paso 4: ¡Prender el servidor!
Ya tienes todo listo. Ahora prende el motor del proyecto:
```bash
npm run dev
```

### Paso 5: Entrar a la página
Abre tu navegador de internet (Chrome, Safari, Edge) y ve a esta dirección:
👉 **[http://localhost:3000](http://localhost:3000)**

Para iniciar sesión, usa estos datos que creaste en el paso 3:
- **Email:** `admin@tonala.os`
- **Contraseña:** `password123`

---

## 📚 Documentación Adicional

Si quieres meterte más a fondo o invitar a otros programadores a ayudarte, lee estos archivos que hemos preparado:

- [📄 Manual de Arquitectura (`ARCHITECTURE.md`)](./ARCHITECTURE.md) - Entiende cómo se conectan los cables por detrás.
- [📄 Guía de Contribución (`CONTRIBUTING.md`)](./CONTRIBUTING.md) - Reglas para que otros programadores te ayuden sin romper el código.
- [📄 Manual de la API (`API_REFERENCE.md`)](./API_REFERENCE.md) - Guía para programadores Front-End o de Apps Móviles.
