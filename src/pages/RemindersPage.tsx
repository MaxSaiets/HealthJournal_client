import React from 'react';
import RemindersList from '../components/Reminders/RemindersList';

const RemindersPage: React.FC = () => {
    return (
        <div className="max-w-2xl mx-auto py-8" style={{ background: 'var(--color-background)', minHeight: '100vh' }}>
            <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-primary)' }}>Нагадування</h1>
            <RemindersList />
        </div>
    );
};

export default RemindersPage; 