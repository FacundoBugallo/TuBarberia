"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { apiGet, apiPut } from "@/lib/api";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

type Service = {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
};

type Appointment = {
  id: string;
  service_id: string;
  client_name: string;
  client_phone: string;
  datetime: string;
  status: "pending" | "confirmed" | "cancelled";
};

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessId, setBusinessId] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [message, setMessage] = useState("Iniciá sesión como barbero para gestionar datos.");
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState({ name: "", duration_minutes: 30, price: 0 });

  useEffect(() => {
    async function checkSession() {
      if (!supabase) {
        setMessage("Falta configurar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.");
        return;
      }
      const { data } = await supabase.auth.getSession();
      setSessionReady(Boolean(data.session));
    }

    checkSession();
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setMessage("Configuración de Supabase incompleta.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }
    setSessionReady(true);
    setMessage("Login de barbero exitoso.");
  }

  async function logout() {
    if (!supabase) {
      setMessage("Configuración de Supabase incompleta.");
      return;
    }
    await supabase.auth.signOut();
    setSessionReady(false);
    setMessage("Sesión cerrada.");
  }

  async function loadAdminData() {
    if (!businessId) {
      setMessage("Ingresá el Business ID para cargar servicios y turnos.");
      return;
    }
    setLoading(true);
    setMessage("Cargando...");
    try {
      const [servicesResult, appointmentsResult] = await Promise.all([
        apiGet<Service[]>(`/services?business_id=${businessId}`),
        apiGet<Appointment[]>(`/appointments?business_id=${businessId}`),
      ]);
      setServices(servicesResult);
      setAppointments(appointmentsResult);
      setMessage("Datos actualizados.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(service: Service) {
    setEditingServiceId(service.id);
    setServiceForm({
      name: service.name,
      duration_minutes: service.duration_minutes,
      price: service.price,
    });
  }

  async function saveService(serviceId: string) {
    if (!businessId) {
      setMessage("Falta el Business ID.");
      return;
    }
    try {
      const updated = await apiPut<Service>(`/services/${serviceId}?business_id=${businessId}`, serviceForm);
      setServices((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setEditingServiceId(null);
      setMessage("Servicio actualizado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo actualizar el servicio");
    }
  }

  const appointmentSummary = useMemo(
    () => ({
      pending: appointments.filter((item) => item.status === "pending").length,
      confirmed: appointments.filter((item) => item.status === "confirmed").length,
      cancelled: appointments.filter((item) => item.status === "cancelled").length,
    }),
    [appointments],
  );

  return (
    <main style={{ backgroundColor: "#ffffff", color: "#111827", minHeight: "100vh", padding: 24 }}>
      <h1>Panel Admin</h1>
      {!sessionReady ? (
        <form
          onSubmit={login}
          style={{ display: "grid", maxWidth: 420, gap: 12, backgroundColor: "#f8fafc", padding: 16, borderRadius: 12 }}
        >
          <h2>Login barbero</h2>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Contraseña"
          />
          <button type="submit">Ingresar</button>
        </form>
      ) : (
        <section style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              value={businessId}
              onChange={(e) => setBusinessId(e.target.value)}
              placeholder="Business ID (UUID)"
              style={{ minWidth: 340 }}
            />
            <button type="button" onClick={loadAdminData} disabled={loading}>
              {loading ? "Cargando..." : "Cargar panel"}
            </button>
            <button type="button" onClick={logout}>
              Cerrar sesión
            </button>
          </div>

          <article style={{ backgroundColor: "#f8fafc", padding: 16, borderRadius: 12 }}>
            <h2>Editar servicios</h2>
            {services.length === 0 && <p>No hay servicios cargados.</p>}
            <ul style={{ display: "grid", gap: 12, listStyle: "none", padding: 0 }}>
              {services.map((service) => (
                <li key={service.id} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
                  {editingServiceId === service.id ? (
                    <div style={{ display: "grid", gap: 8 }}>
                      <input
                        value={serviceForm.name}
                        onChange={(e) => setServiceForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Nombre del servicio"
                      />
                      <input
                        value={serviceForm.duration_minutes}
                        type="number"
                        min={1}
                        onChange={(e) =>
                          setServiceForm((prev) => ({ ...prev, duration_minutes: Number(e.target.value) }))
                        }
                        placeholder="Duración (min)"
                      />
                      <input
                        value={serviceForm.price}
                        type="number"
                        min={0}
                        step={0.01}
                        onChange={(e) => setServiceForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
                        placeholder="Precio"
                      />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button type="button" onClick={() => saveService(service.id)}>
                          Guardar
                        </button>
                        <button type="button" onClick={() => setEditingServiceId(null)}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                      <span>
                        {service.name} · {service.duration_minutes} min · ${service.price}
                      </span>
                      <button type="button" onClick={() => startEdit(service)}>
                        Editar
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </article>

          <article style={{ backgroundColor: "#f8fafc", padding: 16, borderRadius: 12 }}>
            <h2>Ver turnos</h2>
            <p>
              Pendientes: {appointmentSummary.pending} · Confirmados: {appointmentSummary.confirmed} · Cancelados:{" "}
              {appointmentSummary.cancelled}
            </p>
            <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
              {appointments.map((appointment) => (
                <li key={appointment.id} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
                  <strong>{appointment.client_name}</strong> ({appointment.client_phone}) -{" "}
                  {new Date(appointment.datetime).toLocaleString("es-AR")} - {appointment.status}
                </li>
              ))}
            </ul>
          </article>
        </section>
      )}
      <small>{message}</small>
    </main>
  );
}
