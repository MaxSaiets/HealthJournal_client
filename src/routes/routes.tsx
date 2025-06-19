import { createHashRouter } from "react-router-dom";
import { Navigate } from "react-router-dom";

import App from "../App";
import Dashboard from "../pages/DashboardPage";
import History from "../pages/History/History";
import Analytics from "../pages/Analytics/Analytics";
import UserProfilePage from "../pages/UserProfilePage";
import RemindersPage from "../pages/RemindersPage";
import QuotesPage from "../pages/QuotesPage";

import WelcomePage from "../pages/WelcomePage";
import RequireAuth from "../components/Auth/RequireAuth";

import { 
    DASHBOARD_ROUTE, 
    MAIN_ROUTE, 
    HISTORY_ROUTE, 
    ANALYTICS_ROUTE, 
    WELCOME_ROUTE,
    USER_PROFILE_ROUTE,
    QUOTES_ROUTE,
    REMINDERS_ROUTE
} from "../consts/routePaths";

export const router = createHashRouter([
    {
        path: WELCOME_ROUTE,
        element: <WelcomePage />
    },
    {
        path: "/",
        element: 
            <RequireAuth>
                <App />
            </RequireAuth>,
        children: [
            {
                path: MAIN_ROUTE,
                element: <Dashboard />
            },
            {
                path: DASHBOARD_ROUTE,
                element: <Dashboard />
            },
            {
                path: HISTORY_ROUTE,
                element: <History />
            },
            {
                path: ANALYTICS_ROUTE,
                element: <Analytics />
            },
            {
                path: USER_PROFILE_ROUTE,
                element: <UserProfilePage />
            },
            {
                path: REMINDERS_ROUTE,
                element: <RemindersPage />
            },
            {
                path: QUOTES_ROUTE,
                element: <QuotesPage />
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to={WELCOME_ROUTE} replace />
    }
]);
