import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        // Check local storage for saved preference
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    useEffect(() => {
        // Save preference to local storage and update document class
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        
        if (darkMode) {
            document.documentElement.classList.add('dark');
            document.documentElement.style.backgroundColor = '#111827';
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.backgroundColor = '#f9fafb';
        }

        // Cleanup function to ensure smooth transitions
        return () => {
            document.documentElement.style.backgroundColor = '';
        };
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    // Render children immediately without any wrapper div
    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}; 