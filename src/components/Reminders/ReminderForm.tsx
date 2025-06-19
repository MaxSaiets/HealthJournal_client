import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { createReminder, updateReminder } from '../../store/reminder/reminderSlice';
import type { Reminder, ReminderFormData } from '../../types/reminder';
import { REPEAT_TYPES, DAYS_OF_WEEK } from '../../types/reminder';
import { useToast } from '../../ui/ToastProvider';

interface ReminderFormProps {
    reminder?: Reminder | null;
    onClose: () => void;
    onSuccess?: () => void;
}

const ReminderForm: React.FC<ReminderFormProps> = ({ 
    reminder, 
    onClose, 
    onSuccess 
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [formData, setFormData] = useState<ReminderFormData>({
        title: '',
        description: '',
        time: '09:00',
        repeatType: 'none',
        daysOfWeek: [],
        date: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const toast = useToast();

    useEffect(() => {
        if (reminder) {
            setFormData({
                title: reminder.title,
                description: reminder.description || '',
                time: reminder.time,
                repeatType: reminder.repeatType,
                daysOfWeek: reminder.daysOfWeek,
                date: reminder.date || ''
            });
        }
    }, [reminder]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Назва не може бути порожньою';
        }

        if (!formData.time) {
            newErrors.time = 'Оберіть час';
        }

        if (formData.repeatType === 'weekly' && formData.daysOfWeek.length === 0) {
            newErrors.daysOfWeek = 'Оберіть хоча б один день тижня';
        }

        if (formData.repeatType === 'monthly' && formData.daysOfWeek.length === 0) {
            newErrors.daysOfWeek = 'Оберіть хоча б один день місяця';
        }

        if (formData.repeatType === 'none' && !formData.date) {
            newErrors.date = 'Оберіть дату для одноразового нагадування';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            if (reminder) {
                await dispatch(updateReminder({ 
                    id: reminder.id, 
                    data: formData 
                })).unwrap();
                toast.success('Нагадування оновлено!');
            } else {
                await dispatch(createReminder(formData)).unwrap();
                toast.success('Нагадування створено!');
            }
            onSuccess?.();
            onClose();
        } catch (error: any) {
            toast.error('Помилка збереження нагадування');
            console.error('Error saving reminder:', error);
        }
    };

    const handleDayToggle = (dayValue: number) => {
        setFormData(prev => ({
            ...prev,
            daysOfWeek: prev.daysOfWeek.includes(dayValue)
                ? prev.daysOfWeek.filter(d => d !== dayValue)
                : [...prev.daysOfWeek, dayValue]
        }));
    };

    const handleRepeatTypeChange = (repeatType: 'none' | 'daily' | 'weekly' | 'monthly') => {
        setFormData(prev => ({
            ...prev,
            repeatType,
            daysOfWeek: repeatType === 'none' || repeatType === 'daily' ? [] : prev.daysOfWeek
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        {reminder ? 'Редагувати нагадування' : 'Нове нагадування'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Назва */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Назва *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.title ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Введіть назву нагадування"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                        )}
                    </div>

                    {/* Опис */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Опис
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Введіть опис (необов'язково)"
                            rows={3}
                        />
                    </div>

                    {/* Час */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Час *
                        </label>
                        <input
                            type="time"
                            value={formData.time}
                            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.time ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.time && (
                            <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                        )}
                    </div>

                    {/* Тип повторення */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Повторення
                        </label>
                        <select
                            value={formData.repeatType}
                            onChange={(e) => handleRepeatTypeChange(e.target.value as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {Object.entries(REPEAT_TYPES).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Дні тижня для щотижневого повторення */}
                    {formData.repeatType === 'weekly' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Дні тижня *
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {DAYS_OF_WEEK.map(({ value, label }) => (
                                    <label key={value} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.daysOfWeek.includes(value)}
                                            onChange={() => handleDayToggle(value)}
                                            className="mr-2"
                                        />
                                        <span className="text-sm">{label}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.daysOfWeek && (
                                <p className="text-red-500 text-sm mt-1">{errors.daysOfWeek}</p>
                            )}
                        </div>
                    )}

                    {/* Дні місяця для щомісячного повторення */}
                    {formData.repeatType === 'monthly' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Дні місяця *
                            </label>
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                    <label key={day} className="flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.daysOfWeek.includes(day)}
                                            onChange={() => handleDayToggle(day)}
                                            className="mr-1"
                                        />
                                        <span className="text-xs">{day}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.daysOfWeek && (
                                <p className="text-red-500 text-sm mt-1">{errors.daysOfWeek}</p>
                            )}
                        </div>
                    )}

                    {/* Дата для одноразового нагадування */}
                    {formData.repeatType === 'none' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Дата *
                            </label>
                            <input
                                type="date"
                                value={formData.date || ''}
                                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.date ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.date && (
                                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                            )}
                        </div>
                    )}

                    {/* Кнопки */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Скасувати
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {reminder ? 'Оновити' : 'Створити'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReminderForm; 