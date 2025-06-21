import { useState, useEffect } from 'react';
import api from '../../services/api';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { uk } from 'date-fns/locale';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';

interface HealthEntry {
    date: string;
    mood: number;
    sleepHours: number;
    waterIntake: number;
    activityMinutes: number;
    activityType?: string;
    steps?: number;
    caloriesBurned?: number;
    notes?: string;
    tags?: string[];
}

interface Statistics {
    statistics: {
        date: string;
        entries: HealthEntry[];
        totalWater: number;
        totalActivity: number;
        totalSteps: number;
        totalCalories: number;
        moods: number[];
        averageMood: number;
    }[];
    summary: {
        totalEntries: number;
        averageMood: number;
        totalWater: number;
        totalActivity: number;
        totalSteps: number;
        totalCalories: number;
    };
}

const defaultStatistics: Statistics = {
    statistics: [],
    summary: {
        totalEntries: 0,
        averageMood: 0,
        totalWater: 0,
        totalActivity: 0,
        totalSteps: 0,
        totalCalories: 0
    }
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Analytics = () => {
    const [statistics, setStatistics] = useState<Statistics>(defaultStatistics);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState({
        startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd')
    });
    const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const params = new URLSearchParams({
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            });

            const response = await api.get<Statistics>(`/entries/statistics?${params}`);
            
            if (!response.data || !response.data.statistics || !response.data.summary) {
                throw new Error('Invalid data format received from server');
            }

            setStatistics(response.data);
        } catch (err) {
            console.error('Error fetching statistics:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
            setStatistics(defaultStatistics);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, [dateRange]);

    const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDateRange(prev => ({ ...prev, [name]: value }));
    };

    const handleViewModeChange = (mode: 'day' | 'week' | 'month') => {
        setViewMode(mode);
        const today = new Date();
        let startDate: Date;
        let endDate: Date;

        switch (mode) {
            case 'week':
                startDate = startOfWeek(today, { weekStartsOn: 1 });
                endDate = endOfWeek(today, { weekStartsOn: 1 });
                break;
            case 'month':
                startDate = startOfMonth(today);
                endDate = endOfMonth(today);
                break;
            default:
                startDate = today;
                endDate = today;
        }

        setDateRange({
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDate: format(endDate, 'yyyy-MM-dd')
        });
    };

    const getActivityTypeLabel = (type: string) => {
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
            <div className="flex justify-center items-center min-h-screen" style={{ background: 'var(--color-background)' }}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen" style={{ background: 'var(--color-background)' }}>
                <div className="text-xl" style={{ color: 'var(--color-error)' }}>{error}</div>
            </div>
        );
    }

    const moodData = statistics.statistics.map(day => ({
        date: format(new Date(day.date), 'dd MMM', { locale: uk }),
        mood: Number(day.averageMood) || 0
    }));

    const activityData = statistics.statistics.map(day => ({
        date: format(new Date(day.date), 'dd MMM', { locale: uk }),
        activity: Number(day.totalActivity) || 0,
        steps: Number(day.totalSteps) || 0,
        calories: Number(day.totalCalories) || 0
    }));

    const waterData = statistics.statistics.map(day => ({
        date: format(new Date(day.date), 'dd MMM', { locale: uk }),
        water: Number(day.totalWater) || 0
    }));

    const activityTypeData = statistics.statistics.reduce((acc, day) => {
        day.entries.forEach(entry => {
            if (entry.activityType) {
                const type = entry.activityType;
                acc[type] = (acc[type] || 0) + entry.activityMinutes;
            }
        });
        return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(activityTypeData).map(([name, value]) => ({
        name: getActivityTypeLabel(name),
        value
    }));

    return (
        <div className="container mx-auto px-4 py-8" style={{ background: 'var(--color-background)', minHeight: '100vh' }}>
            <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-primary)' }}>Аналітика</h1>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex gap-4 mb-4">
                    <button
                        onClick={() => handleViewModeChange('day')}
                        className={`px-4 py-2 rounded-md ${
                            viewMode === 'day'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Сьогодні
                    </button>
                    <button
                        onClick={() => handleViewModeChange('week')}
                        className={`px-4 py-2 rounded-md ${
                            viewMode === 'week'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Цього тижня
                    </button>
                    <button
                        onClick={() => handleViewModeChange('month')}
                        className={`px-4 py-2 rounded-md ${
                            viewMode === 'month'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Цього місяця
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Початкова дата</label>
                        <input
                            type="date"
                            name="startDate"
                            value={dateRange.startDate}
                            onChange={handleDateRangeChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Кінцева дата</label>
                        <input
                            type="date"
                            name="endDate"
                            value={dateRange.endDate}
                            onChange={handleDateRangeChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-2">Всього записів</h3>
                    <p className="text-3xl font-bold text-blue-600">{statistics.summary.totalEntries}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-2">Середній настрій</h3>
                    <p className="text-3xl font-bold text-green-600">
                        {Number(statistics.summary.averageMood || 0).toFixed(1)}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-2">Всього води</h3>
                    <p className="text-3xl font-bold text-blue-400">
                        {Number(statistics.summary.totalWater || 0)} мл
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-2">Всього активності</h3>
                    <p className="text-3xl font-bold text-purple-600">
                        {Number(statistics.summary.totalActivity || 0)} хв
                    </p>
                </div>
            </div>

            <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Тренди настрою</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={moodData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={[1, 5]} />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="mood"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Огляд активності</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="activity" fill="#8B5CF6" name="Активність (хв)" />
                                <Bar dataKey="steps" fill="#EC4899" name="Кроки" />
                                <Bar dataKey="calories" fill="#F59E0B" name="Калорії" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Споживання води</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={waterData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="water" fill="#3B82F6" name="Вода (мл)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Розподіл типів активності</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics; 