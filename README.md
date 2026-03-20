# 💈 Barber SaaS Platform

Plataforma SaaS diseñada para barberías y peluquerías que permite gestionar turnos, clientes y operaciones del negocio desde un solo lugar.

El sistema está pensado para ofrecer una experiencia personalizada para cada barbería, manteniendo una única aplicación escalable (multi-tenant).

---

## 🚀 Características principales

* 📅 Gestión de turnos
* 👨‍🔧 Gestión de barberos
* 🏪 Soporte para múltiples sucursales
* 💲 Configuración de servicios y precios
* 🎨 Personalización de branding (logo, colores, imágenes)
* 🔎 Búsqueda de barberías por nombre
* 📲 Acceso mediante QR o link directo
* 🔐 Panel de administración para negocios
* ⚙️ Arquitectura multi-tenant

---

## 🧠 Concepto del sistema

Esta plataforma **NO es un marketplace**.

Cada barbería:

* Tiene su propia “experiencia”
* Se accede mediante link, QR o búsqueda
* No se mezcla con otras barberías

---

## 🏗️ Arquitectura

### Backend

* FastAPI (Python)
* Supabase (PostgreSQL)
* SQLAlchemy / asyncpg

### Frontend Web

* Next.js

### Mobile

* React Native (Expo)

### Infraestructura

* Supabase:

  * Base de datos
  * Autenticación
  * Storage

---

## 🧩 Multi-Tenant

El sistema está diseñado para manejar múltiples barberías en una sola app.

Cada entidad está asociada a:

```
business_id
```

Esto permite:

* Aislamiento total de datos
* Escalabilidad
* Personalización por negocio

---

## 📊 Modelo de datos

Entidades principales:

* Business (barbería)
* Branch (sucursal)
* Barber (barbero)
* Service (servicio)
* Schedule (horarios)
* Appointment (turnos)

---

## 🔁 Flujo de usuario

### Cliente

1. Busca barbería o accede por QR/link
2. Selecciona:

   * Sucursal
   * Barbero
   * Servicio
3. Elige horario disponible
4. Reserva turno

---

### Barbero / Negocio

1. Accede al panel admin
2. Configura:

   * Servicios
   * Precios
   * Horarios
   * Barberos
3. Gestiona turnos

---

## 📱 Mobile App

Pantallas principales:

* Home (búsqueda + QR)
* Barbería (datos dinámicos)
* Reserva de turno

Persistencia:

* Se guarda la barbería seleccionada (AsyncStorage)

---

## 🌐 Web

* Landing dinámica por barbería
* Ruta basada en slug:

```
/[slug]
```

---

## 🔐 Autenticación

* Supabase Auth
* Uso principal:

  * Administradores (barberos)

---

## 🗄️ Storage

* Supabase Storage para:

  * Logos
  * Imágenes

---

## ⚙️ Instalación (local)

### 1. Clonar repositorio

```bash
git clone https://github.com/tuusuario/tu-repo.git
cd tu-repo
```

---

### 2. Configurar variables de entorno

Crear archivo `.env`:

```
SUPABASE_DB_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

### 3. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

### 4. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

---

### 5. Mobile (Expo)

```bash
cd mobile
npm install
npx expo start
```

---

## 📌 Endpoints principales

### Business

* GET /business/search?q=
* GET /business/{slug}

### Appointments

* POST /appointments
* GET /appointments
* POST /appointments/{id}/confirm
* POST /appointments/{id}/cancel

---

## ⚠️ Consideraciones importantes

* No exponer lógica sensible en frontend
* Validar disponibilidad en backend
* Evitar doble reserva
* Filtrar siempre por business_id

---

## 💡 Roadmap

* [ ] Pagos online
* [ ] Notificaciones push
* [ ] WhatsApp integration
* [ ] Dashboard avanzado
* [ ] Analytics de negocio

---

## 📄 Licencia

MIT License

---

## 🤝 Contribución

Pull requests son bienvenidos. Para cambios grandes, abrir primero un issue.

---

## 📬 Contacto

Para implementar el sistema en tu barbería o negocio:

* Contacto directo: (tu info)
