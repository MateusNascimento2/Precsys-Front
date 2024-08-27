import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState(() => {
        // Carregar o estado de auth do localStorage, se existir
        const storedAuth = localStorage.getItem('auth');
        return storedAuth ? JSON.parse(storedAuth) : {};
    });

    const [persist, setPersist] = useState(() => {
        return JSON.parse(localStorage.getItem('persist')) || false;
    });

    useEffect(() => {
        // Salva o estado de auth no localStorage sempre que ele mudar
        if (persist) {
            localStorage.setItem('auth', JSON.stringify(auth));
        }
    }, [auth, persist]);

    return (
        <AuthContext.Provider value={{auth, setAuth, persist, setPersist}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;