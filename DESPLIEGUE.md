# 🚀 Guía de Despliegue - GitHub y Vercel

## 📋 Preparación del Proyecto

✅ **Archivos listos para producción**
- Código limpio y optimizado
- Documentación completa
- `.gitignore` configurado

---

## 🐙 Parte 1: Subir a GitHub

### 1️⃣ Inicializar Git (si no lo has hecho)

```powershell
git init
git add .
git commit -m "Initial commit: SaaS Facturación Ecuador"
```

### 2️⃣ Crear repositorio en GitHub

1. Ve a [github.com](https://github.com)
2. Haz clic en **"New repository"** (botón verde)
3. Llena los datos:
   - **Repository name:** `saas-facturacion-ecuador`
   - **Description:** Sistema de facturación y CRM para Ecuador
   - **Visibility:** Public o Private (tu elección)
   - ⚠️ **NO** marques "Add README" (ya lo tienes)
4. Haz clic en **"Create repository"**

### 3️⃣ Conectar y subir

GitHub te mostrará comandos. Usa estos:

```powershell
git remote add origin https://github.com/TU_USUARIO/saas-facturacion-ecuador.git
git branch -M main
git push -u origin main
```

Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub.

---

## ☁️ Parte 2: Desplegar en Vercel

### Opción A: Desde GitHub (Recomendado)

#### 1️⃣ Conectar Vercel con GitHub

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en **"Sign Up"** o **"Login"**
3. Elige **"Continue with GitHub"**
4. Autoriza a Vercel

#### 2️⃣ Importar Proyecto

1. En el dashboard de Vercel, clic en **"Add New..."** → **"Project"**
2. Busca tu repositorio: `saas-facturacion-ecuador`
3. Haz clic en **"Import"**

#### 3️⃣ Configurar Variables de Entorno

**⚠️ IMPORTANTE:** Antes de desplegar, agrega estas variables:

En la sección **"Environment Variables"**, agrega:

```
DATABASE_URL = postgresql://usuario:password@host:5432/database
NEXTAUTH_URL = https://tu-proyecto.vercel.app
NEXTAUTH_SECRET = [genera uno nuevo abajo]
```

**Para generar NEXTAUTH_SECRET seguro:**

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copia el resultado y pégalo en `NEXTAUTH_SECRET`.

#### 4️⃣ Configurar Base de Datos

**Opciones de Base de Datos para Producción:**

**A) Vercel Postgres (Fácil y gratis para empezar)**

1. En Vercel, ve a tu proyecto
2. Clic en **"Storage"** → **"Create Database"**
3. Selecciona **"Postgres"**
4. Copia el `DATABASE_URL` automáticamente
5. Ya está conectado ✅

**B) Neon (PostgreSQL gratis)**

1. Ve a [neon.tech](https://neon.tech)
2. Crea cuenta y nuevo proyecto
3. Copia la `DATABASE_URL`
4. Pégala en Vercel

**C) Supabase (PostgreSQL gratis)**

1. Ve a [supabase.com](https://supabase.com)
2. Crea proyecto
3. Ve a Settings → Database
4. Copia la **Connection String**
5. Pégala en Vercel

#### 5️⃣ Actualizar schema.prisma para PostgreSQL

Si usas PostgreSQL en producción (recomendado), actualiza:

```prisma
datasource db {
  provider = "postgresql"  // Cambiar de "sqlite"
  url      = env("DATABASE_URL")
}
```

Commitea el cambio:

```powershell
git add prisma/schema.prisma
git commit -m "Update schema for PostgreSQL"
git push
```

#### 6️⃣ Desplegar

1. Haz clic en **"Deploy"**
2. Espera 1-2 minutos
3. ¡Listo! 🎉

#### 7️⃣ Configurar Base de Datos en Producción

Después del primer deploy, ejecuta:

1. Ve a tu proyecto en Vercel
2. Clic en **"Settings"** → **"General"**
3. Instala Vercel CLI:

```powershell
npm i -g vercel
vercel login
vercel link
```

4. Ejecuta las migraciones:

```powershell
vercel env pull .env.production
npx prisma db push
npx prisma db seed
```

O usa la terminal de Vercel en la web.

---

### Opción B: Desde CLI de Vercel

```powershell
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel

# Seguir las instrucciones
```

---

## 🔧 Configuración Post-Despliegue

### 1️⃣ Dominio Personalizado (Opcional)

1. Ve a **Settings** → **Domains**
2. Agrega tu dominio
3. Configura DNS según instrucciones

### 2️⃣ Variables de Entorno Completas

Asegúrate de tener en Vercel:

```env
# Database (PostgreSQL para producción)
DATABASE_URL="postgresql://usuario:password@host:5432/database"

# NextAuth
NEXTAUTH_URL="https://tu-proyecto.vercel.app"
NEXTAUTH_SECRET="tu-secret-super-seguro-de-produccion"

# Opcional: Email
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT="587"
# SMTP_USER="tu@email.com"
# SMTP_PASSWORD="tu-password"
```

### 3️⃣ Regenera el Build

Después de agregar variables de entorno:

1. Ve a **Deployments**
2. En el último deployment, clic en los **tres puntos**
3. Selecciona **"Redeploy"**

---

## 🔒 Seguridad en Producción

### ✅ Checklist de Seguridad

- [ ] `NEXTAUTH_SECRET` único y seguro (32+ caracteres)
- [ ] Base de datos con contraseña fuerte
- [ ] Variables de entorno nunca en el código
- [ ] `.env` en `.gitignore` ✅ (ya está)
- [ ] HTTPS habilitado (Vercel lo hace automático ✅)
- [ ] Cambia las credenciales demo en producción

### 🔐 Cambiar Usuario Demo

Después de desplegar, crea tu usuario real:

1. Ve a `/register` en tu app
2. Crea tu cuenta
3. Borra el usuario demo desde Prisma Studio

---

## 🗄️ Migración de Datos

### Si ya tienes datos en SQLite:

```powershell
# Exportar datos de SQLite
npx prisma db pull
npx prisma db push

# O usar herramientas de migración
# https://www.prisma.io/docs/guides/migrate-to-prisma
```

---

## 📊 Monitoreo

### En Vercel Dashboard verás:

- **Analytics:** Visitantes, páginas vistas
- **Speed Insights:** Performance
- **Logs:** Errores y debugging
- **Deployments:** Historial de deploys

---

## 🚀 Flujo de Desarrollo Continuo

### Workflow recomendado:

```powershell
# 1. Hacer cambios localmente
git add .
git commit -m "Descripción del cambio"

# 2. Subir a GitHub
git push

# 3. Vercel despliega automáticamente ✅
```

**Vercel detecta cambios en GitHub y re-despliega automáticamente.**

---

## 🆘 Solución de Problemas

### Error: "Cannot find module"

```powershell
# En Vercel, en Settings → General → Build Command:
npm run build

# Install Command:
npm install
```

### Error: Database connection

- Verifica que `DATABASE_URL` esté correcta
- Asegúrate de que la BD permita conexiones externas
- Ejecuta `npx prisma generate` localmente y commitea

### Error: NEXTAUTH_URL

- Debe ser la URL completa: `https://tu-proyecto.vercel.app`
- Sin "/" al final

### Error: Build timeout

- Aumenta el timeout en Settings → General
- O divide el proyecto en funciones más pequeñas

---

## ✅ Verificación Final

Después de desplegar, verifica:

- [ ] La app carga correctamente
- [ ] Puedes registrarte/iniciar sesión
- [ ] Puedes crear clientes
- [ ] Puedes crear facturas
- [ ] Las exportaciones funcionan
- [ ] Los filtros funcionan
- [ ] El diseño se ve bien

---

## 🎯 URLs Finales

Tu proyecto estará disponible en:

- **Vercel:** `https://tu-proyecto.vercel.app`
- **GitHub:** `https://github.com/tu-usuario/saas-facturacion-ecuador`
- **Dominio personalizado** (si configuraste): `https://tudominio.com`

---

## 📞 Recursos Útiles

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deploy:** https://nextjs.org/docs/deployment
- **Prisma Postgres:** https://www.prisma.io/docs/guides/database/using-prisma-with-planetscale
- **GitHub Actions:** Para CI/CD avanzado

---

## 🎉 ¡Felicidades!

Tu SaaS de facturación está desplegado y listo para usar en producción.

**Comparte tu proyecto:**
- 🔗 URL del proyecto
- 📦 Repositorio de GitHub
- 💼 LinkedIn
- 🐦 Twitter

---

**¿Necesitas ayuda?**
- Revisa los logs en Vercel Dashboard
- Verifica las variables de entorno
- Consulta la documentación de Vercel

---

*Guía creada para: SaaS Facturación Ecuador 🇪🇨*
*Stack: Next.js + TypeScript + Tailwind + Prisma + Vercel*

