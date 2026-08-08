"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Map as MapIcon,
  CalendarCheck,
  LayoutDashboard,
  Layers,
  Plus,
  ShieldCheck,
  Bell,
  Search,
  Check,
  CheckCircle,
  BarChart,
  Megaphone,
  LogOut,
} from "lucide-react";
import dynamic from "next/dynamic";
import { SessionPayload } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

type Contact = {
  id: string;
  name: string;
  colony: string;
  responsibleId: string | null;
  status: string;
  tag: string;
  tagClass: string;
  nextAction: string;
  visitInfo: string;
};

type Visit = {
  id: string;
  contactId: string;
  contact?: Contact;
  resultType: string | null;
  summary: string | null;
  status: string;
  scheduledFor: string | null;
};

type Metrics = {
  contacts: { total: number; pending: number; assigned: number };
  visits: { total: number; completed: number; pending: number };
  reports: { total: number };
};

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<SessionPayload | null>(null);
  
  const [activeView, setActiveView] = useState("dashboard");
  const [filter, setFilter] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Data States
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [webhookMessages, setWebhookMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form States
  const [newContact, setNewContact] = useState({
    name: "",
    colony: "",
    responsible: "Pendiente",
  });
  
  const [newReport, setNewReport] = useState({
    title: "",
    description: "",
    latitude: 20.6248,
    longitude: -103.2422,
  });

  const [visitResult, setVisitResult] = useState({
    resultType: "successful",
    summary: "",
  });

  const [mounted, setMounted] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const authRes = await fetch("/api/auth/me");
      if (!authRes.ok) {
        router.push("/login");
        return;
      }
      const { user: sessionUser } = await authRes.json();
      setUser(sessionUser);
      
      // Ajustar vista por defecto según rol
      if (sessionUser.role === "Ciudadano" && (activeView === "dashboard" || activeView === "crm" || activeView === "equipo" || activeView === "reportes_admin")) {
        setActiveView("mapa");
      }

      const [resContacts, resVisits, resMetrics, resReports, resWebhook] = await Promise.all([
        fetch("/api/contacts"),
        fetch("/api/visits"),
        fetch("/api/metrics"),
        fetch("/api/reports"),
        fetch("/api/webhook/messages")
      ]);
      
      if (!resContacts.ok || !resVisits.ok || !resMetrics.ok || !resReports.ok || !resWebhook.ok) {
        throw new Error("Error en una de las respuestas de API");
      }

      const dataContacts = await resContacts.json();
      const dataVisits = await resVisits.json();
      const dataMetrics = await resMetrics.json();
      const dataReports = await resReports.json();
      const dataWebhook = await resWebhook.json();

      setContacts(dataContacts);
      setVisits(dataVisits);
      setMetrics(dataMetrics);
      setReports(dataReports);
      setWebhookMessages(dataWebhook);
    } catch (err) {
      console.error("Error loading data:", err);
      setErrorMsg("Ocurrió un error al cargar los datos desde el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  if (!mounted || !user) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Verificando sesión...</div>;
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };


  const handleDeleteContact = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este ciudadano? Esta acción no se puede deshacer y borrará también sus visitas.")) return;
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSelectedContact(null);
        loadData();
      } else {
        throw new Error("Failed to delete");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error al eliminar ciudadano");
    }
  };

  const handleUpdateContact = async () => {
    if (!selectedContact) return;
    setErrorMsg("");
    try {
      const res = await fetch(`/api/contacts/${selectedContact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedContact)
      });
      if (res.ok) {
        setSelectedContact(null);
        loadData();
      } else {
        throw new Error("Failed to update");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error al actualizar ciudadano");
    }
  };

  const normalizeText = (value: string) =>
    String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filteredContacts = contacts.filter((contact) => {
    const matchesFilter = filter === "todos" || contact.status === filter;
    const searchable = normalizeText(
      [contact.name, contact.colony, contact.nextAction].join(" ")
    );
    const query = normalizeText(searchQuery);
    const matchesQuery = !query || query.split(/\s+/).every((term) => searchable.includes(term));
    return matchesFilter && matchesQuery;
  });

  const handleSaveContact = async () => {
    setErrorMsg("");
    const name = newContact.name;
    const colony = newContact.colony || "Territorio pendiente";
    const responsible = newContact.responsible;
    const isPending = responsible === "Pendiente" || colony === "Territorio pendiente";

    const payload = {
      name,
      colony,
      status: isPending ? "pendiente" : "asignado",
      tag: isPending ? "Pendiente" : "Asignado",
      tagClass: isPending ? "warning" : "green",
      nextAction: isPending ? "Asignar responsable" : "Programar visita",
      visitInfo: "Sin visita",
    };

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsCreateOpen(false);
        setNewContact({ name: "", colony: "", responsible: "Pendiente" });
        loadData();
      } else {
        throw new Error("Error al guardar");
      }
    } catch (err) {
      console.error("Failed to save contact", err);
      setErrorMsg("No se pudo guardar el contacto.");
    }
  };

  const handleCreateReport = async () => {
    setErrorMsg("");
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReport)
      });
      if (res.ok) {
        setNewReport({ title: "", description: "", latitude: 20.6248, longitude: -103.2422 });
        alert("Reporte guardado. (En la siguiente fase se mostrará en el mapa de calor).");
        loadData();
      } else {
        throw new Error("Error al guardar reporte");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("No se pudo enviar el reporte.");
    }
  };

  const handleScheduleVisit = async (contactId: string) => {
    try {
      const res = await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId, scheduledFor: new Date().toISOString() })
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error("Failed to schedule visit", err);
    }
  };

  const handleCompleteVisit = async (visitId: string) => {
    try {
      const res = await fetch(`/api/visits/${visitId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resultType: visitResult.resultType,
          summary: visitResult.summary,
          status: "completada"
        })
      });
      if (res.ok) {
        setVisitResult({ resultType: "successful", summary: "" });
        loadData();
      }
    } catch (err) {
      console.error("Failed to complete visit", err);
    }
  };

  const viewMeta: Record<string, any> = {
    dashboard: { title: "Dashboard", subtitle: "Métricas generales y avance de campaña." },
    crm: { title: "CRM Ciudadanos", subtitle: "Busca, registra y da seguimiento al padrón." },
    mapa: { title: "Mapa y Territorio", subtitle: "Consulta eventos, territorio y calor." },
    equipo: { title: "Agenda Operativa", subtitle: "Organiza visitas, pendientes y resultados." },
    reportes: { title: "Captura de Eventos", subtitle: "Reporta actividades en campo." },
    settings: { title: "Configuración", subtitle: "Administración del sistema." },
    reportes_admin: { title: "Auditoría de Eventos", subtitle: "Supervisa reportes globales." },
  };

  const isAdmin = user.role === "Administrador";
  const isOrganizer = user.role === "Organizador";

  return (
    <div className="shell">
      <Sidebar activeView={activeView} setActiveView={setActiveView} user={user} onLogout={handleLogout} />

      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">
              <LayoutDashboard size={14} /> Panel {user.role}
            </p>
            <h2 className="page-title">Sistema Central de Campaña</h2>
            <p className="page-copy">
              Todos los menús conectados. Las métricas reflejan la base de datos en tiempo real.
            </p>
          </div>
          <div className="quick-actions">
            <button className="ghost-button" onClick={() => loadData()}>
              Recargar Datos
            </button>
            {(isAdmin || isOrganizer) && (
              <button
                className="action-button"
                onClick={() => {
                  setActiveView("crm");
                  setIsCreateOpen(true);
                  setSelectedContact(null);
                }}
              >
                <Plus size={16} /> Alta rápida
              </button>
            )}
          </div>
        </header>

        {errorMsg && (
          <div style={{ padding: 12, background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 8, marginBottom: 16 }}>
            <strong>Error:</strong> {errorMsg}
          </div>
        )}

        <div className="mobile-preview-wrap">
          <section className="phone" aria-label="Aplicación" style={{ maxWidth: '100%', minHeight: '80vh' }}>
            <div className="phone-screen" style={{ minHeight: '80vh' }}>
              <header className="mobile-header">
                <div className="mobile-header-top">
                  <div className="user-chip">
                    <ShieldCheck size={14} /> {user.role}
                  </div>
                  <button className="icon-button" aria-label="Abrir avisos" onClick={handleLogout}>
                    <LogOut size={18} />
                  </button>
                </div>
                <h2 className="mobile-title">
                  {viewMeta[activeView]?.title}
                </h2>
                <p className="mobile-subtitle">
                  {viewMeta[activeView]?.subtitle}
                </p>
              </header>

              <div className="mobile-body" style={{ overflowY: 'auto' }}>
                
                {/* ----------------- VIEW: DASHBOARD ----------------- */}
                {(isAdmin || isOrganizer) && (
                  <section className={`view ${activeView === "dashboard" ? "is-active" : ""}`}>
                    {isLoading ? (
                      <div className="empty-state">Cargando métricas...</div>
                    ) : metrics ? (
                      <div className="list-stack">
                        <article className="contact-card">
                          <div className="card-head">
                            <h3 className="card-title">Ciudadanos en Padrón</h3>
                            <span className="badge blue">Total: {metrics.contacts.total}</span>
                          </div>
                          <div className="detail-grid">
                            <div className="detail-box"><span>Asignados</span><strong>{metrics.contacts.assigned}</strong></div>
                            <div className="detail-box"><span>Pendientes</span><strong>{metrics.contacts.pending}</strong></div>
                          </div>
                        </article>
                        
                        <article className="contact-card">
                          <div className="card-head">
                            <h3 className="card-title">Avance de Visitas</h3>
                            <span className="badge green">Progreso</span>
                          </div>
                          <div className="detail-grid">
                            <div className="detail-box"><span>Completadas</span><strong>{metrics.visits.completed}</strong></div>
                            <div className="detail-box"><span>Agendadas</span><strong>{metrics.visits.pending}</strong></div>
                          </div>
                        </article>

                        <article className="contact-card">
                          <div className="card-head">
                            <h3 className="card-title">Impacto en Territorio</h3>
                            <span className="badge warning">Eventos</span>
                          </div>
                          <div className="detail-grid">
                            <div className="detail-box" style={{ gridColumn: 'span 2' }}>
                              <span>Reportes geolocalizados activos</span>
                              <strong>{metrics.reports.total} eventos registrados</strong>
                            </div>
                          </div>
                        </article>
                      </div>
                    ) : null}
                  </section>
                )}

                {/* ----------------- VIEW: CRM ----------------- */}
                {(isAdmin || isOrganizer) && (
                  <section className={`view ${activeView === "crm" ? "is-active" : ""}`}>
                    {!selectedContact && !isCreateOpen ? (
                      <>
                        <div className="search-field">
                          <Search size={16} />
                          <input
                            placeholder="Buscar por nombre, colonia o estado..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>

                        <div className="filter-row" aria-label="Filtros de contactos">
                          <button className={`filter-chip ${filter === "todos" ? "is-active" : ""}`} onClick={() => setFilter("todos")}>Todos</button>
                          <button className={`filter-chip ${filter === "pendiente" ? "is-active" : ""}`} onClick={() => setFilter("pendiente")}>Pendientes</button>
                          <button className={`filter-chip ${filter === "asignado" ? "is-active" : ""}`} onClick={() => setFilter("asignado")}>Asignados</button>
                        </div>

                        <div className="list-stack" style={{ marginTop: 12 }}>
                          {isLoading ? (
                            <div className="empty-state">Cargando base de datos...</div>
                          ) : filteredContacts.length === 0 ? (
                            <div className="empty-state">No hay ciudadanos que coincidan con la búsqueda.</div>
                          ) : (
                            filteredContacts.map((contact) => (
                              <article 
                                className="contact-card" 
                                key={contact.id} 
                                onClick={() => setSelectedContact(contact)}
                                style={{ cursor: "pointer" }}
                              >
                                <div className="card-head">
                                  <div>
                                    <h3 className="card-title">{contact.name}</h3>
                                    <p className="card-meta">{contact.colony}</p>
                                  </div>
                                  <span className={`badge ${contact.tagClass}`}>{contact.tag}</span>
                                </div>
                                <div className="detail-grid">
                                  <div className="detail-box">
                                    <span>Siguiente acción</span>
                                    <strong>{contact.nextAction}</strong>
                                  </div>
                                </div>
                                <div className="card-actions" onClick={e => e.stopPropagation()}>
                                  <button className="tiny-action primary" onClick={() => handleScheduleVisit(contact.id)}>Agendar Visita</button>
                                </div>
                              </article>
                            ))
                          )}
                        </div>
                      </>
                    ) : selectedContact ? (
                      <div className="form-panel is-open">
                        <div className="card-head" style={{ marginBottom: "16px" }}>
                          <div>
                            <h3 className="card-title">Detalle del Ciudadano</h3>
                            <p className="card-meta">Edición y seguimiento</p>
                          </div>
                          <span className={`badge ${selectedContact.tagClass}`}>{selectedContact.tag}</span>
                        </div>

                        <div className="field-grid">
                          <div className="field">
                            <label>Nombre Completo</label>
                            <input
                              value={selectedContact.name}
                              onChange={(e) => setSelectedContact({ ...selectedContact, name: e.target.value })}
                            />
                          </div>
                          <div className="field">
                            <label>Colonia / Ubicación</label>
                            <input
                              value={selectedContact.colony}
                              onChange={(e) => setSelectedContact({ ...selectedContact, colony: e.target.value })}
                            />
                          </div>
                          <div className="field">
                            <label>Estado / Etiqueta</label>
                            <select
                              value={selectedContact.tag}
                              onChange={(e) => {
                                const newTag = e.target.value;
                                let newTagClass = "warning";
                                let newStatus = "pendiente";
                                if (newTag === "Asignado") { newTagClass = "green"; newStatus = "asignado"; }
                                if (newTag === "Visitado") { newTagClass = "blue"; newStatus = "visita"; }
                                setSelectedContact({ 
                                  ...selectedContact, 
                                  tag: newTag, 
                                  tagClass: newTagClass,
                                  status: newStatus
                                });
                              }}
                            >
                              <option value="Pendiente">Pendiente</option>
                              <option value="Asignado">Asignado</option>
                              <option value="Visitado">Visitado</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ marginTop: "24px", display: "flex", gap: "8px", flexDirection: "column" }}>
                          <button className="action-button green" onClick={handleUpdateContact}>
                            <Check size={16} /> Guardar Cambios
                          </button>
                          <button className="action-button" style={{ background: "var(--danger)" }} onClick={() => handleDeleteContact(selectedContact.id)}>
                            Eliminar Ciudadano
                          </button>
                          <button className="ghost-button" onClick={() => setSelectedContact(null)}>
                            Volver a la lista
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="form-panel is-open">
                        <div className="stepper" aria-label="Progreso alta rápida">
                          <div className="step is-active"></div><div className="step"></div><div className="step"></div><div className="step"></div>
                        </div>
                        <div className="field-grid">
                          <div className="field">
                            <label>Nombre del Ciudadano</label>
                            <input
                              placeholder="Ej. Juan Pérez"
                              value={newContact.name}
                              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                            />
                          </div>
                          <div className="field">
                            <label>Colonia / Sección</label>
                            <input
                              placeholder="Ej. Loma Dorada"
                              value={newContact.colony}
                              onChange={(e) => setNewContact({ ...newContact, colony: e.target.value })}
                            />
                          </div>
                          <div className="field">
                            <label>Responsable</label>
                            <select
                              value={newContact.responsible}
                              onChange={(e) => setNewContact({ ...newContact, responsible: e.target.value })}
                            >
                              <option>Pendiente</option>
                              <option>Mariela Gómez</option>
                              <option>Rigo Álvarez</option>
                              <option>Equipo territorial</option>
                            </select>
                          </div>
                          <button
                            className="action-button green"
                            type="button"
                            onClick={handleSaveContact}
                            disabled={!newContact.name}
                            style={{ opacity: !newContact.name ? 0.6 : 1 }}
                          >
                            <Check size={16} /> Guardar Ciudadano
                          </button>
                          <button className="ghost-button" type="button" onClick={() => setIsCreateOpen(false)}>
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {/* ----------------- VIEW: EQUIPO (AGENDA) ----------------- */}
                {(isAdmin || isOrganizer) && (
                  <section className={`view ${activeView === "equipo" ? "is-active" : ""}`}>
                    <div className="summary-strip">
                      <div className="summary-mini">
                        <span>Total Visitas</span>
                        <strong>{metrics?.visits.total || 0}</strong>
                      </div>
                      <div className="summary-mini">
                        <span>Pendientes</span>
                        <strong>{metrics?.visits.pending || 0}</strong>
                      </div>
                    </div>
                    <div className="list-stack">
                      {isLoading ? (
                        <div className="empty-state">Cargando agenda...</div>
                      ) : visits.length === 0 ? (
                        <div className="empty-state">No hay visitas agendadas. Ve al CRM y agenda una.</div>
                      ) : (
                        visits.map((visit) => (
                          <article className={visit.status === "completada" ? "task-card" : "visit-card"} key={visit.id}>
                            <div className="card-head">
                              <div>
                                <h3 className="card-title">Visita a {visit.contact?.name || "Desconocido"}</h3>
                                <p className="card-meta">{visit.contact?.colony}</p>
                              </div>
                              <span className={`badge ${visit.status === "completada" ? "green" : "warning"}`}>
                                {visit.status === "completada" ? "Completada" : "Pendiente"}
                              </span>
                            </div>
                            
                            {visit.status !== "completada" ? (
                              <div className="field-grid" style={{ marginTop: 12 }}>
                                <div className="field">
                                  <label>Resultado estructurado</label>
                                  <select 
                                    value={visitResult.resultType} 
                                    onChange={(e) => setVisitResult({...visitResult, resultType: e.target.value})}
                                  >
                                    <option value="successful">Visita Exitosa</option>
                                    <option value="no_contact">No se encontró</option>
                                    <option value="rejected">Rechazo</option>
                                  </select>
                                </div>
                                <div className="field">
                                  <label>Resumen / Notas</label>
                                  <textarea 
                                    placeholder="Escribe el resumen del acuerdo aquí..."
                                    value={visitResult.summary}
                                    onChange={(e) => setVisitResult({...visitResult, summary: e.target.value})}
                                  ></textarea>
                                </div>
                                <button className="action-button" type="button" onClick={() => handleCompleteVisit(visit.id)}>
                                  <CheckCircle size={16} /> Cerrar visita
                                </button>
                              </div>
                            ) : (
                              <div className="detail-grid">
                                <div className="detail-box" style={{ gridColumn: 'span 2' }}>
                                  <span>Resultado: {visit.resultType}</span>
                                  <strong>{visit.summary}</strong>
                                </div>
                              </div>
                            )}
                          </article>
                        ))
                      )}
                    </div>
                  </section>
                )}

                {/* ----------------- VIEW: REPORTES ----------------- */}
                <section className={`view ${activeView === "reportes" ? "is-active" : ""}`}>
                  <article className="form-panel is-open">
                     <h3 className="card-title" style={{marginBottom: 16}}>Levantar Reporte de Evento</h3>
                     <div className="field-grid">
                      <div className="field">
                        <label>Título del Evento / Incidencia</label>
                        <input
                          placeholder="Ej. Reunión Vecinal"
                          value={newReport.title}
                          onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                        />
                      </div>
                      <div className="field">
                        <label>Descripción detallada</label>
                        <textarea
                          placeholder="Observaciones importantes"
                          value={newReport.description}
                          onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                        />
                      </div>
                      <div className="field">
                        <label>Latitud GPS (Simulada)</label>
                        <input type="number" step="any" value={newReport.latitude} onChange={(e) => setNewReport({ ...newReport, latitude: parseFloat(e.target.value) })} />
                      </div>
                      <div className="field">
                        <label>Longitud GPS (Simulada)</label>
                        <input type="number" step="any" value={newReport.longitude} onChange={(e) => setNewReport({ ...newReport, longitude: parseFloat(e.target.value) })} />
                      </div>
                      <button
                        className="action-button green"
                        type="button"
                        onClick={handleCreateReport}
                        disabled={!newReport.title}
                      >
                        <Check size={16} /> Reportar Evento en Mapa
                      </button>
                     </div>
                  </article>
                </section>

                {/* ----------------- VIEW: MAPA ----------------- */}
                <section className={`view ${activeView === "mapa" ? "is-active" : ""}`}>
                  <div className="filter-row" aria-label="Capas del mapa">
                    <button className="filter-chip is-active">Zonas</button>
                    <button className="filter-chip is-active">Eventos de Calor</button>
                  </div>
                  <div style={{ height: "400px", width: "100%", marginTop: "16px", borderRadius: "12px", overflow: "hidden" }}>
                    <MapComponent 
                      reports={reports} 
                      onMapClick={(lat, lng) => {
                        setNewReport(prev => ({ ...prev, latitude: lat, longitude: lng }));
                        setActiveView("reportes");
                      }} 
                    />
                  </div>
                  
                  <div className="bottom-sheet" style={{ position: "relative", marginTop: "16px", transform: "none" }}>
                    <div className="card-head">
                      <div>
                        <h3 className="card-title">Eventos Activos</h3>
                        <p className="card-meta">Da clic en el mapa para registrar un nuevo evento en esa coordenada.</p>
                      </div>
                    </div>
                    <div className="detail-grid">
                      <div className="detail-box"><span>Total de Reportes Geográficos</span><strong>{reports.length || 0}</strong></div>
                    </div>
                  </div>
                </section>

                {/* ----------------- VIEW: SETTINGS (ADMIN ONLY) ----------------- */}
                {isAdmin && (
                  <section className={`view ${activeView === "settings" ? "is-active" : ""}`}>
                    <div className="empty-state">
                      Opciones de administrador estarán disponibles aquí.
                    </div>
                  </section>
                )}
                
                {isAdmin && (
                  <section className={`view ${activeView === "reportes_admin" ? "is-active" : ""}`}>
                    <div className="card-head" style={{ marginBottom: 16 }}>
                      <div>
                        <h3 className="card-title">Bandeja de Entrada (IA)</h3>
                        <p className="card-meta">Mensajes en crudo desde WhatsApp u otras fuentes</p>
                      </div>
                      <button 
                        className="tiny-action primary"
                        onClick={async () => {
                          await fetch("/api/webhook/whatsapp", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ sender: "+523312345678", content: "Hola, quiero reportar una fuga de agua en la calle principal" })
                          });
                          loadData();
                        }}
                      >
                        + Simular Mensaje
                      </button>
                    </div>

                    <div className="list-stack">
                      {webhookMessages.length === 0 ? (
                        <div className="empty-state">No hay mensajes entrantes aún.</div>
                      ) : (
                        webhookMessages.map((msg) => (
                          <article className="contact-card" key={msg.id}>
                            <div className="card-head">
                              <div>
                                <h3 className="card-title">{msg.sender}</h3>
                                <p className="card-meta">Fuente: {msg.source}</p>
                              </div>
                              <span className={`badge ${msg.status === "pending" ? "warning" : "green"}`}>
                                {msg.status === "pending" ? "Pendiente" : "Procesado"}
                              </span>
                            </div>
                            <div className="detail-grid" style={{ marginTop: 8 }}>
                              <div className="detail-box" style={{ gridColumn: 'span 2' }}>
                                <span>Mensaje Recibido</span>
                                <strong>"{msg.content}"</strong>
                              </div>
                            </div>
                            <div className="card-actions">
                              <button className="tiny-action ghost" disabled>
                                Analizar con IA (Próximamente)
                              </button>
                            </div>
                          </article>
                        ))
                      )}
                    </div>
                  </section>
                )}

              </div>

              <MobileNav activeView={activeView} setActiveView={setActiveView} user={user} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
