'use client'

interface ButtonProps {
    children: React.ReactNode
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    onClick?: () => void
    disabled?: boolean
    className?: string
    type?: 'button' | 'submit' | 'reset'
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    disabled = false,
    className = '',
    type = 'button',
}: ButtonProps) {
    const baseClasses =
        'font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200'

    const variants = {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white',
        secondary: 'bg-purple-500 hover:bg-purple-600 text-white',
        danger: 'bg-red-500 hover:bg-red-600 text-white',
        success: 'bg-green-500 hover:bg-green-600 text-white',
        outline:
            'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 shadow-none',
    }

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    }

    const disabledClasses = disabled
        ? 'opacity-50 cursor-not-allowed hover:scale-100'
        : ''

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
        >
            {children}
        </button>
    )
}

