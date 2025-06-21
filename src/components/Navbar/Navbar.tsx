import { useState } from "react";
import LinksAndButtons from "./LinksAndButtons";
import { MAIN_ROUTE } from "../../consts/routePaths";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-100 bg-[var(--surface-navbar)] shadow-sm">
            <div className="max-w-screen mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <Link 
                            to={MAIN_ROUTE}
                            className="flex-shrink-0"
                        >
                            <p className="text-base md:text-xl font-bold text-[var(--text-navbar)] select-none">HealthJournal</p>
                        </Link>
                    </div>

                    <button
                        className="sm:hidden text-text focus:outline-none cursor-pointer"
                        onClick={() => setIsMobileMenuOpen(prev => !prev)}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                        </svg>
                    </button>
                    
                    {/* For full nav */}
                    <div className="hidden sm:flex items-center space-x-1 md:space-x-4">
                        <LinksAndButtons 
                            isMobile={false}
                        />
                    </div>

                    {/* Mobile menu */}
                    {isMobileMenuOpen && (
                        <div className="sm:hidden absolute top-0 right-0 w-full h-screen z-50"
                            onClick={() => setIsMobileMenuOpen(prev => !prev)}
                        >
                            <div className="sm:hidden fixed top-13 right-0 flex flex-col gap-2 px-2 py-2 sm:px-4 sm:py-4 bg-secondary border-gray-100 border-2 shadow-md rounded-md z-100">
                                <LinksAndButtons 
                                    isMobile={true}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar;