# 🚀 SaaS Mini App - Facturación y CRM

Sistema completo de facturación, gestión de clientes y CRM construido con tecnologías modernas.

## 📋 Características

### ✨ Funcionalidades Principales

- **Autenticación de Usuarios**
  - Registro y login seguros
  - Rutas protegidas por sesión
  - Gestión de perfiles

- **Dashboard Inteligente**
  - KPIs en tiempo real
  - Facturas emitidas
  - Ingresos totales
  - Clientes registrados
  - Gráficos interactivos

- **Gestión de Clientes**
  - Crear, editar y eliminar clientes
  - Campos completos: nombre, email, empresa, teléfono, dirección
  - Búsqueda y filtros avanzados

- **Gestión de Facturas**
  - CRUD completo de facturas
  - Asociación con clientes
  - Items detallados (cantidad, precio, subtotal)
  - Cálculo automático de impuestos
  - Estados: Pagada, Pendiente, Vencida
  - Exportación a PDF
  - Exportación a CSV

- **Filtros y Búsqueda**
  - Filtrar facturas por cliente
  - Filtrar por estado
  - Filtrar por rango de fechas
  - Búsqueda de clientes

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS con animaciones personalizadas
- **Base de Datos:** Prisma + SQLite (puede usar PostgreSQL)
- **Autenticación:** NextAuth.js
- **Validación:** Zod + React Hook Form
- **Exportación PDF:** jsPDF + html2canvas
- **Gráficos:** Recharts
- **Iconos:** Lucide React

## 📁 Estructura del Proyecto

```
SaaS Mini App/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Rutas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Rutas protegidas
│   │   ├── dashboard/       # Dashboard principal
│   │   ├── clientes/        # Gestión de clientes
│   │   └── facturas/        # Gestión de facturas
│   ├── api/                 # API Routes
│   │   ├── auth/           # NextAuth endpoints
│   │   ├── clients/        # Endpoints de clientes
│   │   └── invoices/       # Endpoints de facturas
│   ├── globals.css         # Estilos globales + animaciones
│   └── layout.tsx          # Layout principal
├── components/              # Componentes React
│   ├── ui/                 # Componentes UI reutilizables
│   ├── dashboard/          # Componentes del dashboard
│   ├── clients/            # Componentes de clientes
│   ├── invoices/           # Componentes de facturas
│   └── providers/          # Context providers
├── lib/                    # Utilidades y configuración
│   ├── prisma.ts          # Cliente de Prisma
│   ├── auth.ts            # Configuración de NextAuth
│   └── utils.ts           # Funciones auxiliares
├── prisma/                 # Prisma ORM
│   ├── schema.prisma      # Schema de la base de datos
│   └── seed.ts            # Datos de prueba
└── types/                  # Tipos de TypeScript
```

## 🚀 Instalación y Configuración

### 1. Clonar o descargar el proyecto

```bash
cd "SaaS Mini App"
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Database (SQLite para desarrollo local)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key-super-segura-cambiala-en-produccion"
```

### 4. Configurar la base de datos

```bash
# Crear la base de datos y tablas
npm run db:push

# (Opcional) Poblar con datos de prueba
npm run db:seed
```

### 5. Ejecutar el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 👤 Credenciales de Prueba

Si ejecutaste el seed, puedes usar:

- **Email:** demo@facturacion.com
- **Password:** demo123

## 📊 Uso de la Aplicación

### Registro e Inicio de Sesión

1. Accede a `/register` para crear una cuenta
2. O usa `/login` si ya tienes una cuenta
3. Serás redirigido al dashboard automáticamente

### Dashboard

- Visualiza KPIs en tiempo real
- Gráficos de ingresos mensuales
- Resumen de facturas por estado
- Acceso rápido a módulos

### Gestión de Clientes

1. Ve a "Clientes" en el menú lateral
2. Haz clic en "Nuevo Cliente"
3. Completa el formulario
4. Usa la barra de búsqueda para encontrar clientes
5. Edita o elimina clientes según sea necesario

### Gestión de Facturas

1. Ve a "Facturas" en el menú lateral
2. Haz clic en "Nueva Factura"
3. Selecciona un cliente
4. Agrega items (productos/servicios)
5. Los totales se calculan automáticamente
6. Guarda la factura

### Exportar Facturas

- **PDF:** Haz clic en "Exportar PDF" en cualquier factura
- **CSV:** En la lista de facturas, usa "Exportar a CSV"

### Filtros

- Filtra por cliente
- Filtra por estado (Pagada, Pendiente, Vencida)
- Filtra por rango de fechas

## 🎨 Personalización

### Colores

Edita `tailwind.config.ts` para cambiar los colores principales:

```ts
colors: {
  primary: '#3B82F6',    // Azul
  secondary: '#8B5CF6',  // Morado
}
```

### Animaciones

Las animaciones personalizadas están en `app/globals.css`. Puedes:
- Modificar duraciones
- Agregar nuevas animaciones
- Personalizar delays

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Sesiones seguras con NextAuth
- Validación de formularios con Zod
- Rutas protegidas del lado del servidor
- CSRF protection incluido

## 📦 Producción

### Cambiar a PostgreSQL

1. Edita `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Cambiar de "sqlite"
  url      = env("DATABASE_URL")
}
```

2. Actualiza `.env`:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/nombre_db?schema=public"
```

3. Ejecuta las migraciones:

```bash
npm run db:push
```

### Build para producción

```bash
npm run build
npm start
```

## 🐛 Troubleshooting

### Error de base de datos

```bash
# Resetear la base de datos
rm prisma/dev.db
npm run db:push
```

### Error de tipos de TypeScript

```bash
# Regenerar tipos de Prisma
npx prisma generate
```

### Puerto en uso

Cambia el puerto en `package.json`:

```json
"dev": "next dev -p 3001"
```

## 📚 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run start` - Ejecutar build de producción
- `npm run lint` - Linter de código
- `npm run db:push` - Sincronizar schema con DB
- `npm run db:studio` - Abrir Prisma Studio (GUI de DB)
- `npm run db:seed` - Poblar DB con datos de prueba

## 🤝 Contribuir

Este es un proyecto educativo. Siéntete libre de:
- Agregar nuevas funcionalidades
- Mejorar el diseño
- Optimizar el código
- Reportar bugs

## 📄 Licencia

MIT License - Úsalo libremente para aprender y crear.

## 🎯 Próximas Mejoras

- [ ] Modo oscuro
- [ ] Multi-idioma (i18n)
- [ ] Notificaciones por email
- [ ] Recordatorios de facturas vencidas
- [ ] Dashboard con más métricas
- [ ] Integración con pasarelas de pago
- [ ] App móvil con React Native

---

**Desarrollado con ❤️ usando Next.js, TypeScript y Tailwind CSS**

