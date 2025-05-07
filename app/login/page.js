"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../Providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";

const Page = () => {
    const { signIn, signInWithProvider } = useAuth();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true)

    const [signform, setSignform] = useState({
        email: "",
        password: ""
    })

    const fetchSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session)
    }
    useEffect(() => {
        fetchSession()

        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
        });
        return () => {
            listener.subscription?.unsubscribe();
        };
    }, [])


    const handleFormChange = (e, name) => {
        if (e.target.name === name) {
            setSignform({ ...signform, [name]: e.target.value })
        }
    }

    const handleSignInUsingProvider = async (provider) => {
        await signInWithProvider(provider);
    }

    const handleSignInUsingEmailPassword = async (email, password) => {
        const {data, error} = await supabase.auth.signInWithPassword({email, password});
        console.log(data, error)
        if(error.message.includes("Invalid login credentials")){
            toast.error("Invalid login credentials")
        }else{
            setSignform({
                email: "",
                password: ""
            });
        }
    }

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
    }

    if (!session) {
        return (
            <div className="min-h-[91.2vh] flex items-start pt-10 justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-200">
                <Toaster />
                <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 space-y-4 md:space-y-6 transition-colors duration-200 border border-gray-200 dark:border-gray-700 mt-10 md:mt-0">
                    <div className="text-center">

                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                            Welcome to Blawg
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Share your thoughts with the world
                        </p>
                    </div>

                    <div className="space-y-4">
                        <input
                            type="email"
                            name="email"
                            value={signform.email}
                            onChange={(e) => handleFormChange(e, "email")}
                            placeholder="Email"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                        placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                        />
                        <input
                            type="password"
                            name="password"
                            value={signform.password}
                            onChange={(e) => handleFormChange(e, "password")}
                            placeholder="Password"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                        placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                        />
                        <button
                            onClick={()=>handleSignInUsingEmailPassword(signform.email, signform.password)}
                            className="w-full py-2 px-4 text-white rounded-lg transition-colors 
                        bg-blue-600 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600
                        focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        >
                            Sign In
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => handleSignInUsingProvider('google')}
                            className="w-full flex items-center justify-center gap-2 py-2 px-4 
                        bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                        rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 
                        transition-colors text-gray-700 dark:text-gray-200
                        focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                        >
                            <FcGoogle className="text-xl" />
                            Continue with Google
                        </button>

                        <button
                            onClick={() => handleSignInUsingProvider('github')}
                            className="w-full flex items-center justify-center gap-2 py-2 px-4 
                        bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                        rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 
                        transition-colors text-gray-700 dark:text-gray-200
                        focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                        >
                            <FaGithub className="text-xl" />
                            Continue with GitHub
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Don't have an account?{" "}
                            <Link
                                href="/signup"
                                className="text-blue-600 dark:text-blue-400 font-semibold 
                            hover:text-blue-500 dark:hover:text-blue-300 
                            focus:outline-none focus:underline transition-colors"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="min-h-screen flex items-start pt-10 md:items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-200">
                <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 space-y-4 md:space-y-6 transition-colors duration-200 border border-gray-200 dark:border-gray-700 mt-10 md:mt-0">
                    <div className="text-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                            Welcome Back!
                        </h1>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                            You're already signed in. Want to log out?
                        </p>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                        <button
                            onClick={handleSignOut}
                            className="w-full py-2 px-4 text-white rounded-lg transition-colors 
                          bg-red-600 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600
                          focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                          text-sm md:text-base"
                        >
                            Log Out
                        </button>

                        <button
                            className="w-full py-2 px-4 text-gray-700 dark:text-gray-200 rounded-lg transition-colors 
                          bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
                          focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                          text-sm md:text-base"
                        >
                            Continue to Dashboard
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                            Changed your mind?{" "}
                            <button
                                className="text-blue-600 dark:text-blue-400 font-semibold 
                            hover:text-blue-500 dark:hover:text-blue-300 
                            focus:outline-none focus:underline transition-colors"
                            >
                                Stay Signed In
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
};

export default Page;