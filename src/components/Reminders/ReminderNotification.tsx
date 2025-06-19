import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/store';
import { fetchTodayReminders } from '../../store/reminder/reminderSlice';
import type { Reminder } from '../../types/reminder';

interface ReminderNotificationProps {
    reminder: Reminder;
    onDismiss: (reminderId: string) => void;
}

const ReminderNotification: React.FC<ReminderNotificationProps> = ({ 
    reminder, 
    onDismiss 
}) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleDismiss = () => {
        setIsVisible(false);
        setTimeout(() => {
            onDismiss(reminder.id);
        }, 300); // Час для анімації
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 bg-white border-l-4 border-blue-500 shadow-lg rounded-lg p-4 max-w-sm z-50 animate-slide-in">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center mb-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                        <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
                    </div>
                    {reminder.description && (
                        <p className="text-sm text-gray-600 mb-2">{reminder.description}</p>
                    )}
                    <p className="text-xs text-gray-500">
                        Час: {reminder.time}
                    </p>
                </div>
                <button
                    onClick={handleDismiss}
                    className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Закрити"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default ReminderNotification; 