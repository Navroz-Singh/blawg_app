"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Toaster, toast } from "react-hot-toast";
import Link from "next/link";
import { FaHome, FaNewspaper, FaCog, FaQuestionCircle, FaSignOutAlt, FaPen, FaTrash, FaExclamationTriangle, FaSun, FaMoon } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { ThemeContext } from "../../Providers/ThemeProvider";

export default function SettingsPage() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const router = useRouter();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);
        };
        fetchSession();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const handleDeleteAccount = async () => {
        if (!session) return;
        
        setDeleteLoading(true);
        try {
            // Delete the user data from our database
            const res = await fetch(`/api/UserEmail/${session.user.email}`, {
                method: "DELETE",
            });
            
            if (!res.ok) {
                throw new Error('Failed to delete user data');
            }
            
            // Sign out the user
            await supabase.auth.signOut();
            
            toast.success("Account deleted successfully");
            router.push('/');
        } catch (err) {
            console.error("Error deleting account:", err);
            toast.error("Failed to delete account. Please try again later.");
        } finally {
            setDeleteLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <h1 className="text-2xl font-bold mb-4">Please sign in to view your account settings</h1>
                <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Toaster />
            {/* Header with back button and theme toggle */}
            <div className="bg-white dark:bg-gray-800 p-4 shadow-md flex justify-between items-center">
                <button 
                    onClick={() => router.push('/myaccount')}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Account
                </button>
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                    {theme === "light" ? (
                        <FaSun className="w-5 h-5 text-yellow-500" />
                    ) : (
                        <FaMoon className="w-5 h-5 text-white" />
                    )}
                </button>
            </div>
            
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <nav>
                            <ul className="space-y-4">
                                <li>
                                    <Link href="/" className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        <FaHome className="w-5 h-5" />
                                        <span>Home</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/myblogs" className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        <FaNewspaper className="w-5 h-5" />
                                        <span>My Blogs</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/write" className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        <FaPen className="w-5 h-5" />
                                        <span>Write New Blog</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/myaccount/settings" className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-medium transition-colors">
                                        <FaCog className="w-5 h-5" />
                                        <span>Settings</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/help" className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        <FaQuestionCircle className="w-5 h-5" />
                                        <span>Help</span>
                                    </Link>
                                </li>
                                <li className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                                    <button 
                                        onClick={handleSignOut}
                                        className="flex items-center gap-3 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors w-full text-left"
                                    >
                                        <FaSignOutAlt className="w-5 h-5" />
                                        <span>Sign Out</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Account Settings</h1>
                            
                            <div className="space-y-8">
                                {/* Danger Zone */}
                                <div className="border-2 border-red-200 dark:border-red-900/30 rounded-lg p-6">
                                    <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400 flex items-center gap-2">
                                        <FaExclamationTriangle />
                                        Danger Zone
                                    </h2>
                                    
                                    <div className="space-y-4">
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Deleting your account is permanent. All your account information will be removed, but your blogs will remain on the platform.
                                        </p>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 mb-4">
                                            Note: This will remove your user profile and sign you out. For permanent deletion of all your data including blogs, please contact our support team.
                                        </p>
                                        
                                        <button
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center gap-2"
                                            disabled={deleteLoading}
                                        >
                                            <FaTrash className="w-4 h-4" />
                                            Delete My Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                            <FaExclamationTriangle />
                            Delete Account Confirmation
                        </h3>
                        
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            Are you sure you want to delete your account? This action cannot be undone. Your blogs will remain on the platform.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center justify-center gap-2"
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <FaTrash className="w-4 h-4" />
                                        Yes, Delete My Account
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 