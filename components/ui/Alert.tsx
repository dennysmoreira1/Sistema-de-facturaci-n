'use client'

interface AlertProps {
    children: React.ReactNode
    variant?: 'success' | 'danger' | 'warning' | 'info'
    onClose?: () => void
    className?: string
}

export function Alert({
    children,
    variant = 'info',
    onClose,
    className = '',
}: AlertProps) {
    const variants = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-300',
            text: 'text-green-800',
            icon: '✅',
        },
        danger: {
            bg: 'bg-red-50',
            border: 'border-red-300',
            text: 'text-red-800',
            icon: '❌',
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-300',
            text: 'text-yellow-800',
            icon: '⚠️',
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-300',
            text: 'text-blue-800',
            icon: 'ℹ️',
        },
    }

    const v = variants[variant]

    return (
        <div
            className={`
      p-4
      ${v.bg}
      border-2 ${v.border}
      rounded-xl
      flex items-start gap-3
      ${className}
    `}
        >
            <span className="text-2xl">{v.icon}</span>
            <div className="flex-1">
                <p className={`font-semibold ${v.text}`}>{children}</p>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    ✕
                </button>
            )}
        </div>
    )
}

