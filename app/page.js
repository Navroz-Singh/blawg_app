
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Toaster, toast } from 'react-hot-toast';

export default function Home() {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        sortBy: 'newest', // newest, oldest, mostLiked, mostCommented
        tags: [],
        authors: [],
        year: 'all',
    });
    
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/Blogs/getallblogs');
                if (!res.ok) {
                    throw new Error('Failed to fetch blogs');
                }
                const data = await res.json();
                const blogsData = data.blogs || [];
                setBlogs(blogsData);
                setFilteredBlogs(blogsData);
            } catch (err) {
                console.error('Error fetching blogs:', err);
                setError('Failed to load blogs. Please try again later.');
                toast.error('Failed to load blogs');
            } finally {
                setLoading(false);
            }
        };
        
        fetchBlogs();
    }, []);
    
    // Extract unique tags, authors, and years from blogs
    const [availableTags, setAvailableTags] = useState([]);
    const [availableAuthors, setAvailableAuthors] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);
    
    useEffect(() => {
        if (!blogs.length) return;
        
        // Extract unique tags
        const tagsSet = new Set();
        blogs.forEach(blog => {
            if (blog.tags && Array.isArray(blog.tags)) {
                blog.tags.forEach(tag => tagsSet.add(tag));
            }
        });
        setAvailableTags(Array.from(tagsSet).sort());
        
        // Extract unique authors
        const authorsSet = new Set();
        blogs.forEach(blog => {
            if (blog.username) {
                authorsSet.add(blog.username);
            }
        });
        setAvailableAuthors(Array.from(authorsSet).sort());
        
        // Extract unique years
        const yearsSet = new Set();
        blogs.forEach(blog => {
            if (blog.createdAt && blog.createdAt.seconds) {
                const year = new Date(blog.createdAt.seconds * 1000).getFullYear();
                yearsSet.add(year.toString());
            }
        });
        setAvailableYears(Array.from(yearsSet).sort().reverse());
        
    }, [blogs]);
    
    // Combined search and filter functionality
    useEffect(() => {
        // First apply search
        let searchResults = [...blogs];
        
        if (searchTerm.trim() !== '') {
            const searchTermLower = searchTerm.toLowerCase();
            
            // Calculate relevance score for each blog based on title match
            const scoredBlogs = blogs.map(blog => {
                const title = (blog.title || '').toLowerCase();
                let score = 0;
                
                // Exact match gets highest score
                if (title === searchTermLower) {
                    score = 100;
                }
                // Title starts with search term
                else if (title.startsWith(searchTermLower)) {
                    score = 75;
                }
                // Title contains search term
                else if (title.includes(searchTermLower)) {
                    score = 50;
                }
                // Title contains parts of search term
                else {
                    const words = searchTermLower.split(/\s+/);
                    for (const word of words) {
                        if (word.length > 2 && title.includes(word)) {
                            score += 25;
                        }
                    }
                }
                
                return { ...blog, score };
            });
            
            // Filter blogs with a score > 0 and sort by score (highest first)
            searchResults = scoredBlogs
                .filter(blog => blog.score > 0)
                .sort((a, b) => b.score - a.score);
        }
        
        // Then apply filters
        let filteredResults = searchResults;
        
        // Filter by tags
        if (filters.tags.length > 0) {
            filteredResults = filteredResults.filter(blog => {
                if (!blog.tags || !Array.isArray(blog.tags)) return false;
                return filters.tags.some(tag => blog.tags.includes(tag));
            });
        }
        
        // Filter by authors
        if (filters.authors.length > 0) {
            filteredResults = filteredResults.filter(blog => 
                filters.authors.includes(blog.username)
            );
        }
        
        // Filter by year
        if (filters.year !== 'all') {
            filteredResults = filteredResults.filter(blog => {
                if (!blog.createdAt || !blog.createdAt.seconds) return false;
                const blogYear = new Date(blog.createdAt.seconds * 1000).getFullYear().toString();
                return blogYear === filters.year;
            });
        }
        
        // Apply sorting
        filteredResults = [...filteredResults]; // Create a copy to avoid mutation
        
        switch (filters.sortBy) {
            case 'oldest':
                filteredResults.sort((a, b) => {
                    if (!a.createdAt || !b.createdAt) return 0;
                    return (a.createdAt.seconds || 0) - (b.createdAt.seconds || 0);
                });
                break;
            case 'newest':
                filteredResults.sort((a, b) => {
                    if (!a.createdAt || !b.createdAt) return 0;
                    return (b.createdAt.seconds || 0) - (a.createdAt.seconds || 0);
                });
                break;
            case 'mostLiked':
                filteredResults.sort((a, b) => (b.likes || 0) - (a.likes || 0));
                break;
            case 'mostCommented':
                filteredResults.sort((a, b) => {
                    const aComments = a.comments ? a.comments.length : 0;
                    const bComments = b.comments ? b.comments.length : 0;
                    return bComments - aComments;
                });
                break;
            // If there's a search term, we keep the relevance sorting from above
            default:
                if (searchTerm.trim() === '') {
                    // Default to newest if no search term and no sort specified
                    filteredResults.sort((a, b) => {
                        if (!a.createdAt || !b.createdAt) return 0;
                        return (b.createdAt.seconds || 0) - (a.createdAt.seconds || 0);
                    });
                }
        }
        
        setFilteredBlogs(filteredResults);
    }, [searchTerm, blogs, filters]);
    
    function formatDate(timestamp) {
        if (!timestamp) return 'Unknown date';
        try {
            if (timestamp.seconds) {
                const date = new Date(timestamp.seconds * 1000);
                return date.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            } else if (timestamp instanceof Date) {
                return timestamp.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            }
            return 'Unknown date';
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Unknown date';
        }
    }
    
    function truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    }
    
    // Helper functions for filters
    function toggleTag(tag) {
        setFilters(prev => {
            if (prev.tags.includes(tag)) {
                return { ...prev, tags: prev.tags.filter(t => t !== tag) };
            } else {
                return { ...prev, tags: [...prev.tags, tag] };
            }
        });
    }
    
    function toggleAuthor(author) {
        setFilters(prev => {
            if (prev.authors.includes(author)) {
                return { ...prev, authors: prev.authors.filter(a => a !== author) };
            } else {
                return { ...prev, authors: [...prev.authors, author] };
            }
        });
    }
    
    function setSortBy(sortOption) {
        setFilters(prev => ({ ...prev, sortBy: sortOption }));
    }
    
    function setYear(year) {
        setFilters(prev => ({ ...prev, year }));
    }
    
    function resetFilters() {
        setFilters({
            sortBy: 'newest',
            tags: [],
            authors: [],
            year: 'all',
        });
    }
    
    // Close filter dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            const filterContainer = document.getElementById('filter-dropdown');
            if (filterContainer && !filterContainer.contains(event.target) && 
                !event.target.closest('#filter-button')) {
                setShowFilters(false);
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Toaster />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-800 dark:from-blue-800 dark:to-indigo-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight">
                            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">Blawg</span>
                        </h1>
                        <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
                            Discover interesting stories, insights, and ideas from writers around the world.
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Section - Blog Posts (75%) */}
                    <div className="w-full lg:w-3/4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 border-b pb-4 border-gray-200 dark:border-gray-700">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Latest Articles
                            </h2>
                            
                            <div className="mt-4 md:mt-0 relative">
                                <button 
                                    id="filter-button"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Filter</span>
                                    {(filters.tags.length > 0 || filters.authors.length > 0 || filters.year !== 'all' || filters.sortBy !== 'newest') && (
                                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full">
                                            {filters.tags.length + filters.authors.length + (filters.year !== 'all' ? 1 : 0) + (filters.sortBy !== 'newest' ? 1 : 0)}
                                        </span>
                                    )}
                                </button>
                                
                                {showFilters && (
                                    <div 
                                        id="filter-dropdown"
                                        className="absolute right-0 mt-2 w-72 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
                                    >
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
                                                <button 
                                                    onClick={resetFilters}
                                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                                >
                                                    Reset all
                                                </button>
                                            </div>
                                            
                                            {/* Sort options */}
                                            <div className="mb-4">
                                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort by</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {[
                                                        { id: 'newest', label: 'Newest first' },
                                                        { id: 'oldest', label: 'Oldest first' },
                                                        { id: 'mostLiked', label: 'Most liked' },
                                                        { id: 'mostCommented', label: 'Most commented' }
                                                    ].map(option => (
                                                        <button
                                                            key={option.id}
                                                            onClick={() => setSortBy(option.id)}
                                                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                                                                filters.sortBy === option.id 
                                                                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-medium' 
                                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                            }`}
                                                        >
                                                            {option.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {/* Year filter */}
                                            {availableYears.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Publication year</h4>
                                                    <select
                                                        value={filters.year}
                                                        onChange={(e) => setYear(e.target.value)}
                                                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200"
                                                    >
                                                        <option value="all">All years</option>
                                                        {availableYears.map(year => (
                                                            <option key={year} value={year}>{year}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            
                                            {/* Tags filter */}
                                            {availableTags.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Tags {filters.tags.length > 0 && `(${filters.tags.length} selected)`}
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                                                        {availableTags.map(tag => (
                                                            <button
                                                                key={tag}
                                                                onClick={() => toggleTag(tag)}
                                                                className={`px-2 py-1 text-xs rounded-full transition-colors ${
                                                                    filters.tags.includes(tag)
                                                                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-medium' 
                                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                                }`}
                                                            >
                                                                {tag}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Authors filter */}
                                            {availableAuthors.length > 0 && (
                                                <div className="mb-2">
                                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Authors {filters.authors.length > 0 && `(${filters.authors.length} selected)`}
                                                    </h4>
                                                    <div className="flex flex-col gap-1 max-h-32 overflow-y-auto p-1">
                                                        {availableAuthors.map(author => (
                                                            <label key={author} className="flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={filters.authors.includes(author)}
                                                                    onChange={() => toggleAuthor(author)}
                                                                    className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                                                                />
                                                                <span className="text-sm text-gray-700 dark:text-gray-300">{author}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg flex justify-between">
                                            <button 
                                                onClick={() => setShowFilters(false)}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors"
                                            >
                                                Close
                                            </button>
                                            
                                            <button 
                                                onClick={() => setShowFilters(false)}
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                                            >
                                                Apply filters
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Active filters */}
                        {(filters.tags.length > 0 || filters.authors.length > 0 || filters.year !== 'all' || filters.sortBy !== 'newest') && (
                            <div className="mb-6 flex flex-wrap gap-2 items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
                                
                                {filters.sortBy !== 'newest' && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm">
                                        Sort: {
                                            filters.sortBy === 'oldest' ? 'Oldest first' :
                                            filters.sortBy === 'mostLiked' ? 'Most liked' :
                                            filters.sortBy === 'mostCommented' ? 'Most commented' : 'Newest first'
                                        }
                                        <button onClick={() => setSortBy('newest')} className="ml-1 text-blue-500 hover:text-blue-700">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                )}
                                
                                {filters.year !== 'all' && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm">
                                        Year: {filters.year}
                                        <button onClick={() => setYear('all')} className="ml-1 text-blue-500 hover:text-blue-700">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                )}
                                
                                {filters.tags.map(tag => (
                                    <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm">
                                        Tag: {tag}
                                        <button onClick={() => toggleTag(tag)} className="ml-1 text-blue-500 hover:text-blue-700">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                                
                                {filters.authors.map(author => (
                                    <span key={author} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm">
                                        Author: {author}
                                        <button onClick={() => toggleAuthor(author)} className="ml-1 text-blue-500 hover:text-blue-700">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                                
                                {(filters.tags.length > 0 || filters.authors.length > 0 || filters.year !== 'all' || filters.sortBy !== 'newest') && (
                                    <button 
                                        onClick={resetFilters} 
                                        className="text-sm text-red-600 dark:text-red-400 hover:underline ml-2"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>
                        )}
                        
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg">
                                {error}
                            </div>
                        ) : blogs.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                <p className="text-xl">No blogs found</p>
                                <p className="mt-2">Be the first to publish something amazing!</p>
                            </div>
                        ) : filteredBlogs.length === 0 && searchTerm.trim() !== '' ? (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                <p className="text-xl">No matching blogs found</p>
                                <p className="mt-2">Try a different search term</p>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                {filteredBlogs.map((blog) => (
                                    <Link href={`/blogs/${blog.id}`} key={blog.id} className="block">
                                        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:translate-y-[-4px] border border-gray-100 dark:border-gray-700">
                                            <div className="flex flex-col md:flex-row">
                                                {/* Featured Image (if available) */}
                                                {blog.featuredImage && (
                                                    <div className="md:w-2/5 h-48 md:h-auto relative">
                                                        <div className="w-full h-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                                            <svg className="w-12 h-12 text-blue-500 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {/* Content */}
                                                <div className={`p-6 md:p-8 flex-1 ${!blog.featuredImage ? 'md:w-full' : ''}`}>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                                                            {blog.username ? blog.username[0].toUpperCase() : 'A'}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-900 dark:text-white">{blog.username || 'Anonymous'}</span>
                                                            <span className="mx-2 text-gray-400">•</span>
                                                            <span className="text-gray-500 dark:text-gray-400 text-sm">{formatDate(blog.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                                                        {blog.title}
                                                    </h3>
                                                    
                                                    <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                                                        {truncateText(blog.description, 200)}
                                                    </p>
                                                    
                                                    <div className="flex flex-wrap gap-2 mb-6">
                                                        {blog.tags && blog.tags.map((tag, idx) => (
                                                            <span key={idx} className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-6">
                                                            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M20.9752 12.1852L20.2361 12.0574L20.9752 12.1852ZM20.2696 16.265L19.5306 16.1371L20.2696 16.265ZM6.93777 20.4771L6.19056 20.5417L6.93777 20.4771ZM6.12561 11.0844L6.87282 11.0198L6.12561 11.0844ZM13.995 5.22142L14.7351 5.34269V5.34269L13.995 5.22142ZM13.3323 9.26598L14.0724 9.38725V9.38725L13.3323 9.26598ZM6.69814 9.67749L6.20855 9.10933H6.20855L6.69814 9.67749ZM8.13688 8.43769L8.62647 9.00585H8.62647L8.13688 8.43769ZM10.5181 4.78374L9.79208 4.59542L10.5181 4.78374ZM10.9938 2.94989L11.7197 3.13821V3.13821L10.9938 2.94989ZM12.6676 2.06435L12.4382 2.77841L12.4382 2.77841L12.6676 2.06435ZM12.8126 2.11093L13.042 1.39687L13.042 1.39687L12.8126 2.11093ZM9.86195 6.46262L10.5235 6.81599V6.81599L9.86195 6.46262ZM13.9047 3.24752L13.1787 3.43584V3.43584L13.9047 3.24752ZM11.6742 2.13239L11.3486 1.45675V1.45675L11.6742 2.13239ZM3.9716 21.4707L3.22439 21.5353L3.9716 21.4707ZM3 10.2342L3.74721 10.1696C3.71261 9.76945 3.36893 9.46758 2.96767 9.4849C2.5664 9.50221 2.25 9.83256 2.25 10.2342H3ZM20.2361 12.0574L19.5306 16.1371L21.0087 16.3928L21.7142 12.313L20.2361 12.0574ZM13.245 21.25H8.59635V22.75H13.245V21.25ZM7.68498 20.4125L6.87282 11.0198L5.3784 11.149L6.19056 20.5417L7.68498 20.4125ZM19.5306 16.1371C19.0238 19.0677 16.3813 21.25 13.245 21.25V22.75C17.0712 22.75 20.3708 20.081 21.0087 16.3928L19.5306 16.1371ZM13.2548 5.10015L12.5921 9.14472L14.0724 9.38725L14.7351 5.34269L13.2548 5.10015ZM7.18773 10.2456L8.62647 9.00585L7.64729 7.86954L6.20855 9.10933L7.18773 10.2456ZM11.244 4.97206L11.7197 3.13821L10.2678 2.76157L9.79208 4.59542L11.244 4.97206ZM12.4382 2.77841L12.5832 2.82498L13.042 1.39687L12.897 1.3503L12.4382 2.77841ZM10.5235 6.81599C10.8354 6.23198 11.0777 5.61339 11.244 4.97206L9.79208 4.59542C9.65573 5.12107 9.45699 5.62893 9.20042 6.10924L10.5235 6.81599ZM12.5832 2.82498C12.8896 2.92342 13.1072 3.16009 13.1787 3.43584L14.6307 3.05921C14.4252 2.26719 13.819 1.64648 13.042 1.39687L12.5832 2.82498ZM11.7197 3.13821C11.7548 3.0032 11.8523 2.87913 11.9998 2.80804L11.3486 1.45675C10.8166 1.71309 10.417 2.18627 10.2678 2.76157L11.7197 3.13821ZM11.9998 2.80804C12.1345 2.74311 12.2931 2.73181 12.4382 2.77841L12.897 1.3503C12.3873 1.18655 11.8312 1.2242 11.3486 1.45675L11.9998 2.80804ZM14.1537 10.9842H19.3348V9.4842H14.1537V10.9842ZM4.71881 21.4061L3.74721 10.1696L2.25279 10.2988L3.22439 21.5353L4.71881 21.4061ZM3.75 21.5127V10.2342H2.25V21.5127H3.75ZM3.22439 21.5353C3.2112 21.3828 3.33146 21.25 3.48671 21.25V22.75C4.21268 22.75 4.78122 22.1279 4.71881 21.4061L3.22439 21.5353ZM14.7351 5.34269C14.8596 4.58256 14.8241 3.80477 14.6307 3.0592L13.1787 3.43584C13.3197 3.97923 13.3456 4.54613 13.2548 5.10016L14.7351 5.34269ZM8.59635 21.25C8.12244 21.25 7.72601 20.887 7.68498 20.4125L6.19056 20.5417C6.29852 21.7902 7.3427 22.75 8.59635 22.75V21.25ZM8.62647 9.00585C9.30632 8.42 10.0392 7.72267 10.5235 6.81599L9.20042 6.10924C8.85404 6.75767 8.3025 7.30493 7.64729 7.86954L8.62647 9.00585ZM21.7142 12.313C21.9695 10.8365 20.8341 9.4842 19.3348 9.4842V10.9842C19.9014 10.9842 20.3332 11.4959 20.2361 12.0574L21.7142 12.313ZM3.48671 21.25C3.63292 21.25 3.75 21.3684 3.75 21.5127H2.25C2.25 22.1953 2.80289 22.75 3.48671 22.75V21.25ZM12.5921 9.14471C12.4344 10.1076 13.1766 10.9842 14.1537 10.9842V9.4842C14.1038 9.4842 14.0639 9.43901 14.0724 9.38725L12.5921 9.14471ZM6.87282 11.0198C6.8474 10.7258 6.96475 10.4378 7.18773 10.2456L6.20855 9.10933C5.62022 9.61631 5.31149 10.3753 5.3784 11.149L6.87282 11.0198Z" />
                                                                </svg>
                                                                <span>{blog.likes || 0}</span>
                                                            </span>
                                                            
                                                            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                                <svg className="w-5 h-5" viewBox="0 -0.5 25 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M9.0001 8.517C8.58589 8.517 8.2501 8.85279 8.2501 9.267C8.2501 9.68121 8.58589 10.017 9.0001 10.017V8.517ZM16.0001 10.017C16.4143 10.017 16.7501 9.68121 16.7501 9.267C16.7501 8.85279 16.4143 8.517 16.0001 8.517V10.017ZM9.8751 11.076C9.46089 11.076 9.1251 11.4118 9.1251 11.826C9.1251 12.2402 9.46089 12.576 9.8751 12.576V11.076ZM15.1251 12.576C15.5393 12.576 15.8751 12.2402 15.8751 11.826C15.8751 11.4118 15.5393 11.076 15.1251 11.076V12.576ZM9.1631 5V4.24998L9.15763 4.25002L9.1631 5ZM15.8381 5L15.8438 4.25H15.8381V5ZM19.5001 8.717L18.7501 8.71149V8.717H19.5001ZM19.5001 13.23H18.7501L18.7501 13.2355L19.5001 13.23ZM18.4384 15.8472L17.9042 15.3207L17.9042 15.3207L18.4384 15.8472ZM15.8371 16.947V17.697L15.8426 17.697L15.8371 16.947ZM9.1631 16.947V16.197C9.03469 16.197 8.90843 16.23 8.79641 16.2928L9.1631 16.947ZM5.5001 19H4.7501C4.7501 19.2662 4.89125 19.5125 5.12097 19.6471C5.35068 19.7817 5.63454 19.7844 5.86679 19.6542L5.5001 19ZM5.5001 8.717H6.25012L6.25008 8.71149L5.5001 8.717ZM6.56175 6.09984L6.02756 5.5734H6.02756L6.56175 6.09984ZM9.0001 10.017H16.0001V8.517H9.0001V10.017ZM9.8751 12.576H15.1251V11.076H9.8751V12.576ZM9.1631 5.75H15.8381V4.25H9.1631V5.75ZM15.8324 5.74998C17.4559 5.76225 18.762 7.08806 18.7501 8.71149L20.2501 8.72251C20.2681 6.2708 18.2955 4.26856 15.8438 4.25002L15.8324 5.74998ZM18.7501 8.717V13.23H20.2501V8.717H18.7501ZM18.7501 13.2355C18.7558 14.0153 18.4516 14.7653 17.9042 15.3207L18.9726 16.3736C19.7992 15.5348 20.2587 14.4021 20.2501 13.2245L18.7501 13.2355ZM17.9042 15.3207C17.3569 15.8761 16.6114 16.1913 15.8316 16.197L15.8426 17.697C17.0201 17.6884 18.1461 17.2124 18.9726 16.3736L17.9042 15.3207ZM15.8371 16.197H9.1631V17.697H15.8371V16.197ZM8.79641 16.2928L5.13341 18.3458L5.86679 19.6542L9.52979 17.6012L8.79641 16.2928ZM6.2501 19V8.717H4.7501V19H6.2501ZM6.25008 8.71149C6.24435 7.93175 6.54862 7.18167 7.09595 6.62627L6.02756 5.5734C5.20098 6.41216 4.74147 7.54494 4.75012 8.72251L6.25008 8.71149ZM7.09595 6.62627C7.64328 6.07088 8.38882 5.75566 9.16857 5.74998L9.15763 4.25002C7.98006 4.2586 6.85413 4.73464 6.02756 5.5734L7.09595 6.62627Z" />
                                                                </svg>
                                                                <span>{blog.comments ? blog.comments.length : 0}</span>
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="flex items-center">
                                                            <span className="text-blue-600 dark:text-blue-400 font-medium text-sm flex items-center gap-1 group">
                                                                Read Article
                                                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                                </svg>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Right Section (25%) */}
                    <div className="w-full lg:w-1/4">
                        <div className="sticky top-20">
                            {/* Search Bar */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Search Blogs</h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search by title..."
                                        className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                    <svg 
                                        className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                {searchTerm.trim() !== '' && (
                                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        Found {filteredBlogs.length} {filteredBlogs.length === 1 ? 'result' : 'results'}
                                    </div>
                                )}
                            </div>
                            
                            {/* Popular Tags */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Popular Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-sm">Technology</span>
                                    <span className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 px-3 py-1 rounded-full text-sm">Health</span>
                                    <span className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-3 py-1 rounded-full text-sm">Science</span>
                                    <span className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300 px-3 py-1 rounded-full text-sm">Travel</span>
                                    <span className="bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 px-3 py-1 rounded-full text-sm">Food</span>
                                    <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-full text-sm">Art</span>
                                </div>
                            </div>
                            
                            {/* Newsletter Signup */}
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-900 rounded-xl shadow-md p-6 text-white">
                                <h3 className="text-xl font-bold mb-3">Subscribe to our Newsletter</h3>
                                <p className="text-blue-100 mb-4">Get the latest posts delivered right to your inbox.</p>
                                <div className="flex flex-col space-y-2">
                                    <input 
                                        type="email" 
                                        placeholder="Your email address" 
                                        className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                    />
                                    <button className="bg-white text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
