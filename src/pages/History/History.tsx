import { useState, useEffect } from 'react';
import api from '../../services/api';
import { format, subDays } from 'date-fns';
import { uk } from 'date-fns/locale';

interface HealthEntry {
    id: number;
    date: string;
    mood: number;
    sleepHours: number;
    waterIntake: number;
    activityMinutes: number;
    notes?: string;
}

interface ApiResponse {
    entries: HealthEntry[];
    totalPages: number;
    currentPage: number;
    totalEntries: number;
}

const History = () => {
    const [entries, setEntries] = useState<HealthEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        entryType: ''
    });
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

    const fetchEntries = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10',
                ...filters
            });

            const response = await api.get<ApiResponse>(`/entries?${params}`);
            if (response.data && Array.isArray(response.data.entries)) {
                setEntries(response.data.entries);
                setTotalPages(response.data.totalPages);
                setError(null);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            setError('Failed to fetch entries');
            console.error('Error fetching entries:', err);
            setEntries([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, [currentPage, filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    const handleQuickDate = (type: 'today' | 'week' | 'month' | 'all') => {
        const today = new Date();
        let startDate = '';
        let endDate = '';
        if (type === 'today') {
            startDate = format(today, 'yyyy-MM-dd');
            endDate = format(today, 'yyyy-MM-dd');
        } else if (type === 'week') {
            startDate = format(subDays(today, 6), 'yyyy-MM-dd');
            endDate = format(today, 'yyyy-MM-dd');
        } else if (type === 'month') {
            startDate = format(subDays(today, 29), 'yyyy-MM-dd');
            endDate = format(today, 'yyyy-MM-dd');
        }
        setFilters(prev => ({ ...prev, startDate, endDate }));
        setCurrentPage(1);
    };

    const getMoodLabel = (mood: number) => {
        const labels = ['Terrible', 'Bad', 'Neutral', 'Good', 'Excellent'];
        return labels[mood - 1] || 'Unknown';
    };

    const getMoodColor = (mood: number) => {
        const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];
        return colors[mood - 1] || 'bg-gray-500';
    };

    const sortedEntries = [...entries]
        .filter(entry => {
            if (!filters.entryType || filters.entryType === 'full') return true;
            if (filters.entryType === 'water') return entry.waterIntake != null;
            if (filters.entryType === 'sleep') return entry.sleepHours != null;
            if (filters.entryType === 'activity') return entry.activityMinutes != null;
            if (filters.entryType === 'mood') return entry.mood != null;
            return true;
        })
        .sort((a, b) => {
            if (filters.entryType && filters.entryType !== 'full') {
                const key: keyof HealthEntry = filters.entryType === 'water'
                    ? 'waterIntake'
                    : filters.entryType === 'sleep'
                    ? 'sleepHours'
                    : filters.entryType === 'activity'
                    ? 'activityMinutes'
                    : filters.entryType === 'mood'
                    ? 'mood'
                    : 'date';
                if (sortOrder === 'desc') {
                    return (b[key] as number) - (a[key] as number);
                } else {
                    return (a[key] as number) - (b[key] as number);
                }
            } else {
                if (sortOrder === 'desc') {
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                } else {
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                }
            }
        });

    const renderEntryContent = (entry: HealthEntry) => {
        switch (filters.entryType) {
            case 'water':
                return <div>Water: {entry.waterIntake} ml</div>;
            case 'sleep':
                return <div>Sleep: {entry.sleepHours} hours</div>;
            case 'activity':
                return <div>Activity: {entry.activityMinutes} min</div>;
            case 'mood':
                return (
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getMoodColor(entry.mood)}`}></div>
                        <span>Mood: {getMoodLabel(entry.mood)}</span>
                    </div>
                );
            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getMoodColor(entry.mood)}`}></div>
                            <span>Mood: {getMoodLabel(entry.mood)}</span>
                        </div>
                        <div>Sleep: {entry.sleepHours} hours</div>
                        <div>Water: {entry.waterIntake} ml</div>
                        <div>Activity: {entry.activityMinutes} min</div>
                    </div>
                );
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Health History</h1>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Entry Type</label>
                        <select
                            name="entryType"
                            value={filters.entryType}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Types</option>
                            <option value="full">Full Day</option>
                            <option value="water">Water Intake</option>
                            <option value="activity">Activity</option>
                            <option value="sleep">Sleep</option>
                            <option value="mood">Mood</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    <button onClick={() => handleQuickDate('today')} className="px-3 py-1 bg-blue-100 rounded hover:bg-blue-200">Сьогодні</button>
                    <button onClick={() => handleQuickDate('week')} className="px-3 py-1 bg-blue-100 rounded hover:bg-blue-200">Тиждень</button>
                    <button onClick={() => handleQuickDate('month')} className="px-3 py-1 bg-blue-100 rounded hover:bg-blue-200">Місяць</button>
                    <button onClick={() => handleQuickDate('all')} className="px-3 py-1 bg-blue-100 rounded hover:bg-blue-200">Усі</button>
                    <button onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')} className="px-3 py-1 bg-green-100 rounded hover:bg-green-200 ml-auto">Сортувати: {sortOrder === 'desc' ? '↓' : '↑'}</button>
                </div>
            </div>

            <div className="space-y-4">
                {sortedEntries.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        No entries found
                    </div>
                ) : (
                    sortedEntries.map(entry => (
                        <div key={entry.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {format(new Date(entry.date), 'EEEE, d MMMM yyyy', { locale: uk })}
                                    </h2>
                                </div>
                            </div>
                            {renderEntryContent(entry)}
                            {entry.notes && (
                                <div className="mt-4 text-gray-600">
                                    <p>{entry.notes}</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border rounded-md disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border rounded-md disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default History; 