import api from './api';
import type { 
    Reminder, 
    CreateReminderRequest, 
    UpdateReminderRequest 
} from '../types/reminder';

export const reminderService = {
    // Отримати всі нагадування
    async getAll(active?: boolean): Promise<Reminder[]> {
        const params = active !== undefined ? { active: active.toString() } : {};
        const response = await api.get('/reminders', { params });
        return response.data;
    },

    // Отримати конкретне нагадування
    async getOne(id: string): Promise<Reminder> {
        const response = await api.get(`/reminders/${id}`);
        return response.data;
    },

    // Отримати нагадування на сьогодні
    async getToday(): Promise<Reminder[]> {
        const response = await api.get('/reminders/today/list');
        return response.data;
    },

    // Створити нагадування
    async create(data: CreateReminderRequest): Promise<Reminder> {
        const response = await api.post('/reminders', data);
        return response.data;
    },

    // Оновити нагадування
    async update(id: string, data: UpdateReminderRequest): Promise<Reminder> {
        const response = await api.put(`/reminders/${id}`, data);
        return response.data;
    },

    // Перемкнути активність нагадування
    async toggleActive(id: string): Promise<Reminder> {
        const response = await api.patch(`/reminders/${id}/toggle`);
        return response.data;
    },

    // Видалити нагадування
    async delete(id: string): Promise<{ message: string }> {
        const response = await api.delete(`/reminders/${id}`);
        return response.data;
    }
}; 