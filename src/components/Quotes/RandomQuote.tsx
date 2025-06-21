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
            <div style={{ background: 'var(--color-surface)' }} className={`rounded-lg p-6 shadow-md ${className}`}>
                <div className="animate-pulse">
                    <div className="h-4 rounded w-3/4 mb-4" style={{ background: 'var(--color-border)' }}></div>
                    <div className="h-4 rounded w-1/2 mb-4" style={{ background: 'var(--color-border)' }}></div>
                    <div className="h-4 rounded w-1/3" style={{ background: 'var(--color-border)' }}></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ background: 'var(--color-error)', color: 'var(--color-surface)', border: '1px solid var(--color-error)' }} className={`rounded-lg p-4 ${className}`}>
                <p className="text-sm mb-2">Помилка завантаження цитати</p>
                {showRefreshButton && (
                    <button
                        onClick={handleRefresh}
                        style={{ color: 'var(--color-surface)', textDecoration: 'underline' }}
                        className="text-sm hover:opacity-80"
                    >
                        Спробувати ще раз
                    </button>
                )}
            </div>
        );
    }

    if (!currentQuote) {
        return (
            <div style={{ background: 'var(--color-surface)' }} className={`rounded-lg p-6 text-center ${className}`}>
                <p style={{ color: 'var(--color-text-secondary)' }}>Цитата недоступна</p>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }} className={`rounded-lg p-6 shadow-md ${className}`}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--color-primary)' }}>
                    Випадкова цитата
                </h3>
                {showRefreshButton && (
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        style={{ color: 'var(--color-primary)' }}
                        className="text-sm font-medium disabled:opacity-50 hover:opacity-80"
                    >
                        {loading ? 'Завантаження...' : 'Оновити'}
                    </button>
                )}
            </div>
            <blockquote className="mb-4">
                <p className="text-lg italic leading-relaxed" style={{ color: 'var(--color-text-main)' }}>
                    "{currentQuote.text}"
                </p>
            </blockquote>
            {currentQuote.author && (
                <footer className="text-right mb-3">
                    <cite style={{ color: 'var(--color-text-secondary)' }} className="font-medium">
                        — {currentQuote.author}
                    </cite>
                </footer>
            )}
            {currentQuote.category && (
                <div className="flex justify-between items-center">
                    <span style={{ background: 'var(--color-accent)', color: 'var(--color-surface)' }} className="inline-block text-xs px-2 py-1 rounded-full">
                        {currentQuote.category}
                    </span>
                </div>
            )}
        </div>
    );
};

export default RandomQuote; 