"use client";
import { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../app/Providers/ThemeProvider';
import Link from 'next/link';
import { FaSun, FaMoon, FaTimes, FaBars } from 'react-icons/fa';
import { UseUsername } from '@/app/Providers/UsernameProvider';
import { supabase } from '@/lib/supabase';
import UserDropdownMenu from './UserDropdownMenu';

export default function Navbar() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { blawgUsername } = UseUsername()
    const [isOpen, setIsOpen] = useState(false);
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session)
        setLoading(false)
    }

    useEffect(() => {
        fetchSession()

        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            setLoading(false)
        });
        return () => {
            listener.subscription?.unsubscribe();
        };
    }, [])


    return (
        <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    <FaBars className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>

                <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                    Blawg
                </Link>


                <ul className="hidden md:flex md:items-center md:gap-8 ml-8 list-none p-0">
                    <li key="home">
                        <Link
                            href="/"
                            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative group transition-colors"
                        >
                            <span className="relative">
                                Home
                                <span className="absolute bottom-[-1.4rem] left-0 h-[3px] bg-current w-0 transition-all duration-300 group-hover:w-full"></span>
                            </span>
                        </Link>
                    </li>
                    <li key="write">
                        <Link
                            href="/write"
                            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative group transition-colors"
                        >
                            <span className="relative">
                                Write
                                <span className="absolute bottom-[-1.4rem] left-0 h-[3px] bg-current w-0 transition-all duration-300 group-hover:w-full"></span>
                            </span>
                        </Link>
                    </li>
                    <li key="myblogs">
                        <Link
                            href="/myblogs"
                            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative group transition-colors"
                        >
                            <span className="relative">
                                My Blogs
                                <span className="absolute bottom-[-1.4rem] left-0 h-[3px] bg-current w-0 transition-all duration-300 group-hover:w-full"></span>
                            </span>
                        </Link>
                    </li>
                </ul>


                <div className={`fixed top-0 ${isOpen ? 'left-0' : '-left-64'} w-64 h-full bg-white dark:bg-gray-900 z-50 shadow-xl transition-all duration-300`}>

                    <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
                        <span className="text-xl font-bold dark:text-white">Sections</span>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            <FaTimes className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        </button>
                    </div>
                    <ul className="p-4">
                        <li key='Home' className="mb-4">
                            <Link
                                href='/'
                                onClick={() => setIsOpen(false)}
                                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative group transition-colors"
                            >
                                <span className="relative">
                                    Home
                                    <span className="absolute bottom-[-0.3rem] left-0 h-[2px] bg-current w-0 transition-all duration-300 group-hover:w-full"></span>
                                </span>
                            </Link>
                        </li>
                        <li key='Write' className="mb-4">
                            <Link
                                href='/write'
                                onClick={() => setIsOpen(false)}
                                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative group transition-colors"
                            >
                                <span className="relative">
                                    Write
                                    <span className="absolute bottom-[-0.3rem] left-0 h-[2px] bg-current w-0 transition-all duration-300 group-hover:w-full"></span>
                                </span>
                            </Link>
                        </li>
                        <li key='myblogs' className="mb-4">
                            <Link
                                href='/myblogs'
                                onClick={() => setIsOpen(false)}
                                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative group transition-colors"
                            >
                                <span className="relative">
                                    My Blogs
                                    <span className="absolute bottom-[-0.3rem] left-0 h-[2px] bg-current w-0 transition-all duration-300 group-hover:w-full"></span>
                                </span>
                            </Link>
                        </li>
                        
                    </ul>
                </div>


                {isOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-1 rounded-md dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        {theme === "light" ? (
                            <FaSun className="w-6 h-6 text-yellow-500" />
                        ) : (
                            <FaMoon className="w-6 h-6 text-white" />
                        )}
                    </button>

                    <div className="flex items-center">
                        {loading ? (
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                            </div>
                        ) : session ? (
                            <UserDropdownMenu 
                                trigger={
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-lg shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl">
                                        {blawgUsername.toUpperCase()[0]}
                                    </div>
                                }
                            />
                        ) : (
                            <Link href='/login'>
                                <button className='px-4 py-2 font-bold text-gray-700 rounded-lg bg-gray-100 hover:bg-gray-200 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-800'>
                                    Sign In
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
