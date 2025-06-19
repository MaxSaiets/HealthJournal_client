import React from 'react';

interface UserStats {
    totalEntries: number;
    averageMood: number;
    totalWater: number;
    totalActivity: number;
    totalSteps: number;
    totalCalories: number;
    averageSleep: number;
    streakDays: number;
    goals: {
        waterGoal: number;
        sleepGoal: number;
        activityGoal: number;
    };
    achievements: string[];
}

interface UserStatsProps {
    stats: UserStats | null;
}

const UserStats: React.FC<UserStatsProps> = ({ stats }) => {
    if (!stats) {
        return (
            <div className="text-center text-gray-500 py-8">
                Завантаження статистики...
            </div>
        );
    }

    const getMoodEmoji = (mood: number) => {
        if (mood >= 4.5) return '😊';
        if (mood >= 3.5) return '🙂';
        if (mood >= 2.5) return '😐';
        if (mood >= 1.5) return '😕';
        return '😢';
    };

    const getMoodLabel = (mood: number) => {
        if (mood >= 4.5) return 'Відмінно';
        if (mood >= 3.5) return 'Добре';
        if (mood >= 2.5) return 'Нормально';
        if (mood >= 1.5) return 'Погано';
        return 'Дуже погано';
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('uk-UA').format(Math.round(num));
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Ваша статистика</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Записи</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalEntries}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <span className="text-2xl">{getMoodEmoji(stats.averageMood)}</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Середній настрій</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.averageMood.toFixed(1)}</p>
                            <p className="text-xs text-gray-500">{getMoodLabel(stats.averageMood)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Streak</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.streakDays}</p>
                            <p className="text-xs text-gray-500">днів поспіль</p>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Середній сон</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.averageSleep.toFixed(1)}</p>
                            <p className="text-xs text-gray-500">годин</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Активність</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Загальна активність:</span>
                            <span className="font-medium">{formatNumber(stats.totalActivity)} хв</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Кроки:</span>
                            <span className="font-medium">{formatNumber(stats.totalSteps)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Спалені калорії:</span>
                            <span className="font-medium">{formatNumber(stats.totalCalories)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Ціль активності:</span>
                            <span className="font-medium">{stats.goals.activityGoal} хв/день</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Вода та сон</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Загальна вода:</span>
                            <span className="font-medium">{formatNumber(stats.totalWater)} мл</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Ціль води:</span>
                            <span className="font-medium">{stats.goals.waterGoal} мл/день</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Ціль сну:</span>
                            <span className="font-medium">{stats.goals.sleepGoal} год/день</span>
                        </div>
                    </div>
                </div>
            </div>

            {stats.achievements.length > 0 && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Досягнення</h4>
                    <div className="flex flex-wrap gap-2">
                        {stats.achievements.map((achievement, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                            >
                                🏆 {achievement}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Прогрес до цілей</h4>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>Вода</span>
                            <span>{Math.round((stats.totalWater / (stats.goals.waterGoal * stats.totalEntries)) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${Math.min((stats.totalWater / (stats.goals.waterGoal * stats.totalEntries)) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>Сон</span>
                            <span>{Math.round((stats.averageSleep / stats.goals.sleepGoal) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-purple-600 h-2 rounded-full" 
                                style={{ width: `${Math.min((stats.averageSleep / stats.goals.sleepGoal) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>Активність</span>
                            <span>{Math.round((stats.totalActivity / (stats.goals.activityGoal * stats.totalEntries)) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${Math.min((stats.totalActivity / (stats.goals.activityGoal * stats.totalEntries)) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserStats; 