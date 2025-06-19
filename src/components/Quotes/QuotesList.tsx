import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
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
                    <div key={i} className="bg-white rounded-lg p-6 shadow-md">
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Фільтри */}
            <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Фільтри</h3>
                
                <form onSubmit={handleSearch} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Пошук
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Пошук по тексту або автору..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Категорія
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => handleCategoryChange('')}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    selectedCategory === '' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Всі
                            </button>
                            {QUOTE_CATEGORIES.map((category) => (
                                <button
                                    key={category.name}
                                    type="button"
                                    onClick={() => handleCategoryChange(category.name)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        selectedCategory === category.name 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Пошук
                        </button>
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Очистити
                        </button>
                    </div>
                </form>
            </div>

            {/* Результати */}
            <div className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {quotes.length === 0 && !loading ? (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <p className="text-gray-500">Цитати не знайдено</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Результати ({pagination.totalQuotes})
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {quotes.map((quote: Quote) => (
                                <div key={quote.id} className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
                                    <blockquote className="mb-4">
                                        <p className="text-gray-700 text-lg italic leading-relaxed">
                                            "{quote.text}"
                                        </p>
                                    </blockquote>
                                    
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-4">
                                            {quote.author && (
                                                <cite className="text-gray-600 font-medium">
                                                    — {quote.author}
                                                </cite>
                                            )}
                                            {quote.category && (
                                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                    {quote.category}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-gray-400 text-sm">
                                            {formatDate(quote.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Пагінація */}
                        {pagination.totalPages > 1 && (
                            <div className="flex justify-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Попередня
                                </button>
                                
                                <span className="px-3 py-2 text-gray-700">
                                    {pagination.currentPage} з {pagination.totalPages}
                                </span>
                                
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
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