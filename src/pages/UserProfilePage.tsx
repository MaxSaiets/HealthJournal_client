import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProfileForm from '../components/Profile/ProfileForm';
import ChangePasswordForm from '../components/Profile/ChangePasswordForm';
import UserStats from '../components/Profile/UserStats';
import ActivityHistory from '../components/Profile/ActivityHistory';
import DeleteAccountModal from '../components/Profile/DeleteAccountModal';
import LoadingSpinner from '../components/Spinner/LoadingSpinner';

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";

import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { WELCOME_ROUTE } from '../consts/routePaths';
import { logoutThunk } from '../store/user/userSlice';

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
    lastLoginAt?: string;
}

interface UserStatsData {
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

const UserProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<UserStatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'stats' | 'history'>('profile');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const reduxUser = useSelector((state: RootState) => state.user.user);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/user/profile');
            setUser(response.data);
        } catch (err: any) {
            console.error('Failed to fetch user profile:', err);
            if (err.response?.status === 401) {
                setError('Помилка авторизації. Будь ласка, увійдіть знову.');
            } else {
                setError('Failed to fetch user profile: ' + (err.response?.data?.message || err.message));
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchUserStats = async () => {
        try {
            const response = await api.get('/user/stats');
            setStats(response.data);
        } catch (err) {
            console.error('Failed to fetch user stats:', err);
        }
    };

    useEffect(() => {
        if (!reduxUser) return;
        fetchUserProfile();
        fetchUserStats();
    }, [reduxUser]);

    useEffect(() => {
        if (!reduxUser) {
            navigate(WELCOME_ROUTE);
        }
    }, [reduxUser, navigate]);

    const handleProfileUpdate = async (updatedData: Partial<User>) => {
        try {
            const response = await api.put('/user/profile', updatedData);
            setUser(response.data);
            return { success: true };
        } catch (err) {
            console.error('Failed to update profile:', err);
            return { success: false, error: err instanceof Error ? err.message : 'Failed to update profile' };
        }
    };

    const handlePasswordChange = async (passwordData: { currentPassword: string; newPassword: string }) => {
        try {
            await api.put('/user/change-password', passwordData);
            return { success: true };
        } catch (err) {
            console.error('Failed to change password:', err);
            return { success: false, error: err instanceof Error ? err.message : 'Failed to change password' };
        }
    };

    const handleDeleteAccount = async (password: string) => {
        try {
            await api.delete('/user/account', { data: { password } });
            window.location.href = '/#/welcome';
            return { success: true };
        } catch (err) {
            console.error('Failed to delete account:', err);
            return { success: false, error: err instanceof Error ? err.message : 'Failed to delete account' };
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner />
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

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-gray-500 text-xl">User not found</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {user.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                user.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                            <p className="text-gray-600">{user.email}</p>
                            {user.lastLoginAt && (
                                <p className="text-sm text-gray-500">
                                    Останній вхід: {new Date(user.lastLoginAt).toLocaleDateString('uk-UA')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'profile', label: 'Профіль' },
                                { id: 'password', label: 'Зміна паролю' },
                                { id: 'stats', label: 'Статистика' },
                                { id: 'history', label: 'Історія' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'profile' && (
                            <ProfileForm user={user} onUpdate={handleProfileUpdate} />
                        )}
                        {activeTab === 'password' && (
                            <ChangePasswordForm onChange={handlePasswordChange} />
                        )}
                        {activeTab === 'stats' && (
                            <UserStats stats={stats} />
                        )}
                        {activeTab === 'history' && (
                            <ActivityHistory />
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Вихід з акаунта</h3>
                        </div>
                        <button
                            onClick={() => dispatch(logoutThunk())}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                        >
                            Вийти з акаунта
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Видалення акаунту</h3>
                            <p className="text-sm text-gray-600">
                                Ця дія незворотна. Всі ваші дані будуть видалені назавжди.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                        >
                            Видалити акаунт
                        </button>
                    </div>
                </div>
            </div>

            {showDeleteModal && (
                <DeleteAccountModal
                    onDelete={handleDeleteAccount}
                    onClose={() => setShowDeleteModal(false)}
                />
            )}
        </div>
    );
};

export default UserProfilePage; 