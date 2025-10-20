import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, getInvoiceStatusInfo } from '@/lib/utils'
import { DollarSign, Users, FileText, TrendingUp } from 'lucide-react'
import Link from 'next/link'

async function getDashboardData(userId: string) {
    // Obtener totales
    const [totalClients, totalInvoices, invoices] = await Promise.all([
        prisma.client.count({ where: { userId } }),
        prisma.invoice.count({ where: { userId } }),
        prisma.invoice.findMany({
            where: { userId },
            include: { client: true },
            orderBy: { date: 'desc' },
            take: 5,
        }),
    ])

    // Calcular ingresos totales
    const totalRevenue = await prisma.invoice.aggregate({
        where: { userId, status: 'PAID' },
        _sum: { total: true },
    })

    // Facturas por estado
    const invoicesByStatus = await prisma.invoice.groupBy({
        by: ['status'],
        where: { userId },
        _count: { status: true },
    })

    return {
        totalClients,
        totalInvoices,
        totalRevenue: totalRevenue._sum.total || 0,
        recentInvoices: invoices,
        invoicesByStatus,
    }
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)
    const data = await getDashboardData(session!.user.id)

    const stats = [
        {
            title: 'Ingresos Totales',
            value: formatCurrency(data.totalRevenue),
            icon: DollarSign,
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
        },
        {
            title: 'Total Facturas',
            value: data.totalInvoices.toString(),
            icon: FileText,
            color: 'from-blue-500 to-indigo-600',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
        },
        {
            title: 'Clientes',
            value: data.totalClients.toString(),
            icon: Users,
            color: 'from-purple-500 to-pink-600',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
        },
        {
            title: 'Crecimiento',
            value: '+12%',
            icon: TrendingUp,
            color: 'from-orange-500 to-red-600',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600',
        },
    ]

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <Card
                            key={stat.title}
                            className={`animate-fade-in-up delay-${index * 100}`}
                            hover
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                                </div>
                                <div className={`p-4 ${stat.bgColor} rounded-2xl`}>
                                    <Icon className={stat.iconColor} size={32} />
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* Facturas por Estado */}
            <Card className="animate-fade-in-up delay-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Facturas por Estado
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.invoicesByStatus.map((item) => {
                        const statusInfo = getInvoiceStatusInfo(item.status)
                        return (
                            <div
                                key={item.status}
                                className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
                            >
                                <Badge variant={statusInfo.variant} className="mb-2">
                                    {statusInfo.label}
                                </Badge>
                                <p className="text-2xl font-bold text-gray-800">
                                    {item._count.status}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </Card>

            {/* Facturas Recientes */}
            <Card className="animate-fade-in-up delay-300">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Facturas Recientes</h3>
                    <Link
                        href="/facturas"
                        className="text-blue-500 hover:text-blue-600 font-semibold transition-colors"
                    >
                        Ver todas →
                    </Link>
                </div>

                <div className="space-y-3">
                    {data.recentInvoices.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            No hay facturas todavía. ¡Crea tu primera factura!
                        </p>
                    ) : (
                        data.recentInvoices.map((invoice) => {
                            const statusInfo = getInvoiceStatusInfo(invoice.status)
                            return (
                                <div
                                    key={invoice.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">
                                            {invoice.invoiceNumber}
                                        </p>
                                        <p className="text-sm text-gray-600">{invoice.client.name}</p>
                                    </div>
                                    <div className="text-right mr-4">
                                        <p className="font-bold text-gray-800">
                                            {formatCurrency(invoice.total)}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(invoice.date).toLocaleDateString('es-ES')}
                                        </p>
                                    </div>
                                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                                </div>
                            )
                        })
                    )}
                </div>
            </Card>

            {/* Acciones Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up delay-400">
                <Link href="/facturas/nueva">
                    <Card hover className="text-center cursor-pointer">
                        <div className="text-5xl mb-4">📝</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Nueva Factura
                        </h3>
                        <p className="text-gray-600">Crear una nueva factura para un cliente</p>
                    </Card>
                </Link>

                <Link href="/clientes/nuevo">
                    <Card hover className="text-center cursor-pointer">
                        <div className="text-5xl mb-4">👥</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Nuevo Cliente
                        </h3>
                        <p className="text-gray-600">Agregar un nuevo cliente al sistema</p>
                    </Card>
                </Link>
            </div>
        </div>
    )
}

