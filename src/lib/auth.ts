import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.JWT_SECRET || "default_super_secret_tonala_key_for_dev";
const key = new TextEncoder().encode(secretKey);

export type SessionPayload = {
  id: string;
  email: string;
  role: string;
  name: string;
};

/**
 * Encripta los datos del usuario para crear un token seguro.
 * Nadie puede leer este token sin el `secretKey`.
 * @param payload Datos del usuario (ID, email, rol, nombre)
 * @returns El token JWT en formato string.
 */
export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

/**
 * Desencripta un token JWT para sacar los datos del usuario.
 * Útil para saber quién está haciendo la petición.
 * @param input El token JWT en string.
 * @returns Los datos originales del usuario o null si el token es inválido.
 */
export async function decrypt(input: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Crea una sesión para el usuario y guarda la cookie en su navegador.
 * Las cookies son seguras (HTTP-only) para evitar ataques XSS.
 * @param payload Datos del usuario que acaba de iniciar sesión.
 */
export async function createSession(payload: SessionPayload) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const session = await encrypt(payload);

  (await cookies()).set("session", session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Obtiene la sesión actual del usuario leyendo las cookies de su navegador.
 * @returns Datos del usuario (ID, email, rol) o null si no está logueado.
 */
export async function getSession() {
  const sessionCookie = (await cookies()).get("session")?.value;
  if (!sessionCookie) return null;
  return await decrypt(sessionCookie);
}

/**
 * Cierra la sesión del usuario destruyendo la cookie.
 */
export async function destroySession() {
  (await cookies()).set("session", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}
