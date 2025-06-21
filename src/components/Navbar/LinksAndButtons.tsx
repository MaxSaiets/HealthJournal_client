import { Link } from "react-router-dom";
import { DASHBOARD_ROUTE, HISTORY_ROUTE, ANALYTICS_ROUTE, USER_PROFILE_ROUTE, REMINDERS_ROUTE, QUOTES_ROUTE } from "../../consts/routePaths";

interface Props {
    isMobile: boolean;
}

const LinksAndButtons = ({ isMobile }: Props) => {

    return (
        <div className={`flex items-center  ${isMobile ? 'flex-col gap-2 [&>*]:w-full [&>*]:text-xl' : 'gap-4'}`}>
            <Link 
                to={DASHBOARD_ROUTE}
                className={`bg-[var(--surface-navbar-btn)] hover:bg-[var(--surface-navbar-btn-hover)] text-[var(--green-dark)] dark:text-[var(--green-accent)] px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
                Головна
            </Link>

            <Link 
                to={HISTORY_ROUTE}
                className={`bg-[var(--surface-navbar-btn)] hover:bg-[var(--surface-navbar-btn-hover)] text-[var(--green-dark)] dark:text-[var(--green-accent)] px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
                Історія
            </Link>

            <Link 
                to={ANALYTICS_ROUTE}
                className={`bg-[var(--surface-navbar-btn)] hover:bg-[var(--surface-navbar-btn-hover)] text-[var(--green-dark)] dark:text-[var(--green-accent)] px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
                Аналітика
            </Link>

            <Link 
                to={QUOTES_ROUTE}
                className={`bg-[var(--surface-navbar-btn)] hover:bg-[var(--surface-navbar-btn-hover)] text-[var(--green-dark)] dark:text-[var(--green-accent)] px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
                Цитати
            </Link>

            <Link 
                to={REMINDERS_ROUTE}
                className={`bg-[var(--surface-navbar-btn)] hover:bg-[var(--surface-navbar-btn-hover)] text-[var(--green-dark)] dark:text-[var(--green-accent)] px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
                Нагадування
            </Link>
            
            <Link 
                to={USER_PROFILE_ROUTE}
                className={`bg-[var(--surface-navbar-btn)] hover:bg-[var(--surface-navbar-btn-hover)] text-[var(--green-dark)] dark:text-[var(--green-accent)] px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
                Профіль
            </Link>

        </div>
    );
};

export default LinksAndButtons;