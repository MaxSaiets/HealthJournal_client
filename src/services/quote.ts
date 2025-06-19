import api from './api';
import type { 
    Quote, 
    QuoteResponse, 
    QuoteFilters, 
    CreateQuoteData, 
    UpdateQuoteData 
} from '../types/quote';

export const quoteService = {
    // Отримання всіх цитат з фільтрами
    async getAll(filters: QuoteFilters = {}): Promise<QuoteResponse> {
        const params = new URLSearchParams();
        
        if (filters.category) params.append('category', filters.category);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.mood) params.append('mood', filters.mood.toString());

        const response = await api.get(`/quotes?${params.toString()}`);
        return response.data;
    },

    // Отримання конкретної цитати
    async getOne(id: string): Promise<Quote> {
        const response = await api.get(`/quotes/${id}`);
        return response.data;
    },

    // Отримання випадкової цитати
    async getRandom(filters?: { category?: string; mood?: number }): Promise<Quote> {
        const params = new URLSearchParams();
        
        if (filters?.category) params.append('category', filters.category);
        if (filters?.mood) params.append('mood', filters.mood.toString());

        const response = await api.get(`/quotes/random/quote?${params.toString()}`);
        return response.data;
    },

    // Отримання цитати дня
    async getDaily(): Promise<Quote> {
        const response = await api.get('/quotes/daily/quote');
        return response.data;
    },

    // Отримання категорій
    async getCategories(): Promise<string[]> {
        const response = await api.get('/quotes/categories/list');
        return response.data;
    },

    // Створення цитати
    async create(data: CreateQuoteData): Promise<Quote> {
        const response = await api.post('/quotes', data);
        return response.data;
    },

    // Оновлення цитати
    async update(id: string, data: UpdateQuoteData): Promise<Quote> {
        const response = await api.put(`/quotes/${id}`, data);
        return response.data;
    },

    // Видалення цитати
    async delete(id: string): Promise<{ message: string }> {
        const response = await api.delete(`/quotes/${id}`);
        return response.data;
    }
}; 