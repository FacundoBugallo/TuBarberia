import { BookingForm } from "@/components/BookingForm";
import { apiGet } from "@/lib/api";

type Business = { id: string; name: string; description?: string; logo_url?: string; primary_color?: string };
type Service = { id: string; name: string; duration_minutes: number; price: number };
type Barber = { id: string; name: string };
type Branch = { id: string; name: string; address: string };

export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await apiGet<Business>(`/business/${slug}`);
  const [services, barbers, branches] = await Promise.all([
    apiGet<Service[]>(`/services?business_id=${business.id}`),
    apiGet<Barber[]>(`/barbers?business_id=${business.id}`),
    apiGet<Branch[]>(`/branches?business_id=${business.id}`),
  ]);

  return (
    <main style={{ padding: 24 }}>
      <header>
        <h1 style={{ color: business.primary_color || "black" }}>{business.name}</h1>
        <p>{business.description}</p>
      </header>
      <section>
        <h2>Servicios</h2>
        <ul>
          {services.map((item) => (
            <li key={item.id}>
              {item.name} - {item.duration_minutes} min - ${item.price}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Barberos</h2>
        <ul>{barbers.map((item) => <li key={item.id}>{item.name}</li>)}</ul>
      </section>
      <section>
        <h2>Sucursales</h2>
        <ul>{branches.map((item) => <li key={item.id}>{item.name} - {item.address}</li>)}</ul>
      </section>
      {services[0] && barbers[0] && branches[0] && (
        <BookingForm
          businessId={business.id}
          serviceId={services[0].id}
          barberId={barbers[0].id}
          branchId={branches[0].id}
        />
      )}
    </main>
  );
}
