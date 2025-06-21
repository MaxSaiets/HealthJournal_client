import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/store';
import { fetchTodayReminders } from '../../store/reminder/reminderSlice';

const DashboardReminders: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { todayReminders, loading, error } = useSelector((state: RootState) => state.reminder);
    const [showRemindersOnDashboard, setShowRemindersOnDashboard] = useState(false);
    const [debug, setDebug] = useState(false);

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

    if (!showRemindersOnDashboard) {
        return null;
    }

    if (loading) {
        return <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded text-yellow-800">Завантаження нагадувань...</div>;
    }

    if (error) {
        return <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded text-red-800">{error}</div>;
    }

    if (todayReminders.length === 0) {
        return <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded text-yellow-800">На сьогодні немає активних нагадувань
            
            {debug && <pre className="text-xs mt-2 bg-yellow-100 p-2 rounded overflow-x-auto">{JSON.stringify(todayReminders, null, 2)}</pre>}
        </div>;
    }

    return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
            <div className="font-semibold mb-2 text-yellow-800">Сьогоднішні нагадування:
                
            </div>
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
            {debug && <pre className="text-xs mt-2 bg-yellow-100 p-2 rounded overflow-x-auto">{JSON.stringify(todayReminders, null, 2)}</pre>}
        </div>
    );
};

export default DashboardReminders; 