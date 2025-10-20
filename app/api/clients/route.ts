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

// GET - Obtener todos los clientes
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''

        const clients = await prisma.client.findMany({
            where: {
                userId: session.user.id,
                ...(search && {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                        { company: { contains: search, mode: 'insensitive' } },
                    ],
                }),
            },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { invoices: true },
                },
            },
        })

        return NextResponse.json(clients)
    } catch (error) {
        console.error('Error al obtener clientes:', error)
        return NextResponse.json(
            { error: 'Error al obtener clientes' },
            { status: 500 }
        )
    }
}

// POST - Crear un nuevo cliente
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const validatedData = clientSchema.parse(body)

        const client = await prisma.client.create({
            data: {
                ...validatedData,
                userId: session.user.id,
            },
        })

        return NextResponse.json(client, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            )
        }

        console.error('Error al crear cliente:', error)
        return NextResponse.json(
            { error: 'Error al crear cliente' },
            { status: 500 }
        )
    }
}

