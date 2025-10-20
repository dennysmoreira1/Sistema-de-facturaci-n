'use client'

interface BadgeProps {
    children: React.ReactNode
    variant?: 'default' | 'success' | 'danger' | 'warning' | 'info'
    dot?: boolean
    className?: string
}

export function Badge({
    children,
    variant = 'default',
    dot = false,
    className = '',
}: BadgeProps) {
    const variants = {
        default: 'bg-blue-100 text-blue-700',
        success: 'bg-green-100 text-green-700',
        danger: 'bg-red-100 text-red-700',
        warning: 'bg-yellow-100 text-yellow-700',
        info: 'bg-indigo-100 text-indigo-700',
    }

    const dotColors = {
        default: 'bg-blue-500',
        success: 'bg-green-500',
        danger: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-indigo-500',
    }

    return (
        <span
            className={`
      inline-flex items-center gap-2
      px-3 py-1
      ${variants[variant]}
      text-sm font-semibold
      rounded-full
      ${className}
    `}
        >
            {dot && <span className={`w-2 h-2 rounded-full ${dotColors[variant]}`}></span>}
            {children}
        </span>
    )
}

