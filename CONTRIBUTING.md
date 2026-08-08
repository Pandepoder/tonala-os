# 🤝 Guía de Contribución a Tonalá OS

¡Gracias por querer ayudar a construir Tonalá OS! Este es un proyecto de código abierto para el municipio y cualquier ayuda es bienvenida.

Para que el proyecto no se vuelva un caos, hemos establecido reglas muy estrictas pero sencillas de seguir. Si quieres programar con nosotros, lee esta página de principio a fin.

---

## 🏗️ Flujo de Trabajo (El Proceso Exacto)

Si quieres agregar una pantalla, arreglar un error o cambiar un color, este es el camino que DEBES seguir:

1. **No toques la rama `main` directamente.**
   La rama `main` es sagrada. Es lo que está corriendo en producción (internet). Nadie sube código directamente ahí.

2. **Crea una nueva rama desde `main`.**
   En tu terminal (o GitHub Desktop), crea una rama nueva dependiendo de lo que vayas a hacer. Usa estos prefijos obligatorios:
   - `feat/` si vas a agregar una funcionalidad nueva (Ej: `feat/mapa-calor`).
   - `fix/` si vas a arreglar un error (Ej: `fix/boton-roto`).
   - `docs/` si solo vas a cambiar textos o documentación (Ej: `docs/actualizar-readme`).

3. **Escribe tu código y pruébalo localmente.**
   Corre `npm run dev` y asegúrate de que tu cambio funciona y no rompe el resto de las pantallas.

4. **Haz tu Commit (Guardar los cambios).**
   El mensaje de tu commit debe ser descriptivo. Nada de poner *"asdasd"* o *"cambios"*. 
   ✅ *Bien:* `feat: agregar vista de reportes en el mapa`
   ❌ *Mal:* `arreglé lo del mapa`

5. **Sube tu rama y crea un Pull Request (PR).**
   Sube tu rama a GitHub y presiona el botón verde de "Compare & Pull Request". Explica brevemente qué hiciste y espera a que el Administrador Principal del repositorio lo revise y lo apruebe.

---

## 🚫 Reglas de Oro

- **Nunca subas secretos:** No subas archivos `.env`, ni contraseñas, ni la base de datos `dev.db`. (El `.gitignore` ya está configurado para protegerte, ¡no lo borres!).
- **Sigue el estilo de diseño:** En el archivo `globals.css` existen "Variables" (colores oficiales, tamaños de letra). Úsalos en lugar de inventar colores nuevos en tus componentes.
- **Sin Librerías Inútiles:** Antes de instalar un paquete gigante de `npm` para hacer algo sencillo, pregúntate si puedes programarlo tú mismo en un par de líneas. Mantén el proyecto ligero.
