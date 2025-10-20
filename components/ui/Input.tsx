'use client'

interface InputProps {
    type?: string
    placeholder?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    icon?: string
    error?: string
    className?: string
    required?: boolean
    disabled?: boolean
}

export function Input({
    type = 'text',
    placeholder = '',
    value,
    onChange,
    icon,
    error,
    className = '',
    required = false,
    disabled = false,
}: InputProps) {
    return (
        <div className="w-full">
            <div className="relative">
                {icon && (
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                        {icon}
                    </span>
                )}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    className={`
            w-full 
            ${icon ? 'pl-12 pr-4' : 'px-4'} 
            py-3
            border-2 
            ${error ? 'border-red-500' : 'border-gray-300'}
            focus:border-blue-500 
            focus:ring-4 
            ${error ? 'focus:ring-red-200' : 'focus:ring-blue-200'}
            rounded-lg
            transition-all duration-200
            outline-none
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${className}
          `}
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    )
}

