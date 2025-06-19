import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import EntryPopup from '../Popups/EntryPopup/EntryPopup';
import DashboardReminders from '../Reminders/DashboardReminders';
import DailyQuote from '../Quotes/DailyQuote';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { uk } from 'date-fns/locale';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

interface HealthEntry {
    id: number;
    date: string;
    mood: number;
    sleepHours: number;
    waterIntake: number;
    activityMinutes: number;
    activityType: string;
    steps: number;
    caloriesBurned: number;
    notes: string;
    tags: string[];
}

interface ApiResponse {
    entries: HealthEntry[];
    totalPages: number;
    currentPage: number;
    totalEntries: number;
}

type ViewMode = 'day' | 'week' | 'month' | 'all';

const Dashboard: React.FC = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const [entries, setEntries] = useState<HealthEntry[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<HealthEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<HealthEntry | undefined>();
    const [viewMode, setViewMode] = useState<ViewMode>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchEntries = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get<ApiResponse>('/entries', {
                params: {
                    page: currentPage,
                    limit: 12
                }
            });
            if (response.data && Array.isArray(response.data.entries)) {
                setEntries(response.data.entries);
                setTotalPages(response.data.totalPages);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('Failed to fetch health entries:', err);
            setError('Failed to fetch health entries');
            setEntries([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;
        fetchEntries();
    }, [currentPage, user]);

    useEffect(() => {
        filterEntries();
    }, [entries, viewMode, searchQuery]);

    const filterEntries = () => {
        const today = new Date();
        let filtered = [...entries];
        let weekStart: Date, weekEnd: Date, monthStart: Date, monthEnd: Date;

        // Фільтрація за періодом
        switch (viewMode) {
            case 'day':
                filtered = filtered.filter(entry => 
                    format(new Date(entry.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
                );
                break;
            case 'week':
                weekStart = startOfWeek(today, { weekStartsOn: 1 });
                weekEnd = endOfWeek(today, { weekStartsOn: 1 });
                filtered = filtered.filter(entry =>
                    isWithinInterval(new Date(entry.date), { start: weekStart, end: weekEnd })
                );
                break;
            case 'month':
                monthStart = startOfMonth(today);
                monthEnd = endOfMonth(today);
                filtered = filtered.filter(entry =>
                    isWithinInterval(new Date(entry.date), { start: monthStart, end: monthEnd })
                );
                break;
        }

        // Фільтрація за пошуком
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(entry =>
                (entry.notes?.toLowerCase() || '').includes(query) ||
                (entry.tags?.some(tag => tag?.toLowerCase().includes(query)) || false) ||
                (entry.activityType?.toLowerCase() || '').includes(query)
            );
        }

        setFilteredEntries(filtered);
    };

    const handleAddEntry = () => {
        setSelectedEntry(undefined);
        setIsPopupOpen(true);
    };

    const handleEditEntry = (entry: HealthEntry) => {
        setSelectedEntry(entry);
        setIsPopupOpen(true);
    };

    const handlePopupClose = () => {
        setIsPopupOpen(false);
        setSelectedEntry(undefined);
    };

    const handlePopupSave = () => {
        fetchEntries();
    };

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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Сьогоднішні нагадування */}
            <DashboardReminders />
            
            {/* Цитата дня */}
            <div className="mb-8">
                <DailyQuote />
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold">Щоденник здоров'я</h1>
                <button 
                    onClick={handleAddEntry}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                    Додати запис
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('day')}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                viewMode === 'day'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Сьогодні
                        </button>
                        <button 
                            onClick={() => setViewMode('week')}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                viewMode === 'week'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Тиждень
                        </button>
                        <button
                            onClick={() => setViewMode('month')}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                viewMode === 'month'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Місяць
                        </button>
                        <button
                            onClick={() => setViewMode('all')}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                viewMode === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Всі
                        </button>
                    </div>
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Пошук по нотатках, тегах, активності..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {filteredEntries.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {searchQuery ? 'Записи не знайдено' : 'Записи відсутні'}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredEntries.map((entry) => (
                            <div key={entry.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm text-gray-500">
                                        {format(new Date(entry.date), 'dd MMM yyyy', { locale: uk })}
                                    </span>
                                    <button
                                        onClick={() => handleEditEntry(entry)}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        Редагувати
                                    </button>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(entry.mood)}`}>
                                        {getMoodLabel(entry.mood)}
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-gray-500">Сон:</span>
                                            <span className="ml-1 font-medium">{entry.sleepHours} год</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Вода:</span>
                                            <span className="ml-1 font-medium">{entry.waterIntake} мл</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Активність:</span>
                                            <span className="ml-1 font-medium">{entry.activityMinutes} хв</span>
                                        </div>
                                        {entry.steps && (
                                            <div>
                                                <span className="text-gray-500">Кроки:</span>
                                                <span className="ml-1 font-medium">{entry.steps}</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {entry.activityType && (
                                        <div className="text-sm">
                                            <span className="text-gray-500">Тип активності:</span>
                                            <span className="ml-1 font-medium">{entry.activityType}</span>
                                        </div>
                                    )}
                                    
                                    {entry.notes && (
                                        <div className="text-sm">
                                            <span className="text-gray-500">Нотатки:</span>
                                            <p className="mt-1 text-gray-700">{entry.notes}</p>
                                        </div>
                                    )}
                                    
                                    {entry.tags && entry.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {entry.tags.map((tag, index) => (
                                                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Попередня
                            </button>
                            <span className="px-3 py-2 text-gray-700">
                                {currentPage} з {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Наступна
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {isPopupOpen && (
                <EntryPopup
                    isOpen={isPopupOpen}
                    entry={selectedEntry}
                    onClose={handlePopupClose}
                    onSave={handlePopupSave}
                />
            )}
        </div>
    );
};

export default Dashboard;