'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { Select } from '@/components/ui/Select'
import { formatCurrency, formatDateShort, getInvoiceStatusInfo } from '@/lib/utils'
import { Plus, Edit2, Trash2, FileText, Download } from 'lucide-react'

interface Invoice {
    id: string
    invoiceNumber: string
    date: string
    status: string
    total: number
    client: {
        id: string
        name: string
        company?: string
    }
}

export default function FacturasPage() {
    const router = useRouter()
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
    const [statusFilter, setStatusFilter] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState<{
        open: boolean
        invoice: Invoice | null
    }>({
        open: false,
        invoice: null,
    })
    const [alert, setAlert] = useState<{
        show: boolean
        message: string
        variant: 'success' | 'danger'
    }>({
        show: false,
        message: '',
        variant: 'success',
    })

    useEffect(() => {
        fetchInvoices()
    }, [])

    useEffect(() => {
        let filtered = invoices
        if (statusFilter) {
            filtered = filtered.filter((inv) => inv.status === statusFilter)
        }
        setFilteredInvoices(filtered)
    }, [statusFilter, invoices])

    const fetchInvoices = async () => {
        try {
            const response = await fetch('/api/invoices')
            const data = await response.json()
            setInvoices(data)
            setFilteredInvoices(data)
        } catch (error) {
            showAlert('Error al cargar facturas', 'danger')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteModal.invoice) return

        try {
            const response = await fetch(`/api/invoices/${deleteModal.invoice.id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Error al eliminar factura')
            }

            showAlert('Factura eliminada exitosamente', 'success')
            fetchInvoices()
        } catch (error: any) {
            showAlert(error.message || 'Error al eliminar factura', 'danger')
        } finally {
            setDeleteModal({ open: false, invoice: null })
        }
    }

    const exportToCSV = () => {
        const headers = ['Número', 'Cliente', 'Fecha', 'Estado', 'Total']
        const rows = filteredInvoices.map((inv) => [
            inv.invoiceNumber,
            inv.client.name,
            formatDateShort(inv.date),
            getInvoiceStatusInfo(inv.status).label,
            inv.total.toString(),
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.join(',')),
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `facturas_${new Date().toISOString().split('T')[0]}.csv`
        link.click()
    }

    const showAlert = (message: string, variant: 'success' | 'danger') => {
        setAlert({ show: true, message, variant })
        setTimeout(
            () => setAlert({ show: false, message: '', variant: 'success' }),
            5000
        )
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
            </div>
        )
    }

    // Estadísticas
    const stats = {
        total: invoices.length,
        paid: invoices.filter((i) => i.status === 'PAID').length,
        pending: invoices.filter((i) => i.status === 'PENDING').length,
        overdue: invoices.filter((i) => i.status === 'OVERDUE').length,
        totalRevenue: invoices
            .filter((i) => i.status === 'PAID')
            .reduce((sum, i) => sum + i.total, 0),
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Facturas</h1>
                    <p className="text-gray-600">Gestiona tus facturas y pagos</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={exportToCSV}>
                        <Download size={20} className="inline mr-2" />
                        Exportar CSV
                    </Button>
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => router.push('/facturas/nueva')}
                    >
                        <Plus size={20} className="inline mr-2" />
                        Nueva Factura
                    </Button>
                </div>
            </div>

            {/* Alert */}
            {alert.show && (
                <Alert
                    variant={alert.variant}
                    onClose={() => setAlert({ ...alert, show: false })}
                >
                    {alert.message}
                </Alert>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                    <h3 className="text-gray-600 text-sm mb-1">Total Facturas</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                </Card>
                <Card>
                    <h3 className="text-gray-600 text-sm mb-1">Pagadas</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.paid}</p>
                </Card>
                <Card>
                    <h3 className="text-gray-600 text-sm mb-1">Pendientes</h3>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </Card>
                <Card>
                    <h3 className="text-gray-600 text-sm mb-1">Vencidas</h3>
                    <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
                </Card>
                <Card>
                    <h3 className="text-gray-600 text-sm mb-1">Ingresos Totales</h3>
                    <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(stats.totalRevenue)}
                    </p>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <div className="flex items-center gap-4">
                    <label className="font-semibold text-gray-700">Filtrar por estado:</label>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        options={[
                            { value: '', label: 'Todas' },
                            { value: 'PAID', label: 'Pagadas' },
                            { value: 'PENDING', label: 'Pendientes' },
                            { value: 'OVERDUE', label: 'Vencidas' },
                        ]}
                        className="max-w-xs"
                    />
                    {statusFilter && (
                        <Button variant="ghost" size="sm" onClick={() => setStatusFilter('')}>
                            Limpiar filtro
                        </Button>
                    )}
                </div>
            </Card>

            {/* Invoices List */}
            {filteredInvoices.length === 0 ? (
                <Card className="text-center py-12">
                    <div className="text-6xl mb-4">📄</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {statusFilter ? 'No hay facturas con este estado' : 'No hay facturas todavía'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {statusFilter
                            ? 'Intenta con otro filtro'
                            : '¡Crea tu primera factura para empezar!'}
                    </p>
                    {!statusFilter && (
                        <Button
                            variant="primary"
                            onClick={() => router.push('/facturas/nueva')}
                        >
                            Crear Primera Factura
                        </Button>
                    )}
                </Card>
            ) : (
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                                        Número
                                    </th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                                        Cliente
                                    </th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                                        Fecha
                                    </th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                                        Estado
                                    </th>
                                    <th className="text-right py-4 px-4 font-semibold text-gray-700">
                                        Total
                                    </th>
                                    <th className="text-center py-4 px-4 font-semibold text-gray-700">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInvoices.map((invoice) => {
                                    const statusInfo = getInvoiceStatusInfo(invoice.status)
                                    return (
                                        <tr
                                            key={invoice.id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <FileText size={18} className="text-gray-400" />
                                                    <span className="font-semibold text-gray-800">
                                                        {invoice.invoiceNumber}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {invoice.client.name}
                                                    </p>
                                                    {invoice.client.company && (
                                                        <p className="text-sm text-gray-500">
                                                            {invoice.client.company}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-gray-600">
                                                {formatDateShort(invoice.date)}
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge variant={statusInfo.variant}>
                                                    {statusInfo.label}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4 text-right font-bold text-gray-800">
                                                {formatCurrency(invoice.total)}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            router.push(`/facturas/${invoice.id}`)
                                                        }
                                                    >
                                                        <Edit2 size={16} />
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() =>
                                                            setDeleteModal({ open: true, invoice })
                                                        }
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, invoice: null })}
                title="Eliminar Factura"
                footer={
                    <>
                        <Button variant="danger" onClick={handleDelete}>
                            Eliminar
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setDeleteModal({ open: false, invoice: null })}
                        >
                            Cancelar
                        </Button>
                    </>
                }
            >
                <p>
                    ¿Estás seguro de que deseas eliminar la factura{' '}
                    <strong>{deleteModal.invoice?.invoiceNumber}</strong>?
                </p>
                <p className="text-red-600 mt-2">Esta acción no se puede deshacer.</p>
            </Modal>
        </div>
    )
}

