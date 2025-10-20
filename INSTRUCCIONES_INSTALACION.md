# 🚀 Instrucciones de Instalación - SaaS Facturación

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- (Opcional) **PostgreSQL** si deseas usar PostgreSQL en lugar de SQLite

## 🔧 Pasos de Instalación

### 1. Instalar Dependencias

Abre PowerShell o la terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Este comando instalará todas las dependencias necesarias incluyendo:
- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma
- NextAuth
- y todas las demás librerías

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (copia del `.env.example`):

```bash
# Database (SQLite para desarrollo local)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="cambia-esto-por-una-clave-segura-aleatoria"
```

**Nota:** Para generar un `NEXTAUTH_SECRET` seguro, puedes ejecutar:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Configurar la Base de Datos

#### Opción A: SQLite (Recomendado para desarrollo)

Ya está configurado por defecto. Solo ejecuta:

```bash
npm run db:push
```

#### Opción B: PostgreSQL (Para producción)

1. Edita `prisma/schema.prisma` y cambia:
   ```prisma
   datasource db {
     provider = "postgresql"  // Cambiar de "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. Actualiza `.env` con tu conexión de PostgreSQL:
   ```
   DATABASE_URL="postgresql://usuario:password@localhost:5432/nombre_db"
   ```

3. Ejecuta:
   ```bash
   npm run db:push
   ```

### 4. Poblar la Base de Datos con Datos de Prueba

```bash
npm run db:seed
```

Este comando creará:
- 1 usuario demo
- 5 clientes de ejemplo
- 5 facturas con diferentes estados

**Credenciales de acceso:**
- Email: `demo@facturacion.com`
- Password: `demo123`

### 5. Ejecutar el Proyecto

```bash
npm run dev
```

Abre tu navegador en [http://localhost:3000](http://localhost:3000)

## ✅ Verificar que Todo Funcione

1. **Página de Login:** Deberías ver la página de inicio de sesión
2. **Iniciar Sesión:** Usa las credenciales demo
3. **Dashboard:** Verás estadísticas y datos de ejemplo
4. **Clientes:** Navega a la sección de clientes
5. **Facturas:** Navega a la sección de facturas

## 🎨 Estructura del Proyecto

```
SaaS Mini App/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Páginas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Páginas protegidas
│   │   ├── dashboard/
│   │   ├── clientes/
│   │   └── facturas/
│   ├── api/                 # API Routes
│   └── globals.css          # Estilos globales + animaciones
├── components/              # Componentes React
│   ├── ui/                  # Componentes UI reutilizables
│   └── layout/              # Sidebar, Navbar
├── lib/                     # Utilidades
│   ├── prisma.ts
│   ├── auth.ts
│   ├── utils.ts
│   └── exportPDF.ts
├── prisma/
│   ├── schema.prisma        # Schema de la BD
│   └── seed.ts              # Datos de prueba
└── types/                   # Tipos TypeScript
```

## 🚀 Funcionalidades Implementadas

### ✨ Autenticación
- [x] Registro de usuarios
- [x] Login/Logout
- [x] Rutas protegidas
- [x] Sesiones seguras con NextAuth

### 📊 Dashboard
- [x] KPIs en tiempo real
- [x] Ingresos totales
- [x] Facturas por estado
- [x] Facturas recientes
- [x] Acciones rápidas

### 👥 Gestión de Clientes
- [x] Crear clientes
- [x] Editar clientes
- [x] Eliminar clientes
- [x] Buscar clientes
- [x] Ver facturas por cliente

### 📄 Gestión de Facturas
- [x] Crear facturas
- [x] Editar facturas
- [x] Eliminar facturas
- [x] Items con cálculos automáticos
- [x] Estados: Pagada, Pendiente, Vencida
- [x] Filtrar por estado
- [x] Filtrar por cliente

### 📤 Exportación
- [x] Exportar factura a PDF
- [x] Exportar listado a CSV

### 🎨 Diseño
- [x] Tailwind CSS
- [x] Animaciones personalizadas
- [x] Diseño responsivo
- [x] UI moderna y limpia

## 📝 Comandos Útiles

```bash
# Desarrollo
npm run dev                  # Iniciar servidor de desarrollo

# Base de Datos
npm run db:push             # Sincronizar schema con BD
npm run db:studio           # Abrir Prisma Studio (GUI)
npm run db:seed             # Poblar con datos de prueba

# Producción
npm run build               # Build para producción
npm run start               # Ejecutar build de producción

# Otros
npm run lint                # Linter de código
```

## 🗄️ Prisma Studio

Para ver y editar la base de datos con una interfaz gráfica:

```bash
npm run db:studio
```

Se abrirá en [http://localhost:5555](http://localhost:5555)

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
npm install
```

### Error de base de datos
```bash
# Eliminar BD y recrear
rm prisma/dev.db
npm run db:push
npm run db:seed
```

### Error de tipos TypeScript
```bash
npx prisma generate
```

### Puerto en uso
Cambia el puerto en `package.json`:
```json
"dev": "next dev -p 3001"
```

### Problemas con NextAuth
Verifica que `NEXTAUTH_SECRET` esté configurado en `.env`

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcryptjs
- ✅ Sesiones JWT seguras
- ✅ Validación de formularios con Zod
- ✅ Rutas protegidas con middleware
- ✅ CSRF protection incluido

## 🌐 Despliegue en Producción

### Vercel (Recomendado)

1. Sube tu código a GitHub
2. Conecta tu repositorio en [Vercel](https://vercel.com)
3. Configura las variables de entorno
4. Despliega automáticamente

### Variables de entorno necesarias en Vercel:
```
DATABASE_URL="tu_url_de_postgresql"
NEXTAUTH_URL="https://tu-dominio.vercel.app"
NEXTAUTH_SECRET="tu_secret_seguro"
```

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de NextAuth](https://next-auth.js.org)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)

## 🎯 Próximos Pasos

Una vez que todo esté funcionando:

1. **Crea tu primer cliente real**
2. **Genera tu primera factura**
3. **Exporta a PDF para ver el resultado**
4. **Personaliza los colores en `tailwind.config.ts`**
5. **Agrega tu logo y marca**

## 💡 Tips

- Usa `Ctrl + C` para detener el servidor de desarrollo
- Revisa `README.md` para más información
- Los archivos `COMPONENTES_REUTILIZABLES.md` y `ComponentesReact.jsx` originales contienen documentación útil

## 🎨 Personalización

### Cambiar Colores

Edita `tailwind.config.ts`:
```typescript
colors: {
  primary: '#3B82F6',    // Tu color principal
  secondary: '#8B5CF6',  // Tu color secundario
}
```

### Cambiar Logo

Edita `components/layout/Sidebar.tsx` y reemplaza el emoji 📊 con tu logo.

## 🤝 Soporte

Si encuentras algún problema:
1. Revisa la consola del navegador (F12)
2. Revisa la terminal donde corre el servidor
3. Verifica que todas las dependencias estén instaladas
4. Asegúrate de que la base de datos esté configurada

---

**¡Listo! Tu SaaS de facturación está completo y funcionando. 🎉**

Desarrollado con ❤️ usando Next.js, TypeScript y Tailwind CSS

