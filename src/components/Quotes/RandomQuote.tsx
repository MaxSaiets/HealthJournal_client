import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchRandomQuote } from '../../store/quote/quoteSlice';
import type { QuoteFilters } from '../../types/quote';

interface RandomQuoteProps {
    filters?: QuoteFilters;
    showRefreshButton?: boolean;
    className?: string;
}

const RandomQuote: React.FC<RandomQuoteProps> = ({ 
    filters, 
    showRefreshButton = true, 
    className = '' 
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentQuote, loading, error } = useSelector((state: RootState) => state.quote);

    const loadRandomQuote = () => {
        dispatch(fetchRandomQuote(filters));
    };

    useEffect(() => {
        loadRandomQuote();
    }, [dispatch]);

    const handleRefresh = () => {
        loadRandomQuote();
    };

    if (loading) {
        return (
            <div className={`bg-white rounded-lg p-6 shadow-md ${className}`}>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
                <p className="text-red-600 text-sm mb-2">Помилка завантаження цитати</p>
                {showRefreshButton && (
                    <button
                        onClick={handleRefresh}
                        className="text-red-600 hover:text-red-800 text-sm underline"
                    >
                        Спробувати ще раз
                    </button>
                )}
            </div>
        );
    }

    if (!currentQuote) {
        return (
            <div className={`bg-gray-50 rounded-lg p-6 text-center ${className}`}>
                <p className="text-gray-500">Цитата недоступна</p>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg p-6 shadow-md border border-gray-100 ${className}`}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    Випадкова цитата
                </h3>
                {showRefreshButton && (
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50"
                    >
                        {loading ? 'Завантаження...' : 'Оновити'}
                    </button>
                )}
            </div>
            
            <blockquote className="mb-4">
                <p className="text-gray-700 text-lg italic leading-relaxed">
                    "{currentQuote.text}"
                </p>
            </blockquote>
            
            {currentQuote.author && (
                <footer className="text-right mb-3">
                    <cite className="text-gray-600 font-medium">
                        — {currentQuote.author}
                    </cite>
                </footer>
            )}
            
            {currentQuote.category && (
                <div className="flex justify-between items-center">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {currentQuote.category}
                    </span>
                </div>
            )}
        </div>
    );
};

export default RandomQuote; 