import { useState, useEffect } from "react";
import mobileWelcome from "../../assets/welcomeImgHealth.svg";
import AuthPopup from "../Popups/AuthPopup/AuthPopup"; 

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch} from "../../store/store";
import { getCurrentUser } from "../../store/user/userSlice";

import { useNavigate } from "react-router-dom";
import { DASHBOARD_ROUTE } from "../../consts/routePaths";
import LoadingSpinner from "../Spinner/LoadingSpinner";

const Welcome = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const isLoading = useSelector((state: RootState) => state.user.isLoading);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [isAuthPopupOpen, setIsAuthPopupOpen] = useState<boolean>(false);
    const token = localStorage.getItem('token');
    const [isAuthCheckInProgress, setIsAuthCheckInProgress] = useState(false);

    const handleClick = () => {
        setIsAuthPopupOpen(true);
    }
    
    const features = [
        {
            title: "Щоденне самопочуття",
            description: "Записуйте свій настрій, сон, фізичну активність і рівень гідратації щодня",
            icon: "📝"
        },
        {
            title: "Персональний профіль",
            description: "Керуйте своїм профілем, редагуйте записи та аналізуйте прогрес",
            icon: "👤"
        },
        {
            title: "Статистика у графіках",
            description: "Візуально відстежуйте зміни у своєму здоров'ї за допомогою графіків",
            icon: "📊"
        },
        {
            title: "Безпечне збереження даних",
            description: "Ваші записи зберігаються в надійній базі даних — доступні лише вам",
            icon: "🔒"
        }
    ];

    useEffect(() => {
        if (!token || user || isAuthCheckInProgress) return;
        setIsAuthCheckInProgress(true);
        dispatch(getCurrentUser()).unwrap()
            .catch(() => {
                localStorage.removeItem('token');
            })
            .finally(() => setIsAuthCheckInProgress(false));
    }, [dispatch, token, user, isAuthCheckInProgress]);

    useEffect(() => {
        if (user) {
            navigate(DASHBOARD_ROUTE);
        }
    }, [user, navigate]);
    
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (user) {
        return null;
    }

    return (
        <div className="h-[100dvh] w-screen flex flex-col items-center justify-around py-12 sm:py-8" >
            <div className="max-w-[80vw] text-black flex flex-col items-center justify-center">
                <h1 className="text-3xl sm:text-3xl font-bold">Welcome to</h1>
                
                <h2 className="text-3xl sm:text-3xl leading-normal font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-800">HealthJournal</h2>
                
                <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg text-center">
                    Track your health journey every day!
                </p>
            </div>

            <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-4 max-w-[80vw] my-auto">
                {features.map((feature, index) => (
                    <div key={index} 
                        className="animate-fadeIn opacity-0 flex gap-2" 
                        style={{
                            animation: 'fadeIn 0.8s ease-in-out',
                            animationDelay: `${index * 0.2}s`,
                            animationFillMode: 'forwards'
                        }}
                    >
                        <span className="text-3xl my-auto">{feature.icon}</span>
                        <div className="my-auto">
                            <h3 className="text-base sm:text-lg font-semibold">{feature.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="max-w-[50vh] sm:max-w-[40vh] w-full">
                <img src={mobileWelcome} alt="welcome_image" />
            </div>

            <div className="min-w-[80vw] sm:min-w-[50vw] md:min-w-[30vw]">
                <button 
                    className="w-full bg-green-300 text-black text-2xl sm:text-xl font-bold items-center justify-center py-2.5 sm:py-2 rounded-xl hover:bg-green-400 transition-colors duration-300" 
                    onClick={handleClick}
                >
                    Get Started
                </button>
            </div>

            {isAuthPopupOpen && <AuthPopup onClose={() => setIsAuthPopupOpen(false)} />}
        </div>
    );
}

export default Welcome;