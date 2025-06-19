import {configureStore} from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import reminderReducer from './reminder/reminderSlice';
import quoteReducer from './quote/quoteSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        reminder: reminderReducer,
        quote: quoteReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;