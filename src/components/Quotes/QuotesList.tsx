import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchQuotes, setFilters, clearFilters } from '../../store/quote/quoteSlice';
import { Quote, QUOTE_CATEGORIES } from '../../types/quote';

const QuotesList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { quotes, loading, error, filters, pagination } = useSelector((state: RootState) => state.quote);
    
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

    useEffect(() => {
        dispatch(fetchQuotes(filters));
    }, [dispatch, filters]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setFilters({ 
            search: searchTerm, 
            category: selectedCategory, 
            page: 1 
        }));
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        dispatch(setFilters({ 
            category, 
            search: searchTerm, 
            page: 1 
        }));
    };

    const handlePageChange = (page: number) => {
        dispatch(setFilters({ ...filters, page }));
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        dispatch(clearFilters());
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('uk-UA');
    };

    if (loading && quotes.length === 0) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-[var(--color-surface)] rounded-lg p-6 shadow-md">
                        <div className="animate-pulse">
                            <div className="h-4 rounded w-3/4 mb-4 bg-[var(--color-border)]"></div>
                            <div className="h-4 rounded w-1/2 mb-4 bg-[var(--color-border)]"></div>
                            <div className="h-4 rounded w-1/3 bg-[var(--color-border)]"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-[var(--color-surface)] rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-[var(--color-primary)]">Фільтри</h3>
                
                <form onSubmit={handleSearch} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                            Пошук
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Пошук по тексту або автору..."
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-[var(--color-border)] text-[var(--color-text-main)] bg-[var(--color-surface)]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                            Категорія
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => handleCategoryChange('')}
                                className={`px-3 py-1 rounded-full text-sm font-medium hover:opacity-90 border border-[var(--color-border)] ${selectedCategory === '' ? 'bg-[var(--color-primary)] text-[var(--color-surface)]' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'}`}
                            >
                                Всі
                            </button>
                            {QUOTE_CATEGORIES.map((category) => (
                                <button
                                    key={category.name}
                                    type="button"
                                    onClick={() => handleCategoryChange(category.name)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium hover:opacity-90 border border-[var(--color-border)] ${selectedCategory === category.name ? 'bg-[var(--color-primary)] text-[var(--color-surface)]' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'}`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 bg-[var(--color-primary)] text-[var(--color-surface)]"
                        >
                            Пошук
                        </button>
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="px-4 py-2 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 bg-[var(--color-border)] text-[var(--color-text-secondary)]"
                        >
                            Очистити
                        </button>
                    </div>
                </form>
            </div>

            <div className="space-y-4">
                {error && (
                    <div className="bg-[var(--color-error)] text-[var(--color-surface)] border border-[var(--color-error)] rounded-lg p-4">
                        <p>{error}</p>
                    </div>
                )}

                {quotes.length === 0 && !loading ? (
                    <div className="bg-[var(--color-surface)] rounded-lg p-8 text-center">
                        <p className="text-[var(--color-text-secondary)]">Цитати не знайдено</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-[var(--color-primary)]">
                                Результати ({pagination.totalQuotes})
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {quotes.map((quote: Quote) => (
                                <div key={quote.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 shadow-md">
                                    <blockquote className="mb-4">
                                        <p className="text-lg italic leading-relaxed text-[var(--color-text-main)]">
                                            "{quote.text}"
                                        </p>
                                    </blockquote>
                                    
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-4">
                                            {quote.author && (
                                                <cite className="font-medium text-[var(--color-text-secondary)]">
                                                    — {quote.author}
                                                </cite>
                                            )}
                                            {quote.category && (
                                                <span className="inline-block text-xs px-2 py-1 rounded-full bg-[var(--color-accent)] text-[var(--color-surface)]">
                                                    {quote.category}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm text-[var(--color-text-secondary)]">
                                            {formatDate(quote.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {pagination.totalPages > 1 && (
                            <div className="flex justify-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                    className="px-3 py-2 rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--color-border)] text-[var(--color-text-secondary)]"
                                >
                                    Попередня
                                </button>
                                
                                <span className="px-3 py-2 text-[var(--color-text-main)]">
                                    {pagination.currentPage} з {pagination.totalPages}
                                </span>
                                
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    className="px-3 py-2 rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--color-border)] text-[var(--color-text-secondary)]"
                                >
                                    Наступна
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default QuotesList; 