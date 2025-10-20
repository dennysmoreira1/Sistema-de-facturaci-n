'use client'

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
    const sizes = {
        sm: 'h-8 w-8 border-2',
        md: 'h-16 w-16 border-4',
        lg: 'h-24 w-24 border-4',
    }

    return (
        <div
            className={`
      animate-spin 
      rounded-full 
      ${sizes[size]} 
      border-b-blue-500 
      border-t-transparent
      border-l-transparent
      border-r-transparent
      ${className}
    `}
        ></div>
    )
}

