"use client"

import { supabase } from '@/lib/supabase';
import React, { createContext, useState, useEffect, useContext } from 'react'


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const session = supabase.auth.getSession();
        setUser(session?.user ?? null);

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => listener?.unsubscribe();
    }, []);


    const signInWithProvider = async (provider) => {
        const { error, user } = await supabase.auth.signInWithOAuth({ provider })
        if (error) throw error;
        return user;
    };


    return (
        <AuthContext.Provider value={{ user, signInWithProvider }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
