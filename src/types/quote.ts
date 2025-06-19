export interface Quote {
    id: string;
    text: string;
    author: string;
    category: string;
    createdAt: string;
    updatedAt: string;
}

export interface QuoteResponse {
    quotes: Quote[];
    totalPages: number;
    currentPage: number;
    totalQuotes: number;
}

export interface QuoteFilters {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
    mood?: number;
}

export interface CreateQuoteData {
    text: string;
    author?: string;
    category?: string;
}

export interface UpdateQuoteData {
    text?: string;
    author?: string;
    category?: string;
}

export interface QuoteCategory {
    name: string;
    label: string;
    color: string;
}

export const QUOTE_CATEGORIES: QuoteCategory[] = [
    { name: 'motivation', label: 'Мотивація', color: '#3B82F6' },
    { name: 'health', label: 'Здоров\'я', color: '#10B981' },
    { name: 'success', label: 'Успіх', color: '#F59E0B' },
    { name: 'inspiration', label: 'Натхнення', color: '#8B5CF6' },
    { name: 'wisdom', label: 'Мудрість', color: '#6B7280' },
    { name: 'general', label: 'Загальні', color: '#9CA3AF' }
];

export const MOOD_CATEGORIES = {
    1: ['motivation', 'inspiration', 'hope'],
    2: ['motivation', 'encouragement'],
    3: ['balance', 'wisdom'],
    4: ['success', 'achievement'],
    5: ['celebration', 'joy', 'success']
}; 