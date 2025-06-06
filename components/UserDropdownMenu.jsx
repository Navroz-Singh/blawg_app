"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaUser, FaUserFriends, FaCog, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function UserDropdownMenu({ trigger }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger element */}
            <div onClick={toggleDropdown} className="cursor-pointer">
                {trigger}
            </div>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 dark:divide-gray-700 z-50">
                    <div className="py-1">
                        <Link href="/myaccount" className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <FaUser className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                            My Account
                        </Link>
                        <Link href="/myaccount/settings" className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <FaCog className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                            Settings
                        </Link>
                        <Link href="/help" className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <FaQuestionCircle className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                            Help
                        </Link>
                    </div>
                    <div className="py-1">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left group flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <FaSignOutAlt className="mr-3 h-5 w-5 text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 