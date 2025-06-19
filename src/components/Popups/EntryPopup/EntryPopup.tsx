import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from '../../../services/api';

interface HealthEntry {
    id?: number;
    date: string;
    mood: number;
    sleepHours: number | '';
    waterIntake: number | '';
    activityMinutes: number | '';
    activityType: string;
    steps: number | '';
    caloriesBurned: number | '';
    notes: string;
    tags: string[];
}

interface ValidationErrors {
    sleepHours?: string;
    waterIntake?: string;
    activityMinutes?: string;
    steps?: string;
    caloriesBurned?: string;
}

interface EntryPopupProps {
    isOpen: boolean;
    onClose: () => void;
    entry?: HealthEntry;
    onSave: () => void;
}

const defaultFormData: HealthEntry = {
    date: format(new Date(), 'yyyy-MM-dd'),
    mood: 3,
    sleepHours: 8,
    waterIntake: 2000,
    activityMinutes: 30,
    activityType: '',
    steps: 0,
    caloriesBurned: 0,
    notes: '',
    tags: []
};

const EntryPopup: React.FC<EntryPopupProps> = ({ isOpen, onClose, entry, onSave }) => {
    const [formData, setFormData] = useState<HealthEntry>(defaultFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        if (entry) {
            setFormData({
                ...defaultFormData,
                ...entry,
                activityType: entry.activityType || '',
                steps: entry.steps || '',
                caloriesBurned: entry.caloriesBurned || '',
                notes: entry.notes || '',
                tags: entry.tags || []
            });
        } else {
            setFormData(defaultFormData);
        }
    }, [entry]);

    const validateField = (name: string, value: number | ''): string | undefined => {
        if (value === '') {
            return 'Це поле обов\'язкове';
        }
        if (typeof value === 'number') {
            if (name === 'sleepHours' && (value < 0 || value > 24)) {
                return 'Години сну мають бути від 0 до 24';
            }
            if (name === 'waterIntake' && value < 0) {
                return 'Кількість води не може бути від\'ємною';
            }
            if (name === 'activityMinutes' && value < 0) {
                return 'Час активності не може бути від\'ємним';
            }
            if (name === 'steps' && value < 0) {
                return 'Кількість кроків не може бути від\'ємною';
            }
            if (name === 'caloriesBurned' && value < 0) {
                return 'Спалені калорії не можуть бути від\'ємними';
            }
        }
        return undefined;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'mood' || name === 'sleepHours' || name === 'waterIntake' || 
            name === 'activityMinutes' || name === 'steps' || name === 'caloriesBurned') {
            if (value === '') {
                setFormData(prev => ({
                    ...prev,
                    [name]: ''
                }));
                setValidationErrors(prev => ({
                    ...prev,
                    [name]: validateField(name, '')
                }));
            } else {
                const numValue = Number(value);
                if (!isNaN(numValue)) {
                    setFormData(prev => ({
                        ...prev,
                        [name]: numValue
                    }));
                    setValidationErrors(prev => ({
                        ...prev,
                        [name]: validateField(name, numValue)
                    }));
                }
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAddTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const validateForm = (): boolean => {
        const errors: ValidationErrors = {};
        let isValid = true;

        const requiredFields: (keyof HealthEntry)[] = ['sleepHours', 'waterIntake', 'activityMinutes'];
        requiredFields.forEach(field => {
            const error = validateField(field, formData[field] as number | '');
            if (error) {
                (errors as Record<keyof HealthEntry, string>)[field] = error;
                isValid = false;
            }
        });

        setValidationErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setError('Будь ласка, виправте помилки в формі');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (entry?.id) {
                await api.put(`/entries/${entry.id}`, formData);
            } else {
                await api.post('/entries', formData);
            }
            onSave();
            onClose();
        } catch (err) {
            console.error('Error saving entry:', err);
            setError(err instanceof Error ? err.message : 'Failed to save entry');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!entry?.id) return;

        setLoading(true);
        setError(null);

        try {
            await api.delete(`/entries/${entry.id}`);
            onSave();
            onClose();
        } catch (err) {
            console.error('Error deleting entry:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete entry');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">
                        {entry?.id ? 'Редагувати запис' : 'Новий запис'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Дата
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Настрій (1-5)
                            </label>
                            <select
                                name="mood"
                                value={formData.mood}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value={1}>😢 Дуже погано</option>
                                <option value={2}>😕 Погано</option>
                                <option value={3}>😐 Нормально</option>
                                <option value={4}>🙂 Добре</option>
                                <option value={5}>😊 Відмінно</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Години сну *
                            </label>
                            <input
                                type="number"
                                name="sleepHours"
                                value={formData.sleepHours === '' ? '' : formData.sleepHours}
                                onChange={handleChange}
                                min="0"
                                max="24"
                                step="0.5"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    validationErrors.sleepHours ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            />
                            {validationErrors.sleepHours && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.sleepHours}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Вода (мл) *
                            </label>
                            <input
                                type="number"
                                name="waterIntake"
                                value={formData.waterIntake === '' ? '' : formData.waterIntake}
                                onChange={handleChange}
                                min="0"
                                step="100"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    validationErrors.waterIntake ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            />
                            {validationErrors.waterIntake && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.waterIntake}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Активність (хв) *
                            </label>
                            <input
                                type="number"
                                name="activityMinutes"
                                value={formData.activityMinutes === '' ? '' : formData.activityMinutes}
                                onChange={handleChange}
                                min="0"
                                step="5"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    validationErrors.activityMinutes ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            />
                            {validationErrors.activityMinutes && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.activityMinutes}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Тип активності
                            </label>
                            <select
                                name="activityType"
                                value={formData.activityType}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Виберіть тип</option>
                                <option value="walking">Ходьба</option>
                                <option value="running">Біг</option>
                                <option value="cycling">Велосипед</option>
                                <option value="swimming">Плавання</option>
                                <option value="gym">Тренажерний зал</option>
                                <option value="yoga">Йога</option>
                                <option value="other">Інше</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Кроки
                            </label>
                            <input
                                type="number"
                                name="steps"
                                value={formData.steps === '' ? '' : formData.steps}
                                onChange={handleChange}
                                min="0"
                                step="100"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    validationErrors.steps ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {validationErrors.steps && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.steps}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Спалені калорії
                            </label>
                            <input
                                type="number"
                                name="caloriesBurned"
                                value={formData.caloriesBurned === '' ? '' : formData.caloriesBurned}
                                onChange={handleChange}
                                min="0"
                                step="10"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    validationErrors.caloriesBurned ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {validationErrors.caloriesBurned && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.caloriesBurned}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Нотатки
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Теги
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Додати тег"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Додати
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-2 text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        {entry?.id && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                disabled={loading}
                            >
                                Видалити
                            </button>
                        )}
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        >
                            {loading ? 'Збереження...' : 'Зберегти'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EntryPopup; 