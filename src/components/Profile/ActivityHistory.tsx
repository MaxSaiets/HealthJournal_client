import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import api from '../../services/api';

interface HealthEntry {
    id: number;
    date: string;
    mood: number;
    sleepHours: number;
    waterIntake: number;
    activityMinutes: number;
    activityType?: string;
    steps?: number;
    caloriesBurned?: number;
    notes?: string;
}

interface ApiResponse {
    entries: HealthEntry[];
    totalPages: number;
    currentPage: number;
    totalEntries: number;
}

const ActivityHistory: React.FC = () => {
    const [entries, setEntries] = useState<HealthEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEntries, setTotalEntries] = useState(0);

    const fetchActivityHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await api.get<ApiResponse>('/user/activity-history', {
                params: {
                    page: currentPage,
                    limit: 10
                }
            });

            if (response.data && Array.isArray(response.data.entries)) {
                setEntries(response.data.entries);
                setTotalPages(response.data.totalPages);
                setTotalEntries(response.data.totalEntries);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('Failed to fetch activity history:', err);
            setError('Failed to fetch activity history');
            setEntries([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivityHistory();
    }, [currentPage]);

    const getMoodLabel = (mood: number): string => {
        switch (mood) {
            case 1: return '😢 Дуже погано';
            case 2: return '😕 Погано';
            case 3: return '😐 Нормально';
            case 4: return '🙂 Добре';
            case 5: return '😊 Відмінно';
            default: return 'Невідомо';
        }
    };

    const getMoodColor = (mood: number): string => {
        switch (mood) {
            case 1: return 'bg-red-100 text-red-800';
            case 2: return 'bg-orange-100 text-orange-800';
            case 3: return 'bg-yellow-100 text-yellow-800';
            case 4: return 'bg-green-100 text-green-800';
            case 5: return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getActivityTypeLabel = (type: string): string => {
        const labels: Record<string, string> = {
            walking: 'Ходьба',
            running: 'Біг',
            cycling: 'Велосипед',
            swimming: 'Плавання',
            gym: 'Тренажерний зал',
            yoga: 'Йога',
            other: 'Інше'
        };
        return labels[type] || type;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <div className="text-red-500 text-lg">{error}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Історія активності</h3>
                <div className="text-sm text-gray-500">
                    Всього записів: {totalEntries}
                </div>
            </div>

            {entries.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-500 text-lg">Записів не знайдено</div>
                    <p className="text-gray-400 mt-2">Створіть свій перший запис здоров'я</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {entries.map((entry) => (
                        <div key={entry.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900">
                                        {format(new Date(entry.date), 'EEEE, d MMMM yyyy', { locale: uk })}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        {format(new Date(entry.date), 'dd.MM.yyyy')}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(entry.mood)}`}>
                                    {getMoodLabel(entry.mood)}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Сон</p>
                                        <p className="font-medium">{entry.sleepHours} год</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Вода</p>
                                        <p className="font-medium">{entry.waterIntake} мл</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Активність</p>
                                        <p className="font-medium">{entry.activityMinutes} хв</p>
                                    </div>
                                </div>

                                {entry.steps && (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Кроки</p>
                                            <p className="font-medium">{entry.steps.toLocaleString()}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {(entry.activityType || entry.caloriesBurned) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    {entry.activityType && (
                                        <div>
                                            <p className="text-sm text-gray-600">Тип активності</p>
                                            <p className="font-medium">{getActivityTypeLabel(entry.activityType)}</p>
                                        </div>
                                    )}
                                    {entry.caloriesBurned && (
                                        <div>
                                            <p className="text-sm text-gray-600">Спалені калорії</p>
                                            <p className="font-medium">{entry.caloriesBurned} ккал</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {entry.notes && (
                                <div className="border-t border-gray-200 pt-4">
                                    <p className="text-sm text-gray-600 mb-1">Нотатки</p>
                                    <p className="text-gray-900">{entry.notes}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Пагінація */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Попередня
                    </button>
                    
                    <span className="px-4 py-2 text-sm text-gray-700">
                        Сторінка {currentPage} з {totalPages}
                    </span>
                    
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Наступна
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActivityHistory; 