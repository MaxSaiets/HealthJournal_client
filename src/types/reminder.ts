export interface Reminder {
    id: string;
    userId: string;
    title: string;
    description?: string;
    time: string; // HH:MM format
    isActive: boolean;
    repeatType: 'none' | 'daily' | 'weekly' | 'monthly';
    daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, etc.
    date?: string; // YYYY-MM-DD, тільки для repeatType: 'none'
    createdAt: string;
    updatedAt: string;
}

export interface CreateReminderRequest {
    title: string;
    description?: string;
    time: string;
    repeatType?: 'none' | 'daily' | 'weekly' | 'monthly';
    daysOfWeek?: number[];
    date?: string;
}

export interface UpdateReminderRequest {
    title?: string;
    description?: string;
    time?: string;
    isActive?: boolean;
    repeatType?: 'none' | 'daily' | 'weekly' | 'monthly';
    daysOfWeek?: number[];
    date?: string;
}

export interface ReminderFormData {
    title: string;
    description: string;
    time: string;
    repeatType: 'none' | 'daily' | 'weekly' | 'monthly';
    daysOfWeek: number[];
    date?: string;
}

export const REPEAT_TYPES = {
    none: 'Без повторення',
    daily: 'Щодня',
    weekly: 'Щотижня',
    monthly: 'Щомісяця'
} as const;

export const DAYS_OF_WEEK = [
    { value: 0, label: 'Неділя' },
    { value: 1, label: 'Понеділок' },
    { value: 2, label: 'Вівторок' },
    { value: 3, label: 'Середа' },
    { value: 4, label: 'Четвер' },
    { value: 5, label: 'П\'ятниця' },
    { value: 6, label: 'Субота' }
] as const; 