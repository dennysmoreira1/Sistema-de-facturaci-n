'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { ArrowLeft } from 'lucide-react'

interface Client {
    id: string
    name: string
    email: string
    company?: string
    phone?: string
    address?: string
}

export default function EditClientePage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        address: '',
    })

    useEffect(() => {
        fetchClient()
    }, [params.id])

    const fetchClient = async () => {
        try {
            const response = await fetch(`/api/clients/${params.id}`)
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Cliente no encontrado')
            }

            setFormData({
                name: data.name,
                email: data.email,
                company: data.company || '',
                phone: data.phone || '',
                address: data.address || '',
            })
        } catch (error: any) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsSaving(true)

        try {
            const response = await fetch(`/api/clients/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al actualizar cliente')
            }

            setSuccess(true)
            setTimeout(() => {
                router.push('/clientes')
            }, 1500)
        } catch (error: any) {
            setError(error.message)
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Editar Cliente</h1>
                    <p className="text-gray-600">Modifica la información del cliente</p>
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
                    ¡Cliente actualizado exitosamente! Redirigiendo...
                </Alert>
            )}

            {/* Form */}
            <Card className="animate-scale-in">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nombre Completo *
                            </label>
                            <Input
                                name="name"
                                type="text"
                                placeholder="Ej: Juan Pérez García"
                                value={formData.name}
                                onChange={handleChange}
                                icon="👤"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email *
                            </label>
                            <Input
                                name="email"
                                type="email"
                                placeholder="Ej: juan.perez@empresa.com.ec"
                                value={formData.email}
                                onChange={handleChange}
                                icon="📧"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Empresa
                            </label>
                            <Input
                                name="company"
                                type="text"
                                placeholder="Ej: Tech Solutions Ecuador S.A."
                                value={formData.company}
                                onChange={handleChange}
                                icon="🏢"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Teléfono
                            </label>
                            <Input
                                name="phone"
                                type="tel"
                                placeholder="Ej: +593 98 765 4321"
                                value={formData.phone}
                                onChange={handleChange}
                                icon="📱"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Dirección
                            </label>
                            <Input
                                name="address"
                                type="text"
                                placeholder="Ej: Av. Amazonas N24-155, Quito"
                                value={formData.address}
                                onChange={handleChange}
                                icon="📍"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-1"
                            disabled={isSaving || success}
                        >
                            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => router.back()}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}

