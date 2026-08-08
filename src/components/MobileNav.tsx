import {
  Users,
  Map as MapIcon,
  CalendarCheck,
  BarChart,
  Megaphone
} from "lucide-react";
import { SessionPayload } from "@/lib/auth";

interface MobileNavProps {
  activeView: string;
  setActiveView: (v: string) => void;
  user: SessionPayload;
}

export function MobileNav({ activeView, setActiveView, user }: MobileNavProps) {
  const isAdmin = user.role === "Administrador";
  const isOrganizer = user.role === "Organizador";

  return (
    <nav className="mobile-bottom-nav">
      {(isAdmin || isOrganizer) && (
        <button
          className={`mobile-nav-button ${activeView === "dashboard" ? "is-active" : ""}`}
          onClick={() => setActiveView("dashboard")}
        >
          <BarChart size={20} /> Dashboard
        </button>
      )}
      
      {(isAdmin || isOrganizer) && (
        <button
          className={`mobile-nav-button ${activeView === "crm" ? "is-active" : ""}`}
          onClick={() => setActiveView("crm")}
        >
          <Users size={20} /> CRM
        </button>
      )}
      
      {(isAdmin || isOrganizer) && (
        <button
          className={`mobile-nav-button ${activeView === "equipo" ? "is-active" : ""}`}
          onClick={() => setActiveView("equipo")}
        >
          <CalendarCheck size={20} /> Agenda
        </button>
      )}
      
      <button
        className={`mobile-nav-button ${activeView === "mapa" ? "is-active" : ""}`}
        onClick={() => setActiveView("mapa")}
      >
        <MapIcon size={20} /> Mapa
      </button>

      <button
        className={`mobile-nav-button ${activeView === "reportes" ? "is-active" : ""}`}
        onClick={() => setActiveView("reportes")}
      >
        <Megaphone size={20} /> Reportar
      </button>
    </nav>
  );
}
