'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';

interface AuthContextType {
    isAuthenticated: boolean;
    role: string;
    login: () => void;
    logout: () => void;
    setCurrentRole: (role: React.SetStateAction<string>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState<string>("student");

    const activeAccount = useActiveAccount();
    const pathName = usePathname();
    const router = useRouter();

    useEffect(() => {
        console.log("Address management with active account:", activeAccount);
        if (pathName == "/") {
            if (isAuthenticated) { router.push("/process") };
        }
        else {
            if (!isAuthenticated || !activeAccount) router.push("/");
        }
    }, [isAuthenticated, activeAccount, pathName, router]);

    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);
    const setCurrentRole = (role: React.SetStateAction<string>) => setRole(role);

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout, setCurrentRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};