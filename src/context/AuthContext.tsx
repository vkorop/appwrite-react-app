import { getCurrentUser } from "@/lib/appwrite/api";
import { IUser } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const INITIAL_USER = {
    id: "",
    name: "",
    username: "",
    email: "",
    imageURL: "",
    bio: "",
};

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: () => Promise.resolve(false),
};

type IContextType = {
    user: IUser;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: () => Promise<boolean>;
  };

const AuthContext = createContext<IContextType>(INITIAL_STATE);
  
export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const navigate = useNavigate();

    const value = {
        user,
        setUser,
        isLoading,
        setIsLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,
    };

    async function checkAuthUser() {
        const user = await getCurrentUser();

        if (user) {
            setUser({
                id: user.$id,
                email: user.email,
                name: user.name,
                username: user.username,
                imageURL: user.imageURL,
                bio: user.bio,
            });

            setIsAuthenticated(true);

            return true;
        }

        setIsAuthenticated(false);

        return false;
    }

    useEffect(() => {
        if (
            localStorage.getItem('cookieFallback') === '[]' ||
            localStorage.getItem('cookieFallback') === null
        ) {
            navigate('/sign-in');
        }

        checkAuthUser();
    }, []);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);

