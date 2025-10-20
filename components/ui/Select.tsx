'use client'

interface SelectProps {
    value: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    options: { value: string; label: string }[]
    placeholder?: string
    className?: string
    required?: boolean
    disabled?: boolean
}

export function Select({
    value,
    onChange,
    options,
    placeholder,
    className = '',
    required = false,
    disabled = false,
}: SelectProps) {
    return (
        <select
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`
        w-full px-4 py-3
        border-2 border-gray-300
        focus:border-blue-500 focus:ring-4 focus:ring-blue-200
        rounded-lg
        transition-all duration-200
        outline-none
        bg-white
        cursor-pointer
        disabled:bg-gray-100 disabled:cursor-not-allowed
        ${className}
      `}
        >
            {placeholder && (
                <option value="" disabled>
                    {placeholder}
                </option>
            )}
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
}

