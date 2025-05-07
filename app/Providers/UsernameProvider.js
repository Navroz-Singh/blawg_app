"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase';

const UsernameContext = createContext();

const UsernameProvider = ({ children }) => {
    const [blawgUsername, setblawgUsername] = useState("");

    const fetchSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            if (session?.user?.user_metadata?.full_name != null) {
                setblawgUsername(session?.user?.user_metadata?.full_name);
            }
            else {
                const res = await fetch(`/api/UserEmail/${session?.user?.email}`)
                const data = await res.json();
                setblawgUsername(data);
            }
        }
    }

    useEffect(() => {
        fetchSession()
    }, [])

    return (
        <UsernameContext.Provider value={{ blawgUsername, setblawgUsername }}>
            {children}
        </UsernameContext.Provider>
    )
}

export default UsernameProvider
export const UseUsername = () => useContext(UsernameContext);
