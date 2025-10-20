import clsx, { type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs)
}

export function formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`
}

export function formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const months = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ]
    const day = dateObj.getDate()
    const month = months[dateObj.getMonth()]
    const year = dateObj.getFullYear()
    return `${day} de ${month} de ${year}`
}

export function formatDateShort(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const day = String(dateObj.getDate()).padStart(2, '0')
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const year = dateObj.getFullYear()
    return `${day}/${month}/${year}`
}

export function getInvoiceStatusInfo(status: string): {
    label: string
    variant: 'success' | 'warning' | 'danger' | 'default'
} {
    switch (status) {
        case 'PAID':
            return { label: 'Pagada', variant: 'success' }
        case 'PENDING':
            return { label: 'Pendiente', variant: 'warning' }
        case 'OVERDUE':
            return { label: 'Vencida', variant: 'danger' }
        case 'CANCELLED':
            return { label: 'Cancelada', variant: 'default' }
        default:
            return { label: 'Desconocido', variant: 'default' }
    }
}

export function generateInvoiceNumber(): string {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `INV-${year}-${random}`
}

