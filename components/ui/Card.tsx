'use client'

interface CardProps {
    children: React.ReactNode
    hover?: boolean
    onClick?: () => void
    className?: string
}

export function Card({
    children,
    hover = false,
    onClick,
    className = '',
}: CardProps) {
    const hoverClasses = hover
        ? 'hover:shadow-2xl hover:-translate-y-2 cursor-pointer'
        : ''

    return (
        <div
            onClick={onClick}
            className={`
        p-6 
        bg-white 
        rounded-2xl 
        shadow-md 
        transform 
        transition-all duration-300 
        ${hoverClasses} 
        ${className}
      `}
        >
            {children}
        </div>
    )
}

