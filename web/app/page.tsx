import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>TuBarberia SaaS</h1>
      <p>Ingresá a una barbería por slug, por ejemplo:</p>
      <Link href="/demo-barber">/demo-barber</Link>
      <p>
        Panel admin: <Link href="/admin">/admin</Link>
      </p>
    </main>
  );
}
