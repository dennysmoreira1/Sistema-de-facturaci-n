'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Alert } from '@/components/ui/Alert'
import { generateInvoiceNumber } from '@/lib/utils'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

interface InvoiceItem {
    description: string
    quantity: number
    unitPrice: number
    total: number
}

interface Client {
    id: string
    name: string
    company?: string
}

export default function NuevaFacturaPage() {
    const router = useRouter()
    const [clients, setClients] = useState<Client[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        clientId: '',
        invoiceNumber: generateInvoiceNumber(),
        date: new Date().toISOString().split('T')[0],
        dueDate: '',
        status: 'PENDING',
        taxRate: 15,
        notes: '',
    })

    const [items, setItems] = useState<InvoiceItem[]>([
        { description: '', quantity: 1, unitPrice: 0, total: 0 },
    ])

    useEffect(() => {
        fetchClients()
    }, [])

    useEffect(() => {
        // Recalcular totales cuando cambian los items o el tax rate
        const subtotal = items.reduce((sum, item) => sum + item.total, 0)
        const taxAmount = (subtotal * formData.taxRate) / 100
        const total = subtotal + taxAmount
    }, [items, formData.taxRate])

    const fetchClients = async () => {
        try {
            const response = await fetch('/api/clients')
            const data = await response.json()
            setClients(data)
        } catch (error) {
            setError('Error al cargar clientes')
        }
    }

    const handleItemChange = (
        index: number,
        field: keyof InvoiceItem,
        value: string | number
    ) => {
        const newItems = [...items]
        newItems[index] = { ...newItems[index], [field]: value }

        // Recalcular total del item
        if (field === 'quantity' || field === 'unitPrice') {
            newItems[index].total =
                newItems[index].quantity * newItems[index].unitPrice
        }

        setItems(newItems)
    }

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, unitPrice: 0, total: 0 }])
    }

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index))
        }
    }

    const calculateTotals = () => {
        const subtotal = items.reduce((sum, item) => sum + item.total, 0)
        const taxAmount = (subtotal * formData.taxRate) / 100
        const total = subtotal + taxAmount
        return { subtotal, taxAmount, total }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        const { subtotal, taxAmount, total } = calculateTotals()

        try {
            const response = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    subtotal,
                    taxAmount,
                    total,
                    items,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear factura')
            }

            setSuccess(true)
            setTimeout(() => {
                router.push('/facturas')
            }, 1500)
        } catch (error: any) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const { subtotal, taxAmount, total } = calculateTotals()

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Nueva Factura</h1>
                    <p className="text-gray-600">Crea una nueva factura para un cliente</p>
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <Alert variant="danger" onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert variant="success">
                    ¡Factura creada exitosamente! Redirigiendo...
                </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información Básica */}
                <Card className="animate-scale-in">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Información Básica
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Cliente *
                            </label>
                            <Select
                                value={formData.clientId}
                                onChange={(e) =>
                                    setFormData({ ...formData, clientId: e.target.value })
                                }
                                options={clients.map((c) => ({
                                    value: c.id,
                                    label: `${c.name}${c.company ? ` - ${c.company}` : ''}`,
                                }))}
                                placeholder="Selecciona un cliente"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Número de Factura *
                            </label>
                            <Input
                                type="text"
                                value={formData.invoiceNumber}
                                onChange={(e) =>
                                    setFormData({ ...formData, invoiceNumber: e.target.value })
                                }
                                icon="📄"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Fecha *
                            </label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) =>
                                    setFormData({ ...formData, date: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Fecha de Vencimiento
                            </label>
                            <Input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) =>
                                    setFormData({ ...formData, dueDate: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Estado *
                            </label>
                            <Select
                                value={formData.status}
                                onChange={(e) =>
                                    setFormData({ ...formData, status: e.target.value })
                                }
                                options={[
                                    { value: 'PENDING', label: 'Pendiente' },
                                    { value: 'PAID', label: 'Pagada' },
                                    { value: 'OVERDUE', label: 'Vencida' },
                                    { value: 'CANCELLED', label: 'Cancelada' },
                                ]}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tasa de IVA (%) *
                            </label>
                            <Input
                                type="number"
                                value={formData.taxRate.toString()}
                                onChange={(e) =>
                                    setFormData({ ...formData, taxRate: Number(e.target.value) })
                                }
                                icon="💰"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Notas
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) =>
                                setFormData({ ...formData, notes: e.target.value })
                            }
                            placeholder="Notas adicionales..."
                            rows={3}
                            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 rounded-lg transition-all duration-200 outline-none resize-none"
                        />
                    </div>
                </Card>

                {/* Items */}
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Items</h3>
                        <Button type="button" variant="outline" size="sm" onClick={addItem}>
                            <Plus size={16} className="inline mr-1" />
                            Agregar Item
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-12 gap-4 items-end p-4 bg-gray-50 rounded-xl"
                            >
                                <div className="col-span-5">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Descripción *
                                    </label>
                                    <Input
                                        type="text"
                                        value={item.description}
                                        onChange={(e) =>
                                            handleItemChange(index, 'description', e.target.value)
                                        }
                                        placeholder="Descripción del producto/servicio"
                                        required
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Cantidad *
                                    </label>
                                    <Input
                                        type="number"
                                        value={item.quantity.toString()}
                                        onChange={(e) =>
                                            handleItemChange(index, 'quantity', Number(e.target.value))
                                        }
                                        min="0.01"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Precio Unit.
                                    </label>
                                    <Input
                                        type="number"
                                        value={item.unitPrice.toString()}
                                        onChange={(e) =>
                                            handleItemChange(index, 'unitPrice', Number(e.target.value))
                                        }
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Total
                                    </label>
                                    <div className="px-4 py-3 bg-white border-2 border-gray-200 rounded-lg font-bold text-gray-800">
                                        ${item.total.toFixed(2)}
                                    </div>
                                </div>

                                <div className="col-span-1">
                                    <Button
                                        type="button"
                                        variant="danger"
                                        size="sm"
                                        onClick={() => removeItem(index)}
                                        disabled={items.length === 1}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Totales */}
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="space-y-3">
                        <div className="flex justify-between text-lg">
                            <span className="font-semibold text-gray-700">Subtotal:</span>
                            <span className="font-bold text-gray-800">
                                ${subtotal.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between text-lg">
                            <span className="font-semibold text-gray-700">
                                IVA ({formData.taxRate}%):
                            </span>
                            <span className="font-bold text-gray-800">
                                ${taxAmount.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between text-2xl pt-3 border-t-2 border-blue-200">
                            <span className="font-bold text-gray-800">Total:</span>
                            <span className="font-bold text-blue-600">
                                ${total.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Acciones */}
                <div className="flex gap-4">
                    <Button
                        type="submit"
                        variant="primary"
                        className="flex-1"
                        disabled={isLoading || success}
                    >
                        {isLoading ? 'Creando...' : 'Crear Factura'}
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    )
}

