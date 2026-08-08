import {
  Users,
  Map as MapIcon,
  CalendarCheck,
  BarChart,
  Megaphone,
  LogOut,
  Settings,
  FileText
} from "lucide-react";
import { SessionPayload } from "@/lib/auth";

interface SidebarProps {
  activeView: string;
  setActiveView: (v: string) => void;
  user: SessionPayload;
  onLogout: () => void;
}

export function Sidebar({ activeView, setActiveView, user, onLogout }: SidebarProps) {
  const isAdmin = user.role === "Administrador";
  const isOrganizer = user.role === "Organizador";
  const isCitizen = user.role === "Ciudadano";

  return (
    <aside className="sidebar" aria-label="Navegación general">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true"></div>
        <div>
          <h1 className="brand-title">Tonalá OS</h1>
          <p className="brand-subtitle">Gestor de Campaña</p>
        </div>
      </div>

      <div style={{ padding: '0 20px', marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-soft)' }}>Conectado como:</div>
        <div style={{ fontWeight: 600, fontSize: '14px' }}>{user.name} ({user.role})</div>
      </div>

      {/* Main Section */}
      {(isAdmin || isOrganizer) && (
        <div>
          <p className="side-section-title">Principal</p>
          <nav className="nav-list">
            {isAdmin && (
              <button
                className={`nav-button ${activeView === "dashboard" ? "is-active" : ""}`}
                onClick={() => setActiveView("dashboard")}
              >
                <BarChart size={18} /> Dashboard Global
              </button>
            )}
            
            <button
              className={`nav-button ${activeView === "crm" ? "is-active" : ""}`}
              onClick={() => setActiveView("crm")}
            >
              <Users size={18} /> {isAdmin ? "Padrón Completo" : "Mis Asignados"}
            </button>
            
            <button
              className={`nav-button ${activeView === "equipo" ? "is-active" : ""}`}
              onClick={() => setActiveView("equipo")}
            >
              <CalendarCheck size={18} /> Agenda Operativa
            </button>
            
            {isAdmin && (
              <button
                className={`nav-button ${activeView === "reportes_admin" ? "is-active" : ""}`}
                onClick={() => setActiveView("reportes_admin")}
              >
                <FileText size={18} /> Auditoría Eventos
              </button>
            )}
          </nav>
        </div>
      )}

      {/* Territory Section */}
      <div>
        <p className="side-section-title">Territorio</p>
        <nav className="nav-list">
          <button
            className={`nav-button ${activeView === "mapa" ? "is-active" : ""}`}
            onClick={() => setActiveView("mapa")}
          >
            <MapIcon size={18} /> Mapa en vivo
          </button>
          
          <button
            className={`nav-button ${activeView === "reportes" ? "is-active" : ""}`}
            onClick={() => setActiveView("reportes")}
          >
            <Megaphone size={18} /> Alta Eventos
          </button>
        </nav>
      </div>

      {/* Settings / Profile Section */}
      <div style={{ marginTop: 'auto' }}>
        <nav className="nav-list">
          {isAdmin && (
            <button
              className={`nav-button ${activeView === "settings" ? "is-active" : ""}`}
              onClick={() => setActiveView("settings")}
            >
              <Settings size={18} /> Configuración
            </button>
          )}
          <button className="nav-button" onClick={onLogout} style={{ color: 'var(--danger)' }}>
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </nav>
      </div>
    </aside>
  );
}
