'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError('Credenciales inválidas')
                return
            }

            router.push('/dashboard')
            router.refresh()
        } catch (error) {
            setError('Error al iniciar sesión')
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
                            Iniciar Sesión
                        </h1>
                        <p className="text-gray-600">
                            Sistema de Facturación y CRM
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="danger" className="mb-6 animate-shake">
                            {error}
                        </Alert>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-4">
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

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>
                    </form>

                    {/* Credenciales Demo */}
                    <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                        <p className="text-sm text-blue-800 font-semibold mb-2">
                            🔑 Credenciales de prueba:
                        </p>
                        <p className="text-sm text-blue-700">
                            <strong>Email:</strong> demo@facturacion.com<br />
                            <strong>Password:</strong> demo123
                        </p>
                    </div>

                    {/* Link a Registro */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            ¿No tienes cuenta?{' '}
                            <Link
                                href="/register"
                                className="text-blue-500 hover:text-blue-600 font-semibold transition-colors"
                            >
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

