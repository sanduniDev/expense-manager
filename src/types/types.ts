export interface CreateTransaction {
    amount: number;
    type: string;
    category: string;
    description?: string;
    date: string;
}
export interface Budget {
    id: string
    category: string
    amount: number
    period: string
    monthYear: string
}
