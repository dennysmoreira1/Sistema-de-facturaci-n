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

// GET - Obtener una factura por ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const invoice = await prisma.invoice.findUnique({
            where: {
                id: params.id,
                userId: session.user.id,
            },
            include: {
                client: true,
                items: true,
            },
        })

        if (!invoice) {
            return NextResponse.json(
                { error: 'Factura no encontrada' },
                { status: 404 }
            )
        }

        return NextResponse.json(invoice)
    } catch (error) {
        console.error('Error al obtener factura:', error)
        return NextResponse.json(
            { error: 'Error al obtener factura' },
            { status: 500 }
        )
    }
}

// PUT - Actualizar una factura
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const validatedData = invoiceSchema.parse(body)

        // Verificar que el número de factura sea único (excluyendo la actual)
        const existingInvoice = await prisma.invoice.findFirst({
            where: {
                invoiceNumber: validatedData.invoiceNumber,
                NOT: { id: params.id },
            },
        })

        if (existingInvoice) {
            return NextResponse.json(
                { error: 'El número de factura ya existe' },
                { status: 400 }
            )
        }

        // Actualizar factura y reemplazar items
        const invoice = await prisma.invoice.update({
            where: {
                id: params.id,
                userId: session.user.id,
            },
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
                clientId: validatedData.clientId,
                items: {
                    deleteMany: {},
                    create: validatedData.items,
                },
            },
            include: {
                client: true,
                items: true,
            },
        })

        return NextResponse.json(invoice)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            )
        }

        console.error('Error al actualizar factura:', error)
        return NextResponse.json(
            { error: 'Error al actualizar factura' },
            { status: 500 }
        )
    }
}

// DELETE - Eliminar una factura
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        await prisma.invoice.delete({
            where: {
                id: params.id,
                userId: session.user.id,
            },
        })

        return NextResponse.json({ message: 'Factura eliminada exitosamente' })
    } catch (error) {
        console.error('Error al eliminar factura:', error)
        return NextResponse.json(
            { error: 'Error al eliminar factura' },
            { status: 500 }
        )
    }
}

