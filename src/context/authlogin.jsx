import { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; 
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                return jwtDecode(storedToken);
            } catch (error) {
                localStorage.removeItem('token');
                return null;
            }
        }
        return null;
    });

    const login = (jwtToken) => {
        try {
            localStorage.setItem('token', jwtToken);
            const userData = jwtDecode(jwtToken);
            setToken(jwtToken);
            setUser(userData);
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            logout(); 
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
};