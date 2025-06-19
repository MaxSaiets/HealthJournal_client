import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch} from "../../../store/store";
import LoadingSpinner from "../../Spinner/LoadingSpinner";
import { login, register } from "../../../store/user/userSlice";

interface AuthPopupProps {
    onClose: () => void;
}

const AuthPopup = ({ onClose }: AuthPopupProps) => {
    const { isLoading, error } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    };

    const validateForm = () => {
        if (!email || !password || (!isLogin && !name)) {
            setErrorMessage("Please fill in all fields");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage("Please enter a valid email address");
            return false;
        }

        if (password.length < 6) {
            setErrorMessage("Password should be at least 6 characters");
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setErrorMessage(null);
        try {
            if (isLogin) {
                await dispatch(login({ email, password })).unwrap();
            } else {
                await dispatch(register({ email, password, name })).unwrap();
            }
            onClose();
        } catch (err: unknown) {
            if (typeof err === "string") setErrorMessage(err);
            else if (err && typeof err === "object" && "message" in err) setErrorMessage((err as { message: string }).message);
            else setErrorMessage(isLogin ? "Login failed" : "Registration failed");
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setErrorMessage(null);
    };

    return (
        <>
            {isLoading && <LoadingSpinner className="z-9999 fixed inset-0 bg-[rgba(255,255,255,0.4)]" />}
            
            <div onClick={onClose} className="h-[100dvh] fixed inset-0 flex flex-col items-center justify-center backdrop-blur-sm bg-opacity-50 z-100 animate-fadeIn" 
                style={{
                    animation: 'fadeIn 0.4s ease-in-out',
                    animationFillMode: 'forwards'
                }}
            >
                <div onClick={(e) => e.stopPropagation()} className="max-w-[95vw] flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-6 w-full md:max-w-md bg-gradient-to-r from-green-200 to-green-400">
                    <div className="flex flex-col w-full items-center justify-center">
                        <div className="flex justify-end w-full">
                            <button onClick={onClose} className="text-gray-600 hover:text-gray-800 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col w-full items-center justify-center">
                            <div className="text-2xl font-bold mb-6">
                                <h1>{isLogin ? "Welcome Back!" : "Create Account"}</h1>
                            </div>

                            <div className="w-full space-y-4">
                                {!isLogin && (
                                    <div className="relative">
                                        <input 
                                            type="text"
                                            placeholder="Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            onFocus={handleInputFocus}
                                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-green-500 transition-colors"
                                        />
                                    </div>
                                )}

                                <div className="relative">
                                <input 
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={handleInputFocus}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-green-500 transition-colors"
                                />
                                </div>

                                <div className="relative">
                                <input 
                                    type="password"
                                    placeholder="Password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={handleInputFocus}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-green-500 transition-colors"
                                />
                                </div>

                                <button 
                                    className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
                                    onClick={handleSubmit}
                                >
                                    {isLogin ? "Sign In" : "Create Account"}
                                </button>
                            </div>
                        </div>

                        {(errorMessage || error) && (
                            <div className="w-full mt-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
                                {errorMessage || error}
                            </div>
                            )}

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                                <button 
                                    onClick={toggleMode}
                                    className="ml-2 text-green-600 hover:text-green-700 font-semibold transition-colors"
                                >
                                    {isLogin ? "Sign Up" : "Sign In"}
                            </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AuthPopup;