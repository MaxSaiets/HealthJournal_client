export interface UserPreferences {
    notifications: boolean;
    emailNotifications: boolean;
    theme: string;
    language: string;
    waterGoal: number;
    sleepGoal: number;
    activityGoal: number;
}

export interface User {
    id: string;
    email: string;
    name: string;
    preferences?: UserPreferences;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    name: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}