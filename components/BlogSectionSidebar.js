"use client";

import { useState, useEffect } from 'react';

export default function BlogSectionSidebar({ headings = [] }) {
    const [activeSection, setActiveSection] = useState('');

    // Track active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            try {
                const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

                if (headingElements.length === 0) return;

                // Find the heading that is currently at the top of the viewport
                let current = '';
                headingElements.forEach((heading) => {
                    if (!heading.id) return;
                    const rect = heading.getBoundingClientRect();
                    if (rect.top <= 100) {
                        current = heading.id;
                    }
                });

                setActiveSection(current);
            } catch (error) {
                console.error('Error in scroll handler:', error);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Call once on mount

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // If no headings, show empty sidebar with message
    if (!headings || headings.length === 0) {
        return (
            <div className="hidden lg:flex sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto p-4 w-64 border-r border-gray-200 dark:border-gray-700 custom-scrollbar flex-shrink-0">
                <div className="w-full">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
                        Table of Contents
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        No sections available for this content.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="hidden lg:flex sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto p-4 w-64 border-r border-gray-200 dark:border-gray-700 custom-scrollbar flex-shrink-0">
            <div className="w-full">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
                    Table of Contents
                </h3>
                
                <nav>
                    <ul className="space-y-1">
                        {headings.map((heading, index) => {
                            const isActive = activeSection === heading.id;
                            
                            return (
                                <li key={heading.id || index}>
                                    <div
                                        className={`
                                            text-left w-full px-3 py-2 rounded-md transition-all duration-200
                                            relative overflow-hidden cursor-pointer
                                            ${isActive 
                                                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-medium shadow-sm' 
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'}
                                            ${heading.level === 2 ? 'pl-3' : ''}
                                            ${heading.level === 3 ? 'pl-5 text-sm' : ''}
                                            ${heading.level === 4 ? 'pl-7 text-sm' : ''}
                                            ${heading.level > 4 ? 'pl-9 text-xs' : ''}
                                        `}
                                    >
                                        <span className="relative z-10">{heading.text || 'Untitled Section'}</span>
                                        
                                        {/* Active indicator */}
                                        {isActive && (
                                            <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 dark:bg-blue-400"></span>
                                        )}
                                        
                                        {/* Hover effect overlay */}
                                        <span className={`
                                            absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200
                                            ${isActive ? 'bg-blue-200/30 dark:bg-blue-800/30' : 'bg-blue-100/30 dark:bg-blue-900/10'}
                                        `}></span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </div>
    );
} 