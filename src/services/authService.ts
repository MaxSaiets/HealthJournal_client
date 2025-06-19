import api from './api';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/user';
import { AxiosError } from 'axios';

interface ErrorResponse {
    message: string;
    error?: string;
    stack?: string;
}

class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const { data } = await api.post<AuthResponse>('/auth/login', credentials);
            localStorage.setItem('token', data.token);
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>;
            console.error('Login error:', axiosError.response?.data || axiosError.message);
            throw axiosError.response?.data || { message: 'Login failed' };
        }
    }

    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        try {
            const { data } = await api.post<AuthResponse>('/auth/registration', credentials);
            localStorage.setItem('token', data.token);
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>;
            console.error('Registration error:', axiosError.response?.data || axiosError.message);
            throw axiosError.response?.data || { message: 'Registration failed' };
        }
    }

    async getCurrentUser(): Promise<User> {
        try {
            const { data } = await api.get<User>('/auth/me');
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>;
            console.error('Get current user error:', axiosError.response?.data || axiosError.message);
            throw axiosError.response?.data || { message: 'Failed to get user data' };
        }
    }

    async logout(): Promise<void> {
        try {
            await api.post('/auth/logout');
        } catch {
            // ігноруємо помилки
        }
        localStorage.removeItem('token');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    async refreshToken(): Promise<string> {
        try {
            const { data } = await api.post<{ token: string }>('/auth/refresh');
            localStorage.setItem('token', data.token);
            return data.token;
        } catch {
            this.logout();
            throw new Error('Session expired. Please log in again.');
        }
    }

    async updateProfile(updates: Partial<User>): Promise<User> {
        try {
            const { data } = await api.patch<User>('/auth/me', updates);
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>;
            console.error('Update profile error:', axiosError.response?.data || axiosError.message);
            throw axiosError.response?.data || { message: 'Failed to update profile' };
        }
    }
}

export default new AuthService(); 