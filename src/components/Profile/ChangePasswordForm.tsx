import React, { useState } from 'react';
import { useToast } from '../../ui/ToastProvider';

interface ChangePasswordFormProps {
    onChange: (data: { currentPassword: string; newPassword: string }) => Promise<{ success: boolean; error?: string }>;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onChange }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.currentPassword) {
            toast.error('Введіть поточний пароль');
            return false;
        }
        if (!formData.newPassword) {
            toast.error('Введіть новий пароль');
            return false;
        }
        if (formData.newPassword.length < 6) {
            toast.error('Новий пароль має бути мінімум 6 символів');
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Паролі не співпадають');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);

        const result = await onChange({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
        });

        if (result.success) {
            toast.success('Пароль успішно змінено!');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } else {
            toast.error(result.error || 'Помилка зміни паролю');
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Зміна паролю</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Поточний пароль *
                        </label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Новий пароль *
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Мінімум 6 символів</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Підтвердіть новий пароль *
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Зміна паролю...' : 'Змінити пароль'}
                </button>
            </div>
        </form>
    );
};

export default ChangePasswordForm; 