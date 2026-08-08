"use client";

import { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Cargando...</div>;
  }

  return (
    <div className="shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)' }}>
      <div className="form-panel is-open" style={{ maxWidth: '400px', width: '100%', margin: '0 20px', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '48px', height: '48px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'white' }}>
            <ShieldCheck size={24} />
          </div>
          <h2 className="card-title" style={{ fontSize: '24px' }}>Bienvenido a Tonalá OS</h2>
          <p className="card-meta">Inicia sesión para continuar</p>
        </div>

        {error && (
          <div style={{ padding: '12px', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="field-grid">
          <div className="field">
            <label>Correo Electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@tonala.os"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="action-button"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
          >
            {loading ? "Autenticando..." : "Ingresar"}
          </button>
        </form>

        <div style={{ marginTop: '24px', fontSize: '13px', color: 'var(--text-soft)', textAlign: 'center' }}>
          <p>Cuentas de prueba (Contraseña: 123456):</p>
          <p>admin@tonala.os (Admin)</p>
          <p>mariela@tonala.os (Organizador)</p>
          <p>juan@tonala.os (Ciudadano)</p>
        </div>
      </div>
    </div>
  );
}
