import React from 'react';
import RemindersList from '../components/Reminders/RemindersList';

const RemindersPage: React.FC = () => {
    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Нагадування</h1>
            <RemindersList />
        </div>
    );
};

export default RemindersPage; 