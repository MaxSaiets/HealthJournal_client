import React, { useState } from 'react';
import { useToast } from '../../ui/ToastProvider';

interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other';
    height?: number;
    weight?: number;
    activityLevel?: string;
    healthGoals?: string[];
    preferences?: {
        notifications: boolean;
        emailNotifications: boolean;
        theme: string;
        language: string;
        waterGoal: number;
        sleepGoal: number;
        activityGoal: number;
    };
}

interface ProfileFormProps {
    user: User;
    onUpdate: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: user.name || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        height: user.height || '',
        weight: user.weight || '',
        activityLevel: user.activityLevel || 'moderately_active',
        healthGoals: user.healthGoals || [],
        preferences: {
            notifications: user.preferences?.notifications ?? true,
            emailNotifications: user.preferences?.emailNotifications ?? true,
            theme: user.preferences?.theme ?? 'light',
            language: user.preferences?.language ?? 'uk',
            waterGoal: user.preferences?.waterGoal ?? 2000,
            sleepGoal: user.preferences?.sleepGoal ?? 8,
            activityGoal: user.preferences?.activityGoal ?? 30
        }
    });

    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const [newGoal, setNewGoal] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (name.startsWith('preferences.')) {
            const prefName = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                preferences: {
                    ...prev.preferences,
                    [prefName]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                               type === 'number' ? Number(value) : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'number' ? Number(value) : value
            }));
        }
    };

    const handleAddGoal = () => {
        if (newGoal.trim() && !formData.healthGoals.includes(newGoal.trim())) {
            setFormData(prev => ({
                ...prev,
                healthGoals: [...prev.healthGoals, newGoal.trim()]
            }));
            setNewGoal('');
        }
    };

    const handleRemoveGoal = (goalToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            healthGoals: prev.healthGoals.filter(goal => goal !== goalToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await onUpdate({
            ...formData,
            gender: (formData.gender as 'male' | 'female' | 'other') || undefined,
            height: formData.height ? Number(formData.height) : undefined,
            weight: formData.weight ? Number(formData.weight) : undefined
        });
        
        if (result.success) {
            toast.success('Профіль успішно оновлено!');
            if (formData.preferences.theme) {
                localStorage.setItem('selectedTheme', formData.preferences.theme);
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(formData.preferences.theme);
            }
        } else {
            toast.error(result.error || 'Помилка оновлення профілю');
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Особиста інформація</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ім'я *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Дата народження
                        </label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Стать
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Оберіть стать</option>
                            <option value="male">Чоловіча</option>
                            <option value="female">Жіноча</option>
                            <option value="other">Інша</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Зріст (см)
                        </label>
                        <input
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            min="100"
                            max="250"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Вага (кг)
                        </label>
                        <input
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            min="30"
                            max="300"
                            step="0.1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Рівень активності
                        </label>
                        <select
                            name="activityLevel"
                            value={formData.activityLevel}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="sedentary">Сидячий спосіб життя</option>
                            <option value="lightly_active">Легка активність</option>
                            <option value="moderately_active">Помірна активність</option>
                            <option value="very_active">Висока активність</option>
                            <option value="extremely_active">Дуже висока активність</option>
                        </select>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Цілі здоров'я</h3>
                
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newGoal}
                            onChange={(e) => setNewGoal(e.target.value)}
                            placeholder="Додати нову ціль"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={handleAddGoal}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Додати
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {formData.healthGoals.map((goal, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                            >
                                {goal}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveGoal(goal)}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Налаштування</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ціль води (мл)
                        </label>
                        <input
                            type="number"
                            name="preferences.waterGoal"
                            value={formData.preferences.waterGoal}
                            onChange={handleChange}
                            min="500"
                            max="5000"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ціль сну (годин)
                        </label>
                        <input
                            type="number"
                            name="preferences.sleepGoal"
                            value={formData.preferences.sleepGoal}
                            onChange={handleChange}
                            min="4"
                            max="12"
                            step="0.5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ціль активності (хвилин)
                        </label>
                        <input
                            type="number"
                            name="preferences.activityGoal"
                            value={formData.preferences.activityGoal}
                            onChange={handleChange}
                            min="10"
                            max="300"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Тема
                        </label>
                        <select
                            name="preferences.theme"
                            value={formData.preferences.theme}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="light">Світла</option>
                            <option value="dark">Темна</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Збереження...' : 'Зберегти зміни'}
                </button>
            </div>
        </form>
    );
};

export default ProfileForm; 