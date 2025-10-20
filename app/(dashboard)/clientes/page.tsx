'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { SearchBar } from '@/components/ui/SearchBar'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { Plus, Edit2, Trash2, Mail, Phone, Building } from 'lucide-react'

interface Client {
    id: string
    name: string
    email: string
    company?: string
    phone?: string
    address?: string
    _count: {
        invoices: number
    }
}

export default function ClientesPage() {
    const router = useRouter()
    const [clients, setClients] = useState<Client[]>([])
    const [filteredClients, setFilteredClients] = useState<Client[]>([])
    const [search, setSearch] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; client: Client | null }>({
        open: false,
        client: null,
    })
    const [alert, setAlert] = useState<{ show: boolean; message: string; variant: 'success' | 'danger' }>({
        show: false,
        message: '',
        variant: 'success',
    })

    useEffect(() => {
        fetchClients()
    }, [])

    useEffect(() => {
        const filtered = clients.filter(
            (client) =>
                client.name.toLowerCase().includes(search.toLowerCase()) ||
                client.email.toLowerCase().includes(search.toLowerCase()) ||
                client.company?.toLowerCase().includes(search.toLowerCase())
        )
        setFilteredClients(filtered)
    }, [search, clients])

    const fetchClients = async () => {
        try {
            const response = await fetch('/api/clients')
            const data = await response.json()
            setClients(data)
            setFilteredClients(data)
        } catch (error) {
            showAlert('Error al cargar clientes', 'danger')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteModal.client) return

        try {
            const response = await fetch(`/api/clients/${deleteModal.client.id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error)
            }

            showAlert('Cliente eliminado exitosamente', 'success')
            fetchClients()
        } catch (error: any) {
            showAlert(error.message || 'Error al eliminar cliente', 'danger')
        } finally {
            setDeleteModal({ open: false, client: null })
        }
    }

    const showAlert = (message: string, variant: 'success' | 'danger') => {
        setAlert({ show: true, message, variant })
        setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 5000)
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Clientes</h1>
                    <p className="text-gray-600">Gestiona tus clientes y contactos</p>
                </div>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={() => router.push('/clientes/nuevo')}
                >
                    <Plus size={20} className="inline mr-2" />
                    Nuevo Cliente
                </Button>
            </div>

            {/* Alert */}
            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })}>
                    {alert.message}
                </Alert>
            )}

            {/* Search */}
            <Card>
                <SearchBar
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por nombre, email o empresa..."
                    className="w-full max-w-full"
                />
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <h3 className="text-gray-600 text-sm mb-1">Total Clientes</h3>
                    <p className="text-3xl font-bold text-gray-800">{clients.length}</p>
                </Card>
                <Card>
                    <h3 className="text-gray-600 text-sm mb-1">Resultados Filtrados</h3>
                    <p className="text-3xl font-bold text-gray-800">{filteredClients.length}</p>
                </Card>
                <Card>
                    <h3 className="text-gray-600 text-sm mb-1">Con Facturas</h3>
                    <p className="text-3xl font-bold text-gray-800">
                        {clients.filter((c) => c._count.invoices > 0).length}
                    </p>
                </Card>
            </div>

            {/* Clients Grid */}
            {filteredClients.length === 0 ? (
                <Card className="text-center py-12">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {search ? 'No se encontraron clientes' : 'No hay clientes todavía'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {search
                            ? 'Intenta con otro término de búsqueda'
                            : '¡Crea tu primer cliente para empezar!'}
                    </p>
                    {!search && (
                        <Button variant="primary" onClick={() => router.push('/clientes/nuevo')}>
                            Crear Primer Cliente
                        </Button>
                    )}
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClients.map((client, index) => (
                        <Card
                            key={client.id}
                            hover
                            className={`animate-fade-in-up delay-${index % 3 * 100}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                                        {client.name}
                                    </h3>
                                    {client.company && (
                                        <p className="text-sm text-gray-600 flex items-center gap-1">
                                            <Building size={14} />
                                            {client.company}
                                        </p>
                                    )}
                                </div>
                                <Badge variant="info">{client._count.invoices} facturas</Badge>
                            </div>

                            <div className="space-y-2 mb-4">
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                    <Mail size={14} />
                                    {client.email}
                                </p>
                                {client.phone && (
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <Phone size={14} />
                                        {client.phone}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => router.push(`/clientes/${client.id}`)}
                                >
                                    <Edit2 size={16} className="inline mr-1" />
                                    Editar
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => setDeleteModal({ open: true, client })}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, client: null })}
                title="Eliminar Cliente"
                footer={
                    <>
                        <Button variant="danger" onClick={handleDelete}>
                            Eliminar
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setDeleteModal({ open: false, client: null })}
                        >
                            Cancelar
                        </Button>
                    </>
                }
            >
                <p>
                    ¿Estás seguro de que deseas eliminar a{' '}
                    <strong>{deleteModal.client?.name}</strong>?
                </p>
                <p className="text-red-600 mt-2">
                    Esta acción también eliminará todas las facturas asociadas.
                </p>
            </Modal>
        </div>
    )
}

