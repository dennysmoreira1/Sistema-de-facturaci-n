import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const clientSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    company: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
})

// GET - Obtener un cliente por ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const client = await prisma.client.findUnique({
            where: {
                id: params.id,
                userId: session.user.id,
            },
            include: {
                invoices: {
                    orderBy: { date: 'desc' },
                },
            },
        })

        if (!client) {
            return NextResponse.json(
                { error: 'Cliente no encontrado' },
                { status: 404 }
            )
        }

        return NextResponse.json(client)
    } catch (error) {
        console.error('Error al obtener cliente:', error)
        return NextResponse.json(
            { error: 'Error al obtener cliente' },
            { status: 500 }
        )
    }
}

// PUT - Actualizar un cliente
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
        const validatedData = clientSchema.parse(body)

        const client = await prisma.client.update({
            where: {
                id: params.id,
                userId: session.user.id,
            },
            data: validatedData,
        })

        return NextResponse.json(client)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            )
        }

        console.error('Error al actualizar cliente:', error)
        return NextResponse.json(
            { error: 'Error al actualizar cliente' },
            { status: 500 }
        )
    }
}

// DELETE - Eliminar un cliente
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        await prisma.client.delete({
            where: {
                id: params.id,
                userId: session.user.id,
            },
        })

        return NextResponse.json({ message: 'Cliente eliminado exitosamente' })
    } catch (error) {
        console.error('Error al eliminar cliente:', error)
        return NextResponse.json(
            { error: 'Error al eliminar cliente. Puede que tenga facturas asociadas.' },
            { status: 500 }
        )
    }
}

