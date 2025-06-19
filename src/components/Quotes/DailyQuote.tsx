import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchDailyQuote } from '../../store/quote/quoteSlice';

const DailyQuote: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { dailyQuote, loading, error } = useSelector((state: RootState) => state.quote);

    useEffect(() => {
        dispatch(fetchDailyQuote());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 shadow-sm">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">Помилка завантаження цитати дня</p>
            </div>
        );
    }

    if (!dailyQuote) {
        return (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-500">Цитата дня недоступна</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-6 py-3 shadow-sm border border-blue-100">
            <div className="mb-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Цитата дня
                </h3>
                <div className="w-12 h-1 bg-blue-400 rounded"></div>
            </div>
            
            <blockquote className="mb-2">
                <p className="text-gray-700 text-lg italic leading-relaxed">
                    "{dailyQuote.text}"
                </p>
            </blockquote>
            
            {dailyQuote.author && (
                <footer className="text-right">
                    <cite className="text-gray-600 font-medium">
                        — {dailyQuote.author}
                    </cite>
                </footer>
            )}
            
            {dailyQuote.category && (
                <div className="">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {dailyQuote.category}
                    </span>
                </div>
            )}
        </div>
    );
};

export default DailyQuote; 