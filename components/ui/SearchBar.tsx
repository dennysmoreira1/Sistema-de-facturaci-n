'use client'

interface SearchBarProps {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    className?: string
}

export function SearchBar({
    value,
    onChange,
    placeholder = 'Buscar...',
    className = '',
}: SearchBarProps) {
    return (
        <div className={`relative max-w-md ${className}`}>
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                🔍
            </span>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="
          w-full pl-12 pr-12 py-3
          border-2 border-gray-300
          focus:border-blue-500 focus:ring-4 focus:ring-blue-200
          rounded-full
          transition-all duration-200
          outline-none
        "
            />
            {value && (
                <button
                    onClick={() => onChange({ target: { value: '' } } as any)}
                    className="
            absolute right-4 top-1/2 transform -translate-y-1/2
            text-gray-400 hover:text-gray-600
            text-xl
            transition-colors
          "
                >
                    ✕
                </button>
            )}
        </div>
    )
}

