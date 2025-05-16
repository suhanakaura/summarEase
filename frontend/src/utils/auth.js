// Authentication utility functions

export const getAuthToken = () => {
    return localStorage.getItem('token');
};

export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
    } else {
        localStorage.removeItem('token');
    }
};

export const isAuthenticated = () => {
    const token = getAuthToken();
    return !!token;
};

export const clearAuth = () => {
    localStorage.removeItem('token');
};

export const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

// Function to handle common authentication errors
export const handleAuthError = (error, navigate) => {
    console.error('Auth Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401 || error.response?.status === 403) {
        clearAuth();
        navigate('/login');
        return true;
    }
    return false;
}; 