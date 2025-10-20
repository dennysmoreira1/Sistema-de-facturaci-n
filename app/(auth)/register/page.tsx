'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'

export default function RegisterPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess(false)

        // Validaciones
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al registrar')
            }

            setSuccess(true)
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        } catch (error: any) {
            setError(error.message || 'Error al registrar usuario')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="card animate-scale-in">
                    {/* Logo y Título */}
                    <div className="text-center mb-8">
                        <div className="text-5xl mb-4">📊</div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Crear Cuenta
                        </h1>
                        <p className="text-gray-600">
                            Únete al Sistema de Facturación
                        </p>
                    </div>

                    {/* Alerts */}
                    {error && (
                        <Alert variant="danger" className="mb-6 animate-shake">
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert variant="success" className="mb-6 animate-bounce-in">
                            ¡Cuenta creada exitosamente! Redirigiendo...
                        </Alert>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="text"
                            placeholder="Nombre completo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            icon="👤"
                            required
                        />

                        <Input
                            type="email"
                            placeholder="correo@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon="📧"
                            required
                        />

                        <Input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon="🔒"
                            required
                        />

                        <Input
                            type="password"
                            placeholder="Confirmar contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            icon="🔒"
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={isLoading || success}
                        >
                            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </Button>
                    </form>

                    {/* Link a Login */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            ¿Ya tienes cuenta?{' '}
                            <Link
                                href="/login"
                                className="text-blue-500 hover:text-blue-600 font-semibold transition-colors"
                            >
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

