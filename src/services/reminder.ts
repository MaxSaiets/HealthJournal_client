import api from './api';
import type { 
    Reminder, 
    CreateReminderRequest, 
    UpdateReminderRequest 
} from '../types/reminder';

export const reminderService = {
    async getAll(active?: boolean): Promise<Reminder[]> {
        const params = active !== undefined ? { active: active.toString() } : {};
        const response = await api.get('/reminders', { params });
        return response.data;
    },

    async getOne(id: string): Promise<Reminder> {
        const response = await api.get(`/reminders/${id}`);
        return response.data;
    },

    async getToday(): Promise<Reminder[]> {
        const response = await api.get('/reminders/today/list');
        return response.data;
    },

    async create(data: CreateReminderRequest): Promise<Reminder> {
        const response = await api.post('/reminders', data);
        return response.data;
    },

    async update(id: string, data: UpdateReminderRequest): Promise<Reminder> {
        const response = await api.put(`/reminders/${id}`, data);
        return response.data;
    },

    async toggleActive(id: string): Promise<Reminder> {
        const response = await api.patch(`/reminders/${id}/toggle`);
        return response.data;
    },

    async delete(id: string): Promise<{ message: string }> {
        const response = await api.delete(`/reminders/${id}`);
        return response.data;
    }
}; 