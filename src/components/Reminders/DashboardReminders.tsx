import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/store';
import { fetchTodayReminders } from '../../store/reminder/reminderSlice';

const DashboardReminders: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { todayReminders } = useSelector((state: RootState) => state.reminder);
    const [showRemindersOnDashboard, setShowRemindersOnDashboard] = useState(false);

    useEffect(() => {
        dispatch(fetchTodayReminders());
        
        const savedSettings = localStorage.getItem('reminder_settings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            setShowRemindersOnDashboard(settings.showOnDashboard);
        }
    }, [dispatch]);

    useEffect(() => {
        const handleStorageChange = () => {
            const savedSettings = localStorage.getItem('reminder_settings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                setShowRemindersOnDashboard(settings.showOnDashboard);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    if (!showRemindersOnDashboard || todayReminders.length === 0) {
        return null;
    }

    return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
            <div className="font-semibold mb-2 text-yellow-800">Сьогоднішні нагадування:</div>
            <ul className="list-disc pl-5 space-y-1">
                {todayReminders.map(reminder => (
                    <li key={reminder.id} className="text-yellow-900">
                        <span className="font-medium">{reminder.title}</span> — {reminder.time}
                        {reminder.description && (
                            <span className="text-xs text-gray-500"> ({reminder.description})</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DashboardReminders; 