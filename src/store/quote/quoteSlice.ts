import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { quoteService } from '../../services/quote';
import type { Quote, QuoteFilters, CreateQuoteData, UpdateQuoteData } from '../../types/quote';

interface QuoteState {
    quotes: Quote[];
    currentQuote: Quote | null;
    dailyQuote: Quote | null;
    categories: string[];
    loading: boolean;
    error: string | null;
    filters: QuoteFilters;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalQuotes: number;
    };
}

const initialState: QuoteState = {
    quotes: [],
    currentQuote: null,
    dailyQuote: null,
    categories: [],
    loading: false,
    error: null,
    filters: {
        page: 1,
        limit: 20
    },
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalQuotes: 0
    }
};

// Async thunks
export const fetchQuotes = createAsyncThunk(
    'quote/fetchQuotes',
    async (filters: QuoteFilters = {}, { rejectWithValue }) => {
        try {
            return await quoteService.getAll(filters);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Помилка завантаження цитат');
        }
    }
);

export const fetchRandomQuote = createAsyncThunk(
    'quote/fetchRandomQuote',
    async (filters?: { category?: string; mood?: number }, { rejectWithValue }) => {
        try {
            return await quoteService.getRandom(filters);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Помилка завантаження випадкової цитати');
        }
    }
);

export const fetchDailyQuote = createAsyncThunk(
    'quote/fetchDailyQuote',
    async (_, { rejectWithValue }) => {
        try {
            return await quoteService.getDaily();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Помилка завантаження цитати дня');
        }
    }
);

export const fetchCategories = createAsyncThunk(
    'quote/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            return await quoteService.getCategories();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Помилка завантаження категорій');
        }
    }
);

export const createQuote = createAsyncThunk(
    'quote/createQuote',
    async (data: CreateQuoteData, { rejectWithValue }) => {
        try {
            return await quoteService.create(data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Помилка створення цитати');
        }
    }
);

export const updateQuote = createAsyncThunk(
    'quote/updateQuote',
    async ({ id, data }: { id: string; data: UpdateQuoteData }, { rejectWithValue }) => {
        try {
            return await quoteService.update(id, data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Помилка оновлення цитати');
        }
    }
);

export const deleteQuote = createAsyncThunk(
    'quote/deleteQuote',
    async (id: string, { rejectWithValue }) => {
        try {
            await quoteService.delete(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Помилка видалення цитати');
        }
    }
);

const quoteSlice = createSlice({
    name: 'quote',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<QuoteFilters>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = { page: 1, limit: 20 };
        },
        setCurrentQuote: (state, action: PayloadAction<Quote | null>) => {
            state.currentQuote = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchQuotes
            .addCase(fetchQuotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuotes.fulfilled, (state, action) => {
                state.loading = false;
                state.quotes = action.payload.quotes;
                state.pagination = {
                    currentPage: action.payload.currentPage,
                    totalPages: action.payload.totalPages,
                    totalQuotes: action.payload.totalQuotes
                };
            })
            .addCase(fetchQuotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // fetchRandomQuote
            .addCase(fetchRandomQuote.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRandomQuote.fulfilled, (state, action) => {
                state.loading = false;
                state.currentQuote = action.payload;
            })
            .addCase(fetchRandomQuote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // fetchDailyQuote
            .addCase(fetchDailyQuote.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDailyQuote.fulfilled, (state, action) => {
                state.loading = false;
                state.dailyQuote = action.payload;
            })
            .addCase(fetchDailyQuote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // fetchCategories
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // createQuote
            .addCase(createQuote.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createQuote.fulfilled, (state, action) => {
                state.loading = false;
                state.quotes.unshift(action.payload);
            })
            .addCase(createQuote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // updateQuote
            .addCase(updateQuote.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateQuote.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.quotes.findIndex(q => q.id === action.payload.id);
                if (index !== -1) {
                    state.quotes[index] = action.payload;
                }
                if (state.currentQuote?.id === action.payload.id) {
                    state.currentQuote = action.payload;
                }
                if (state.dailyQuote?.id === action.payload.id) {
                    state.dailyQuote = action.payload;
                }
            })
            .addCase(updateQuote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // deleteQuote
            .addCase(deleteQuote.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteQuote.fulfilled, (state, action) => {
                state.loading = false;
                state.quotes = state.quotes.filter(q => q.id !== action.payload);
                if (state.currentQuote?.id === action.payload) {
                    state.currentQuote = null;
                }
                if (state.dailyQuote?.id === action.payload) {
                    state.dailyQuote = null;
                }
            })
            .addCase(deleteQuote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { setFilters, clearFilters, setCurrentQuote, clearError } = quoteSlice.actions;
export default quoteSlice.reducer; 