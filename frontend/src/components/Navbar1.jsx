import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import {motion} from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

function Navbar1() {
    const navigate = useNavigate();
    const { isAuthenticated, logout, checkAuthStatus } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const [authState, setAuthState] = useState(false);

    useEffect(() => {
        // Initial auth check
        const initialCheck = async () => {
            const isAuth = await checkAuthStatus();
            setAuthState(isAuth);
        };
        initialCheck();

        // Set up event listeners for auth changes
        const handleAuthChange = async () => {
            const isAuth = await checkAuthStatus();
            setAuthState(isAuth);
        };

        const handleStorageChange = async (e) => {
            if (e.key === 'token' || !e.key) {
                const isAuth = await checkAuthStatus();
                setAuthState(isAuth);
            }
        };

        window.addEventListener('auth-change', handleAuthChange);
        window.addEventListener('storage', handleStorageChange);

        // Check auth status every second for the first 5 seconds
        const interval = setInterval(handleAuthChange, 1000);
        setTimeout(() => clearInterval(interval), 5000);

        return () => {
            window.removeEventListener('auth-change', handleAuthChange);
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [checkAuthStatus]);

    // Update local state when isAuthenticated changes
    useEffect(() => {
        setAuthState(isAuthenticated);
    }, [isAuthenticated]);

    const handleLogout = async () => {
        await logout();
        setAuthState(false);
        navigate('/login');
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            SummarEase
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <FontAwesomeIcon
                                icon={darkMode ? faSun : faMoon}
                                className="text-gray-600 dark:text-gray-300"
                            />
                        </button>

                        {(authState || isAuthenticated) ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                                >
                                    <FontAwesomeIcon icon={faUser} />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar1;
