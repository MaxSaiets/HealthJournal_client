import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/store';
import { fetchTodayReminders } from '../../store/reminder/reminderSlice';
import type { Reminder } from '../../types/reminder';
import { useToast } from '../../ui/ToastProvider';

const ReminderManager: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { todayReminders } = useSelector((state: RootState) => state.reminder);
    const [dismissedReminders, setDismissedReminders] = useState<Set<string>>(new Set());
    const [settings, setSettings] = useState({
        enableNotifications: true,
        showOnDashboard: false,
        soundEnabled: true,
        autoDismiss: false,
        dismissDelay: 30
    });
    const timeoutRef = useRef<number | null>(null);
    const autoDismissRefs = useRef<Map<string, number>>(new Map());
    const toast = useToast();

    useEffect(() => {
        const savedSettings = localStorage.getItem('reminder_settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    useEffect(() => {
        dispatch(fetchTodayReminders());
    }, [dispatch]);

    useEffect(() => {
        const today = new Date().toDateString();
        const dismissedKey = `dismissed_reminders_${today}`;
        const dismissed = JSON.parse(localStorage.getItem(dismissedKey) || '[]');
        setDismissedReminders(new Set(dismissed));
    }, []);

    useEffect(() => {
        const today = new Date().toDateString();
        const dismissedKey = `dismissed_reminders_${today}`;
        const lastCheck = localStorage.getItem('last_reminder_check');
        if (lastCheck !== today) {
            localStorage.removeItem(dismissedKey);
            localStorage.setItem('last_reminder_check', today);
            setDismissedReminders(new Set());
        }
    }, []);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            autoDismissRefs.current.forEach(timeoutId => {
                clearTimeout(timeoutId);
            });
            autoDismissRefs.current.clear();
        };
    }, []);

    function getNextReminder(reminders: Reminder[], dismissed: Set<string>) {
        const now = new Date();
        return reminders
            .filter(r => !dismissed.has(r.id))
            .map(r => {
                const [h, m] = r.time.split(':');
                const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(h), Number(m));
                return { ...r, date };
            })
            .filter(r => r.date > now)
            .sort((a, b) => a.date.getTime() - b.date.getTime())[0];
    }

    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (!settings.enableNotifications) return;
        const next = getNextReminder(todayReminders, dismissedReminders);
        if (!next) return;
        const now = new Date();
        const ms = next.date.getTime() - now.getTime();
        if (ms <= 0) return;
        timeoutRef.current = window.setTimeout(() => {
            toast.info(
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12H9v-2h2v2zm0-4H9V7h2v3z" /></svg>
                        <span className="font-semibold">{next.title}</span>
                    </div>
                    {next.description && <div className="text-xs text-blue-100">{next.description}</div>}
                    <div className="text-xs text-blue-100">Час: {next.time}</div>
                </div>,
                settings.autoDismiss ? { autoClose: settings.dismissDelay * 1000 } : undefined
            );
            setDismissedReminders(prev => new Set([...prev, next.id]));
            const today = new Date().toDateString();
            const dismissedKey = `dismissed_reminders_${today}`;
            const dismissed = JSON.parse(localStorage.getItem(dismissedKey) || '[]');
            if (!dismissed.includes(next.id)) {
                dismissed.push(next.id);
                localStorage.setItem(dismissedKey, JSON.stringify(dismissed));
            }
            if (settings.autoDismiss) {
                const timeoutId = window.setTimeout(() => {
                }, settings.dismissDelay * 1000);
                autoDismissRefs.current.set(next.id, timeoutId);
            }
        }, ms);
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [todayReminders, dismissedReminders, settings, toast]);

    if (!settings.enableNotifications) {
        return null;
    }

    return null;
};

export default ReminderManager; 