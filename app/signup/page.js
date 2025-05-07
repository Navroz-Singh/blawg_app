"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../Providers/AuthProvider";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
    const { signIn, signUp, signInWithProvider } = useAuth();
    const [session, setSession] = useState(null);
    const router = useRouter()

    const [signform, setSignform] = useState({
        username: "",
        email: "",
        password: "",
    })

    const fetchSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session)
    }

    const MapUsername_Email = async (username, email) => {
        const res = await fetch(`/api/UserEmail/${email}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, username })
        })
        const data = await res.json();
    }

    if (session) {
        console.log(session.user)
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

    const handleSignInUsingProvider = async (provider) => {
        await signInWithProvider(provider);
    }

    const handleSignUpUsingEmailPassword = async (username, email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        console.log(data, error)
        if (error != null && error.message.includes("User already registered")) {
            toast.error("User already exists.")
        }
        if (error != null && error.message.includes('Password should')) {
            toast(
                "Password must be 8+ chars with at least one lowercase, uppercase, number, and special character.",
                {
                    className:"text-center",
                    duration: 6000,
                }
            );
        }
        if(error!=null && error.message.includes("Unable to validate email address")){
            toast.error("Invalid Email address")
        }
        if (error === null) {
            MapUsername_Email(username, email)
        }
    }

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        console.log(error)
    }

    const handleFormChange = (e, name) => {
        if (e.target.name === name) {
            setSignform({ ...signform, [name]: e.target.value })
        }
    }

    if (!session) {
        return (
            <div className="min-h-[91.2vh] flex items-start pt-10 justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-200">
                <Toaster />
                <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 space-y-4 md:space-y-6 transition-colors duration-200 border border-gray-200 dark:border-gray-700 mt-10 md:mt-0">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                            Create an Account
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Join our community of writers
                        </p>
                    </div>

                    <div className="space-y-4">
                        <input
                            type="text"
                            name="username"
                            value={signform.username}
                            onChange={(e) => handleFormChange(e, "username")}
                            placeholder="Choose a Username"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                        placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                        />
                        <input
                            type="email"
                            name="email"
                            onChange={(e) => handleFormChange(e, "email")}
                            value={signform.email}
                            placeholder="Enter your Email"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                        placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                        />
                        <input
                            type="password"
                            name="password"
                            onChange={(e) => handleFormChange(e, "password")}
                            value={signform.password}
                            placeholder="Enter your Password"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                        placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                        />
                        <button
                            onClick={() => handleSignUpUsingEmailPassword(signform.username, signform.email, signform.password)}
                            className="w-full py-2 px-4 text-white rounded-lg transition-colors 
                        bg-blue-600 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600
                        focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                Or sign up with
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
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-blue-600 dark:text-blue-400 font-semibold 
                            hover:text-blue-500 dark:hover:text-blue-300 
                            focus:outline-none focus:underline transition-colors"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

            </div>
        );
    }
    else {
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
                            <Link href='/'
                                className="text-blue-600 dark:text-blue-400 font-semibold 
                            hover:text-blue-500 dark:hover:text-blue-300 
                            focus:outline-none focus:underline transition-colors"
                            >
                                Stay Signed In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
};

export default SignUpPage;