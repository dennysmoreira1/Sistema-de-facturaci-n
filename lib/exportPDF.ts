import jsPDF from 'jspdf'
import { formatCurrency, formatDate } from './utils'

interface InvoiceData {
    invoiceNumber: string
    date: string
    client: {
        name: string
        email: string
        company?: string
        phone?: string
        address?: string
    }
    items: {
        description: string
        quantity: number
        unitPrice: number
        total: number
    }[]
    subtotal: number
    taxRate: number
    taxAmount: number
    total: number
    notes?: string
    status: string
}

export function exportInvoiceToPDF(invoice: InvoiceData) {
    const doc = new jsPDF()

    // Configuración de colores
    const primaryColor: [number, number, number] = [37, 99, 235] // Azul
    const secondaryColor: [number, number, number] = [75, 85, 99] // Gris

    let yPosition = 20

    // Header - Título
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, 210, 40, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.text('FACTURA', 20, 25)

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`#${invoice.invoiceNumber}`, 20, 33)

    yPosition = 50

    // Información del Cliente
    doc.setTextColor(...secondaryColor)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('CLIENTE:', 20, yPosition)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    yPosition += 7
    doc.text(invoice.client.name, 20, yPosition)

    if (invoice.client.company) {
        yPosition += 6
        doc.text(invoice.client.company, 20, yPosition)
    }

    if (invoice.client.email) {
        yPosition += 6
        doc.text(invoice.client.email, 20, yPosition)
    }

    if (invoice.client.phone) {
        yPosition += 6
        doc.text(invoice.client.phone, 20, yPosition)
    }

    if (invoice.client.address) {
        yPosition += 6
        const addressLines = doc.splitTextToSize(invoice.client.address, 80)
        doc.text(addressLines, 20, yPosition)
        yPosition += (addressLines.length - 1) * 6
    }

    // Información de la Factura (derecha)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('FECHA:', 130, 50)
    doc.text('ESTADO:', 130, 57)

    doc.setFont('helvetica', 'normal')
    doc.text(formatDate(invoice.date), 160, 50)

    // Estado con color
    const statusColors: Record<string, [number, number, number]> = {
        PAID: [34, 197, 94], // Verde
        PENDING: [234, 179, 8], // Amarillo
        OVERDUE: [239, 68, 68], // Rojo
        CANCELLED: [156, 163, 175], // Gris
    }

    const statusLabels: Record<string, string> = {
        PAID: 'Pagada',
        PENDING: 'Pendiente',
        OVERDUE: 'Vencida',
        CANCELLED: 'Cancelada',
    }

    doc.setTextColor(...(statusColors[invoice.status] || statusColors.PENDING))
    doc.setFont('helvetica', 'bold')
    doc.text(statusLabels[invoice.status] || invoice.status, 160, 57)

    yPosition = Math.max(yPosition, 70) + 10

    // Tabla de Items
    doc.setTextColor(...secondaryColor)
    doc.setFillColor(241, 245, 249) // Gris claro
    doc.rect(20, yPosition, 170, 10, 'F')

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('DESCRIPCIÓN', 25, yPosition + 7)
    doc.text('CANT.', 120, yPosition + 7)
    doc.text('PRECIO', 140, yPosition + 7)
    doc.text('TOTAL', 165, yPosition + 7)

    yPosition += 15
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)

    invoice.items.forEach((item) => {
        // Verificar si necesitamos una nueva página
        if (yPosition > 250) {
            doc.addPage()
            yPosition = 20
        }

        const descriptionLines = doc.splitTextToSize(item.description, 90)
        doc.text(descriptionLines, 25, yPosition)
        doc.text(item.quantity.toString(), 125, yPosition, { align: 'right' })
        doc.text(formatCurrency(item.unitPrice), 155, yPosition, { align: 'right' })
        doc.text(formatCurrency(item.total), 185, yPosition, { align: 'right' })

        yPosition += Math.max(descriptionLines.length * 6, 8)
    })

    yPosition += 10

    // Totales
    doc.setDrawColor(229, 231, 235)
    doc.line(120, yPosition, 190, yPosition)
    yPosition += 10

    doc.setFont('helvetica', 'normal')
    doc.text('Subtotal:', 130, yPosition)
    doc.text(formatCurrency(invoice.subtotal), 185, yPosition, { align: 'right' })

    yPosition += 7
    doc.text(`Impuestos (${invoice.taxRate}%):`, 130, yPosition)
    doc.text(formatCurrency(invoice.taxAmount), 185, yPosition, { align: 'right' })

    yPosition += 10
    doc.setFillColor(...primaryColor)
    doc.rect(120, yPosition - 5, 70, 12, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('TOTAL:', 130, yPosition + 3)
    doc.text(formatCurrency(invoice.total), 185, yPosition + 3, { align: 'right' })

    // Notas
    if (invoice.notes) {
        yPosition += 20
        doc.setTextColor(...secondaryColor)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.text('NOTAS:', 20, yPosition)

        yPosition += 7
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        const notesLines = doc.splitTextToSize(invoice.notes, 170)
        doc.text(notesLines, 20, yPosition)
    }

    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setTextColor(156, 163, 175)
        doc.setFontSize(8)
        doc.text(
            `Página ${i} de ${pageCount}`,
            105,
            290,
            { align: 'center' }
        )
        doc.text(
            'Generado con FacturaFácil - Sistema de Gestión',
            105,
            285,
            { align: 'center' }
        )
    }

    // Guardar PDF
    doc.save(`Factura-${invoice.invoiceNumber}.pdf`)
}

