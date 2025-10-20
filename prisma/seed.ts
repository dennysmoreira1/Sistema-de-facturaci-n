import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Iniciando seed de la base de datos...')

    // Limpiar datos existentes
    await prisma.invoiceItem.deleteMany()
    await prisma.invoice.deleteMany()
    await prisma.client.deleteMany()
    await prisma.user.deleteMany()

    // Crear usuario demo
    const hashedPassword = await bcrypt.hash('demo123', 10)
    const demoUser = await prisma.user.create({
        data: {
            name: 'Usuario Demo',
            email: 'demo@facturacion.com',
            password: hashedPassword,
        },
    })

    console.log('✅ Usuario demo creado:', demoUser.email)

    // Crear clientes de prueba
    const clientes = await Promise.all([
        prisma.client.create({
            data: {
                name: 'María Fernanda García',
                email: 'maria.garcia@techsolutions.ec',
                company: 'Tech Solutions Ecuador S.A.',
                phone: '+593 98 765 4321',
                address: 'Av. Amazonas N24-155 y Coruña, Quito 170143',
                userId: demoUser.id,
            },
        }),
        prisma.client.create({
            data: {
                name: 'Juan Carlos Pérez',
                email: 'juan.perez@innovatech.ec',
                company: 'InnovaTech Guayaquil Cía. Ltda.',
                phone: '+593 99 123 4567',
                address: 'Av. 9 de Octubre 424 y Baquerizo Moreno, Guayaquil 090313',
                userId: demoUser.id,
            },
        }),
        prisma.client.create({
            data: {
                name: 'Ana Cristina Martínez',
                email: 'ana.martinez@digitalec.com',
                company: 'Digital Group Ecuador',
                phone: '+593 96 234 5678',
                address: 'Av. de los Shyris N34-98 y República del Salvador, Quito 170135',
                userId: demoUser.id,
            },
        }),
        prisma.client.create({
            data: {
                name: 'Carlos Alberto Rodríguez',
                email: 'carlos.rodriguez@startupec.com',
                company: 'StartupEC S.A.S.',
                phone: '+593 97 345 6789',
                address: 'Av. República de El Salvador N36-84, Quito 170135',
                userId: demoUser.id,
            },
        }),
        prisma.client.create({
            data: {
                name: 'Laura Patricia Sánchez',
                email: 'laura.sanchez@consultingec.com',
                company: 'Consulting Pro Ecuador',
                phone: '+593 98 456 7890',
                address: 'Av. Francisco de Orellana, Edificio Blue Towers, Guayaquil 090150',
                userId: demoUser.id,
            },
        }),
    ])

    console.log(`✅ ${clientes.length} clientes creados`)

    // Crear facturas de prueba
    const fechaActual = new Date()
    const hace30Dias = new Date(fechaActual)
    hace30Dias.setDate(hace30Dias.getDate() - 30)
    const hace15Dias = new Date(fechaActual)
    hace15Dias.setDate(hace15Dias.getDate() - 15)
    const hace5Dias = new Date(fechaActual)
    hace5Dias.setDate(hace5Dias.getDate() - 5)

    // Factura 1 - Pagada
    const factura1 = await prisma.invoice.create({
        data: {
            invoiceNumber: 'INV-2024-001',
            date: hace30Dias,
            status: 'PAID',
            subtotal: 1000,
            taxRate: 15,
            taxAmount: 150,
            total: 1150,
            notes: 'Desarrollo de sitio web corporativo',
            userId: demoUser.id,
            clientId: clientes[0].id,
            items: {
                create: [
                    {
                        description: 'Diseño UI/UX',
                        quantity: 1,
                        unitPrice: 400,
                        total: 400,
                    },
                    {
                        description: 'Desarrollo Frontend',
                        quantity: 1,
                        unitPrice: 600,
                        total: 600,
                    },
                ],
            },
        },
    })

    // Factura 2 - Pagada
    const factura2 = await prisma.invoice.create({
        data: {
            invoiceNumber: 'INV-2024-002',
            date: hace15Dias,
            status: 'PAID',
            subtotal: 2500,
            taxRate: 15,
            taxAmount: 375,
            total: 2875,
            notes: 'Consultoría tecnológica - Fase 1',
            userId: demoUser.id,
            clientId: clientes[1].id,
            items: {
                create: [
                    {
                        description: 'Análisis de sistemas',
                        quantity: 20,
                        unitPrice: 75,
                        total: 1500,
                    },
                    {
                        description: 'Arquitectura de soluciones',
                        quantity: 10,
                        unitPrice: 100,
                        total: 1000,
                    },
                ],
            },
        },
    })

    // Factura 3 - Pendiente
    const factura3 = await prisma.invoice.create({
        data: {
            invoiceNumber: 'INV-2024-003',
            date: hace5Dias,
            status: 'PENDING',
            subtotal: 1800,
            taxRate: 15,
            taxAmount: 270,
            total: 2070,
            notes: 'Campaña de marketing digital',
            userId: demoUser.id,
            clientId: clientes[2].id,
            items: {
                create: [
                    {
                        description: 'Estrategia de contenidos',
                        quantity: 1,
                        unitPrice: 800,
                        total: 800,
                    },
                    {
                        description: 'Gestión de redes sociales',
                        quantity: 1,
                        unitPrice: 1000,
                        total: 1000,
                    },
                ],
            },
        },
    })

    // Factura 4 - Pendiente
    const factura4 = await prisma.invoice.create({
        data: {
            invoiceNumber: 'INV-2024-004',
            date: fechaActual,
            status: 'PENDING',
            subtotal: 3500,
            taxRate: 15,
            taxAmount: 525,
            total: 4025,
            notes: 'Desarrollo de aplicación móvil',
            userId: demoUser.id,
            clientId: clientes[3].id,
            items: {
                create: [
                    {
                        description: 'Desarrollo iOS',
                        quantity: 1,
                        unitPrice: 1750,
                        total: 1750,
                    },
                    {
                        description: 'Desarrollo Android',
                        quantity: 1,
                        unitPrice: 1750,
                        total: 1750,
                    },
                ],
            },
        },
    })

    // Factura 5 - Vencida
    const hace45Dias = new Date(fechaActual)
    hace45Dias.setDate(hace45Dias.getDate() - 45)
    const factura5 = await prisma.invoice.create({
        data: {
            invoiceNumber: 'INV-2024-005',
            date: hace45Dias,
            dueDate: hace30Dias,
            status: 'OVERDUE',
            subtotal: 1200,
            taxRate: 15,
            taxAmount: 180,
            total: 1380,
            notes: 'Servicios de soporte técnico',
            userId: demoUser.id,
            clientId: clientes[4].id,
            items: {
                create: [
                    {
                        description: 'Soporte técnico mensual',
                        quantity: 3,
                        unitPrice: 400,
                        total: 1200,
                    },
                ],
            },
        },
    })

    console.log('✅ 5 facturas creadas con sus items')

    console.log('\n🎉 Seed completado exitosamente!')
    console.log('\n📊 Resumen:')
    console.log(`   - Usuarios: 1`)
    console.log(`   - Clientes: ${clientes.length}`)
    console.log(`   - Facturas: 5`)
    console.log(`\n🔑 Credenciales de acceso:`)
    console.log(`   Email: demo@facturacion.com`)
    console.log(`   Password: demo123`)
}

main()
    .catch((e) => {
        console.error('❌ Error en seed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

