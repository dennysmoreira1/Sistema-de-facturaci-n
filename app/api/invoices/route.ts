import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const invoiceItemSchema = z.object({
    description: z.string().min(1, 'La descripción es requerida'),
    quantity: z.number().min(0.01, 'La cantidad debe ser mayor a 0'),
    unitPrice: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
    total: z.number(),
})

const invoiceSchema = z.object({
    clientId: z.string().min(1, 'El cliente es requerido'),
    invoiceNumber: z.string().min(1, 'El número de factura es requerido'),
    date: z.string(),
    dueDate: z.string().optional(),
    status: z.enum(['PAID', 'PENDING', 'OVERDUE', 'CANCELLED']),
    subtotal: z.number(),
    taxRate: z.number().min(0).max(100),
    taxAmount: z.number(),
    total: z.number(),
    notes: z.string().optional(),
    items: z.array(invoiceItemSchema).min(1, 'Debe haber al menos un item'),
})

// GET - Obtener todas las facturas
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const clientId = searchParams.get('clientId')

        const invoices = await prisma.invoice.findMany({
            where: {
                userId: session.user.id,
                ...(status && { status: status as any }),
                ...(clientId && { clientId }),
            },
            include: {
                client: true,
                items: true,
            },
            orderBy: { date: 'desc' },
        })

        return NextResponse.json(invoices)
    } catch (error) {
        console.error('Error al obtener facturas:', error)
        return NextResponse.json(
            { error: 'Error al obtener facturas' },
            { status: 500 }
        )
    }
}

// POST - Crear una nueva factura
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const validatedData = invoiceSchema.parse(body)

        // Verificar que el número de factura sea único
        const existingInvoice = await prisma.invoice.findUnique({
            where: { invoiceNumber: validatedData.invoiceNumber },
        })

        if (existingInvoice) {
            return NextResponse.json(
                { error: 'El número de factura ya existe' },
                { status: 400 }
            )
        }

        // Crear factura con items
        const invoice = await prisma.invoice.create({
            data: {
                invoiceNumber: validatedData.invoiceNumber,
                date: new Date(validatedData.date),
                dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
                status: validatedData.status,
                subtotal: validatedData.subtotal,
                taxRate: validatedData.taxRate,
                taxAmount: validatedData.taxAmount,
                total: validatedData.total,
                notes: validatedData.notes,
                userId: session.user.id,
                clientId: validatedData.clientId,
                items: {
                    create: validatedData.items,
                },
            },
            include: {
                client: true,
                items: true,
            },
        })

        return NextResponse.json(invoice, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            )
        }

        console.error('Error al crear factura:', error)
        return NextResponse.json(
            { error: 'Error al crear factura' },
            { status: 500 }
        )
    }
}

