import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from "../store/store";
import { login, register, logout, getCurrentUser } from '../store/user/userSlice';
import type { LoginCredentials, RegisterCredentials } from '../types/user';

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { user, isLoading, error } = useSelector((state: RootState) => state.user);

    const handleLogin = useCallback(async (credentials: LoginCredentials) => {
        try {
            await dispatch(login(credentials)).unwrap();
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
        }
    }, [dispatch, navigate]);

    const handleRegister = useCallback(async (credentials: RegisterCredentials) => {
        try {
            await dispatch(register(credentials)).unwrap();
            navigate('/');
        } catch (error) {
            console.error('Registration error:', error);
        }
    }, [dispatch, navigate]);

    const handleLogout = useCallback(() => {
        dispatch(logout());
        navigate('/login');
    }, [dispatch, navigate]);

    const checkAuth = useCallback(async () => {
        try {
            await dispatch(getCurrentUser()).unwrap();
        } catch (error) {
            console.error('Auth check error:', error);
        }
    }, [dispatch]);

    return {
        user,
        isLoading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        checkAuth,
    };
}; 