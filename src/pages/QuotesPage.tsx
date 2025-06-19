import React, { useState } from 'react';
import DailyQuote from '../components/Quotes/DailyQuote';
import RandomQuote from '../components/Quotes/RandomQuote';
import QuotesList from '../components/Quotes/QuotesList';

const QuotesPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'daily' | 'random' | 'list'>('daily');

    const tabs = [
        { id: 'daily', label: 'Цитата дня' },
        { id: 'random', label: 'Випадкова цитата' },
        { id: 'list', label: 'Всі цитати' }
    ] as const;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Мотиваційні цитати
                </h1>
                <p className="text-gray-600">
                    Знайдіть натхнення та мотивацію для здорового способу життя
                </p>
            </div>

            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
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
            </div>

            <div className="space-y-6">
                {activeTab === 'daily' && (
                    <div className="max-w-2xl">
                        <DailyQuote />
                    </div>
                )}

                {activeTab === 'random' && (
                    <div className="max-w-2xl">
                        <RandomQuote />
                    </div>
                )}

                {activeTab === 'list' && (
                    <QuotesList />
                )}
            </div>
        </div>
    );
};

export default QuotesPage; 