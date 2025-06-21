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
        <div className="container mx-auto px-4 py-8 bg-[var(--color-background)] min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-[var(--color-primary)]">
                    Мотиваційні цитати
                </h1>
                <p className="text-[var(--color-text-secondary)]">
                    Знайдіть натхнення та мотивацію для здорового способу життя
                </p>
            </div>

            <div className="mb-6">
                <div style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                                    color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                    background: 'none',
                                    fontWeight: 500,
                                    fontSize: '1rem',
                                    padding: '0.5rem 0.25rem',
                                    transition: 'color 0.2s, border-color 0.2s'
                                }}
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