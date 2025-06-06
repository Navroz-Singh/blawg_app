"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Toaster, toast } from "react-hot-toast";
import Link from "next/link";
import { FaHome, FaNewspaper, FaCog, FaQuestionCircle, FaEye, FaThumbsUp, FaThumbsDown, FaEdit, FaEyeSlash, FaSignOutAlt, FaCalendarAlt, FaUserEdit, FaPen, FaSun, FaMoon } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { ThemeContext } from "../Providers/ThemeProvider";

export default function MyAccountPage() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const router = useRouter();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [showEmail, setShowEmail] = useState(false);
    const [editingUsername, setEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [stats, setStats] = useState({
        totalViews: 0,
        totalLikes: 0,
        totalDislikes: 0
    });
    const [joinDate, setJoinDate] = useState("");
    const [lastActive, setLastActive] = useState("");

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            if (session?.user) {
                setEmail(session.user.email || "");
                
                // Get username from user metadata or fetch it
                if (session.user.user_metadata?.full_name) {
                    setUsername(session.user.user_metadata.full_name);
                    setNewUsername(session.user.user_metadata.full_name);
                } else {
                    try {
                        const res = await fetch(`/api/UserEmail/${session.user.email}`);
                        const data = await res.json();
                        setUsername(data);
                        setNewUsername(data);
                    } catch (err) {
                        console.error("Error fetching username:", err);
                    }
                }
                
                // Set join date from user metadata
                if (session.user.created_at) {
                    const date = new Date(session.user.created_at);
                    setJoinDate(date.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    }));
                }
                
                // Set last active date (just using current date for now)
                const now = new Date();
                setLastActive(now.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                }));
            }
            setLoading(false);
        };
        fetchSession();
    }, []);

    useEffect(() => {
        if (!session?.user?.email) return;
        
        const fetchUserStats = async () => {
            try {
                const res = await fetch(`/api/userstats?email=${session.user.email}`);
                if (!res.ok) throw new Error('Failed to fetch user stats');
                const data = await res.json();
                setStats({
                    totalViews: data.totalViews || 0,
                    totalLikes: data.totalLikes || 0,
                    totalDislikes: data.totalDislikes || 0
                });
            } catch (err) {
                console.error("Error fetching user stats:", err);
                toast.error("Failed to load user statistics");
            }
        };
        
        fetchUserStats();
    }, [session]);

    const handleUsernameChange = async () => {
        if (!newUsername.trim()) {
            toast.error("Username cannot be empty");
            return;
        }
        
        try {
            // Update username in database
            const res = await fetch(`/api/UserEmail/${email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, username: newUsername })
            });
            
            if (!res.ok) throw new Error('Failed to update username');
            
            setUsername(newUsername);
            setEditingUsername(false);
            toast.success("Username updated successfully");
        } catch (err) {
            console.error("Error updating username:", err);
            toast.error("Failed to update username");
        }
    };

    const toggleEmailVisibility = () => {
        setShowEmail(!showEmail);
    };

    const maskEmail = (email) => {
        if (!email) return "";
        const [username, domain] = email.split('@');
        return `${username.charAt(0)}${'*'.repeat(username.length - 1)}@${domain}`;
    };
    
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
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
                <h1 className="text-2xl font-bold mb-4">Please sign in to view your account</h1>
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
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Home
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
                                    <Link href="/myaccount/settings" className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
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
                            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">My Account</h1>
                            
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg shadow flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalViews}</p>
                                    </div>
                                    <FaEye className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg shadow flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Likes</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalLikes}</p>
                                    </div>
                                    <FaThumbsUp className="w-8 h-8 text-green-500 dark:text-green-400" />
                                </div>
                                <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg shadow flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Dislikes</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDislikes}</p>
                                    </div>
                                    <FaThumbsDown className="w-8 h-8 text-red-500 dark:text-red-400" />
                                </div>
                            </div>
                            
                            {/* User Information */}
                            <div className="space-y-6">
                                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                    <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Profile Information</h2>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Username</label>
                                            {editingUsername ? (
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={newUsername}
                                                        onChange={(e) => setNewUsername(e.target.value)}
                                                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    />
                                                    <button
                                                        onClick={handleUsernameChange}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingUsername(false);
                                                            setNewUsername(username);
                                                        }}
                                                        className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-700 transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    <p className="text-lg text-gray-800 dark:text-gray-200">{username}</p>
                                                    <button
                                                        onClick={() => setEditingUsername(true)}
                                                        className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                                    >
                                                        <FaEdit className="w-4 h-4" /> Edit
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
                                            <div className="flex items-center justify-between">
                                                <p className="text-lg text-gray-800 dark:text-gray-200">
                                                    {showEmail ? email : maskEmail(email)}
                                                </p>
                                                <button
                                                    onClick={toggleEmailVisibility}
                                                    className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                                >
                                                    {showEmail ? (
                                                        <>
                                                            <FaEyeSlash className="w-4 h-4" /> Hide
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaEye className="w-4 h-4" /> Show
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Account Information</h2>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Member Since</label>
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-gray-500 dark:text-gray-400" />
                                                <p className="text-gray-800 dark:text-gray-200">{joinDate || "Not available"}</p>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Last Active</label>
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-gray-500 dark:text-gray-400" />
                                                <p className="text-gray-800 dark:text-gray-200">{lastActive}</p>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Blog Posts</label>
                                            <div className="flex items-center gap-2">
                                                <FaNewspaper className="text-gray-500 dark:text-gray-400" />
                                                <p className="text-gray-800 dark:text-gray-200">{stats.totalViews > 0 ? "Active blogger" : "No blogs published yet"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Profile Customization</h2>
                                    <div className="flex flex-wrap gap-3">
                                        <Link href="/write" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2">
                                            <FaPen className="w-4 h-4" />
                                            Create New Blog
                                        </Link>
                                        <Link href="/myblogs" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-2">
                                            <FaNewspaper className="w-4 h-4" />
                                            View My Blogs
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 