"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";

type Props = {
  businessId: string;
  branchId: string;
  barberId: string;
  serviceId: string;
};

export function BookingForm({ businessId, branchId, barberId, serviceId }: Props) {
  const [datetime, setDatetime] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Reservando...");
    try {
      await apiPost("/appointments", {
        business_id: businessId,
        branch_id: branchId,
        barber_id: barberId,
        service_id: serviceId,
        datetime,
        client_name: clientName,
        client_phone: clientPhone,
        client_email: clientEmail || null,
      });
      setMessage("Turno creado correctamente");
    } catch {
      setMessage("No fue posible crear el turno");
    }
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 460 }}>
      <h3>Reservar turno</h3>
      <input required placeholder="Nombre" value={clientName} onChange={(e) => setClientName(e.target.value)} />
      <input required placeholder="Teléfono" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
      <input type="email" placeholder="Email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
      <input required type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} />
      <button type="submit">Reservar</button>
      <small>{message}</small>
    </form>
  );
}
