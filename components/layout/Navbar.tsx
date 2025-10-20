'use client'

import { useSession } from 'next-auth/react'
import { Bell, User } from 'lucide-react'

export function Navbar() {
    const { data: session } = useSession()

    return (
        <header className="bg-white shadow-md p-4 mb-6 rounded-2xl">
            <div className="flex items-center justify-between">
                {/* Welcome Message */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        ¡Hola, {session?.user?.name || 'Usuario'}! 👋
                    </h2>
                    <p className="text-gray-600">Bienvenido a tu panel de control</p>
                </div>

                {/* User Actions */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="
            relative p-3 rounded-full bg-gray-100 hover:bg-gray-200 
            transition-all duration-200
          ">
                        <Bell size={20} className="text-gray-600" />
                        <span className="
              absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full
            "></span>
                    </button>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-full">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold text-gray-800">{session?.user?.name}</p>
                            <p className="text-gray-500">{session?.user?.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

