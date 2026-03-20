"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
);

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? error.message : "Login exitoso");
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Admin</h1>
      <form onSubmit={login} style={{ display: "grid", maxWidth: 360, gap: 8 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Contraseña" />
        <button type="submit">Ingresar</button>
      </form>
      <small>{message}</small>
      <p>Desde aquí se integran CRUD de servicios, barberos, sucursales, horarios y turnos.</p>
    </main>
  );
}
