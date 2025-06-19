import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/store';
import {
    fetchAllReminders,
    deleteReminder,
    toggleReminderActive,
} from '../../store/reminder/reminderSlice';
import ReminderForm from './ReminderForm';
import ReminderSettings from './ReminderSettings';
import type { Reminder } from '../../types/reminder';

const RemindersList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { reminders, loading, error } = useSelector((state: RootState) => state.reminder);
    const [showForm, setShowForm] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [editReminder, setEditReminder] = useState<Reminder | null>(null);

    useEffect(() => {
        dispatch(fetchAllReminders());
    }, [dispatch]);

    const handleEdit = (reminder: Reminder) => {
        setEditReminder(reminder);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Ви дійсно хочете видалити це нагадування?')) {
            await dispatch(deleteReminder(id));
        }
    };

    const handleToggleActive = async (id: string) => {
        await dispatch(toggleReminderActive(id));
    };

    const handleAdd = () => {
        setEditReminder(null);
        setShowForm(true);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Мої нагадування</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowSettings(true)}
                        className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                    >
                        ⚙️ Налаштування
                    </button>
                    <button
                        onClick={handleAdd}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        + Додати
                    </button>
                </div>
            </div>
            {loading && <p>Завантаження...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <ul className="divide-y divide-gray-200">
                {reminders.map(reminder => (
                    <li key={reminder.id} className="py-3 flex items-center justify-between">
                        <div>
                            <div className="font-medium text-gray-900">{reminder.title}</div>
                            <div className="text-sm text-gray-600">
                                {reminder.time} &bull; {reminder.repeatType === 'none' ? 'Без повторення' : reminder.repeatType}
                            </div>
                            {reminder.description && (
                                <div className="text-xs text-gray-500 mt-1">{reminder.description}</div>
                            )}
                        </div>
                        <div className="flex gap-2 items-center">
                            <button
                                onClick={() => handleToggleActive(reminder.id)}
                                className={`px-2 py-1 rounded ${reminder.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}
                                title={reminder.isActive ? 'Деактивувати' : 'Активувати'}
                            >
                                {reminder.isActive ? '✓' : '⏸'}
                            </button>
                            <button
                                onClick={() => handleEdit(reminder)}
                                className="px-2 py-1 text-blue-600 hover:underline"
                            >
                                Редагувати
                            </button>
                            <button
                                onClick={() => handleDelete(reminder.id)}
                                className="px-2 py-1 text-red-600 hover:underline"
                            >
                                Видалити
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {showForm && (
                <ReminderForm
                    reminder={editReminder}
                    onClose={() => setShowForm(false)}
                    onSuccess={() => dispatch(fetchAllReminders())}
                />
            )}
            {showSettings && (
                <ReminderSettings
                    isOpen={showSettings}
                    onClose={() => setShowSettings(false)}
                />
            )}
        </div>
    );
};

export default RemindersList; 