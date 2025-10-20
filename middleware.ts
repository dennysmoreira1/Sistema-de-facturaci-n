export { default } from 'next-auth/middleware'

// Proteger todas las rutas dentro de /dashboard, /clientes, /facturas
export const config = {
    matcher: ['/dashboard/:path*', '/clientes/:path*', '/facturas/:path*'],
}

