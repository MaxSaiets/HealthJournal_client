import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reminderService } from '../../services/reminder';
import type { Reminder, CreateReminderRequest, UpdateReminderRequest } from '../../types/reminder';

interface ReminderState {
    reminders: Reminder[];
    todayReminders: Reminder[];
    loading: boolean;
    error: string | null;
    currentReminder: Reminder | null;
}

const initialState: ReminderState = {
    reminders: [],
    todayReminders: [],
    loading: false,
    error: null,
    currentReminder: null
};

export const fetchAllReminders = createAsyncThunk(
    'reminder/fetchAll',
    async (active?: boolean) => {
        return await reminderService.getAll(active);
    }
);

export const fetchTodayReminders = createAsyncThunk(
    'reminder/fetchToday',
    async () => {
        return await reminderService.getToday();
    }
);

export const fetchReminderById = createAsyncThunk(
    'reminder/fetchById',
    async (id: string) => {
        return await reminderService.getOne(id);
    }
);

export const createReminder = createAsyncThunk(
    'reminder/create',
    async (data: CreateReminderRequest) => {
        return await reminderService.create(data);
    }
);

export const updateReminder = createAsyncThunk(
    'reminder/update',
    async ({ id, data }: { id: string; data: UpdateReminderRequest }) => {
        return await reminderService.update(id, data);
    }
);

export const toggleReminderActive = createAsyncThunk(
    'reminder/toggleActive',
    async (id: string) => {
        return await reminderService.toggleActive(id);
    }
);

export const deleteReminder = createAsyncThunk(
    'reminder/delete',
    async (id: string) => {
        await reminderService.delete(id);
        return id;
    }
);

const reminderSlice = createSlice({
    name: 'reminder',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentReminder: (state) => {
            state.currentReminder = null;
        },
        setCurrentReminder: (state, action: PayloadAction<Reminder | null>) => {
            state.currentReminder = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllReminders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllReminders.fulfilled, (state, action) => {
                state.loading = false;
                state.reminders = action.payload;
            })
            .addCase(fetchAllReminders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Помилка завантаження нагадувань';
            });

        builder
            .addCase(fetchTodayReminders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTodayReminders.fulfilled, (state, action) => {
                state.loading = false;
                state.todayReminders = action.payload;
            })
            .addCase(fetchTodayReminders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Помилка завантаження нагадувань на сьогодні';
            });

        builder
            .addCase(fetchReminderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReminderById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentReminder = action.payload;
            })
            .addCase(fetchReminderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Помилка завантаження нагадування';
            });

        builder
            .addCase(createReminder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReminder.fulfilled, (state, action) => {
                state.loading = false;
                state.reminders.push(action.payload);
                if (action.payload.isActive) {
                    state.todayReminders.push(action.payload);
                }
            })
            .addCase(createReminder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Помилка створення нагадування';
            });

        builder
            .addCase(updateReminder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateReminder.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.reminders.findIndex(r => r.id === action.payload.id);
                if (index !== -1) {
                    state.reminders[index] = action.payload;
                }
                if (state.currentReminder?.id === action.payload.id) {
                    state.currentReminder = action.payload;
                }
            })
            .addCase(updateReminder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Помилка оновлення нагадування';
            });

        builder
            .addCase(toggleReminderActive.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleReminderActive.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.reminders.findIndex(r => r.id === action.payload.id);
                if (index !== -1) {
                    state.reminders[index] = action.payload;
                }
                if (state.currentReminder?.id === action.payload.id) {
                    state.currentReminder = action.payload;
                }
            })
            .addCase(toggleReminderActive.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Помилка зміни статусу нагадування';
            });

        builder
            .addCase(deleteReminder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteReminder.fulfilled, (state, action) => {
                state.loading = false;
                state.reminders = state.reminders.filter(r => r.id !== action.payload);
                state.todayReminders = state.todayReminders.filter(r => r.id !== action.payload);
                if (state.currentReminder?.id === action.payload) {
                    state.currentReminder = null;
                }
            })
            .addCase(deleteReminder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Помилка видалення нагадування';
            });
    }
});

export const { clearError, clearCurrentReminder, setCurrentReminder } = reminderSlice.actions;
export default reminderSlice.reducer; 