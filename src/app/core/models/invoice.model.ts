// invoice.model.ts
export enum InvoiceStatus {
    ISSUED = 'issued',
    PAID = 'paid',
    OVERDUE = 'overdue'
}

export interface InvoiceItem {
    type: 'service' | 'part';
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface Invoice {
    _id?: string;
    appointmentId: string;
    clientId: string;
    invoiceNumber: string;
    items: InvoiceItem[];
    subtotal: number;
    taxRate: number;
    totalAmount: number;
    status: InvoiceStatus;
    issueDate?: Date;
    dueDate?: Date;
}
