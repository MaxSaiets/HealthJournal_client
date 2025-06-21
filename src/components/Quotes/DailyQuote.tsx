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
            <div style={{ background: 'var(--color-surface)' }} className="rounded-lg p-6 shadow-sm">
                <div className="animate-pulse">
                    <div className="h-4 rounded w-3/4 mb-4" style={{ background: 'var(--color-border)' }}></div>
                    <div className="h-4 rounded w-1/2" style={{ background: 'var(--color-border)' }}></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ background: 'var(--color-error)', color: 'var(--color-surface)', border: '1px solid var(--color-error)' }} className="rounded-lg p-4">
                <p className="text-sm">Помилка завантаження цитати дня</p>
            </div>
        );
    }

    if (!dailyQuote) {
        return (
            <div style={{ background: 'var(--color-surface)' }} className="rounded-lg p-6 text-center">
                <p style={{ color: 'var(--color-text-secondary)' }}>Цитата дня недоступна</p>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }} className="rounded-lg px-6 py-3 shadow-sm">
            <div className="mb-1">
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>
                    Цитата дня
                </h3>
                <div className="w-12 h-1 rounded" style={{ background: 'var(--color-accent)' }}></div>
            </div>
            <blockquote className="mb-2">
                <p className="text-lg italic leading-relaxed" style={{ color: 'var(--color-text-main)' }}>
                    "{dailyQuote.text}"
                </p>
            </blockquote>
            {dailyQuote.author && (
                <footer className="text-right">
                    <cite style={{ color: 'var(--color-text-secondary)' }} className="font-medium">
                        — {dailyQuote.author}
                    </cite>
                </footer>
            )}
            {dailyQuote.category && (
                <div>
                    <span style={{ background: 'var(--color-accent)', color: 'var(--color-surface)' }} className="inline-block text-xs px-2 py-1 rounded-full">
                        {dailyQuote.category}
                    </span>
                </div>
            )}
        </div>
    );
};

export default DailyQuote; 