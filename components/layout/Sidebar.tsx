'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    FileText,
    LogOut
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const menuItems = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Clientes',
        href: '/clientes',
        icon: Users,
    },
    {
        name: 'Facturas',
        href: '/facturas',
        icon: FileText,
    },
]

export function Sidebar() {
    const pathname = usePathname()

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' })
    }

    return (
        <aside className="w-64 bg-white shadow-xl h-screen sticky top-0 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="text-3xl">📊</div>
                    <div>
                        <h1 className="font-bold text-xl text-gray-800">FacturaFácil</h1>
                        <p className="text-xs text-gray-500">Sistema de Gestión</p>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-200
                ${isActive
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }
              `}
                        >
                            <Icon size={20} />
                            <span className="font-semibold">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="
            w-full flex items-center gap-3 px-4 py-3 rounded-xl
            text-red-600 hover:bg-red-50
            transition-all duration-200
            font-semibold
          "
                >
                    <LogOut size={20} />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    )
}

