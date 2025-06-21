import React, { useState, useEffect } from 'react';

interface ReminderSettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

const ReminderSettings: React.FC<ReminderSettingsProps> = ({ isOpen, onClose }) => {
    const [settings, setSettings] = useState({
        enableNotifications: true,
        showOnDashboard: false,
        soundEnabled: false,
        autoDismiss: false,
        dismissDelay: 30 
    });

    useEffect(() => {
        const savedSettings = localStorage.getItem('reminder_settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const handleSettingChange = (key: string, value: boolean | number) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        localStorage.setItem('reminder_settings', JSON.stringify(newSettings));
        if (key === 'showOnDashboard') {
            window.dispatchEvent(new Event('storage'));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Налаштування нагадувань</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">Спливаючі повідомлення</h3>
                            <p className="text-sm text-gray-600">Показувати нагадування в потрібний час</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.enableNotifications}
                                onChange={(e) => handleSettingChange('enableNotifications', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">Показ на головній сторінці</h3>
                            <p className="text-sm text-gray-600">Завжди показувати сьогоднішні нагадування</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.showOnDashboard}
                                onChange={(e) => handleSettingChange('showOnDashboard', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">Автоматичне приховування</h3>
                            <p className="text-sm text-gray-600">Автоматично приховувати повідомлення</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.autoDismiss}
                                onChange={(e) => handleSettingChange('autoDismiss', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    {settings.autoDismiss && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Затримка (секунди): {settings.dismissDelay}
                            </label>
                            <input
                                type="range"
                                min="5"
                                max="120"
                                value={settings.dismissDelay}
                                onChange={(e) => handleSettingChange('dismissDelay', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                        Закрити
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReminderSettings; 