# ⚡ Inicio Rápido - 5 Minutos

## 🚀 Configuración Express

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar base de datos
npm run db:push

# 3. Datos de prueba
npm run db:seed

# 4. Iniciar proyecto
npm run dev
```

## 🔐 Credenciales de Prueba

```
Email: demo@facturacion.com
Password: demo123
```

## 🌐 Abrir Aplicación

Abre tu navegador en: **http://localhost:3000**

---

## 📁 Archivos Importantes

- `INSTRUCCIONES_INSTALACION.md` - Guía completa paso a paso
- `README.md` - Documentación del proyecto
- `.env.example` - Plantilla de variables de entorno

---

## 🎯 Primeros Pasos

1. **Login** → Usa las credenciales de prueba
2. **Dashboard** → Explora los KPIs y estadísticas
3. **Clientes** → Crea tu primer cliente
4. **Facturas** → Genera tu primera factura
5. **Exportar** → Descarga la factura en PDF

---

## ⚠️ Importante: Variables de Entorno

Crea un archivo `.env` en la raíz con:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="cambia-esto-por-clave-segura"
```

Para generar una clave segura:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🛑 Si Algo Falla

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Resetear base de datos
rm prisma/dev.db
npm run db:push
npm run db:seed
```

---

**¡Eso es todo! En 5 minutos tendrás tu SaaS funcionando. 🎉**

