"use client";

import { useState, useEffect, use } from 'react';
import EditBlog from '@/components/Write_Content/EditBlog';
import { useAuth } from '@/app/Providers/AuthProvider';
import { useRouter } from 'next/navigation';

export default function EditBlogPage({ params }) {
    const { blogid } = use(params);
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`/api/Blogs/getblog?id=${blogid}`, { cache: 'no-store' });

                if (!res.ok) {
                    throw new Error('Failed to fetch blog');
                }

                const { blog } = await res.json();
                setBlog(blog);
            } catch (err) {
                console.error('Error fetching blog:', err);
                setError('Failed to load blog. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [blogid]);

    // Redirect if not logged in
    useEffect(() => {
        if (!loading && user === null) {
            router.push('/login');
        }
    }, [loading, user, router]);

    // Check if user is the blog creator
    useEffect(() => {
        if (!loading && blog && user && blog.email !== user.email) {
            router.push(`/blogs/${blogid}`);
        }
    }, [loading, blog, user, blogid, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
                    <p className="text-gray-700 dark:text-gray-300">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Blog Not Found</h2>
                    <p className="text-gray-700 dark:text-gray-300">The blog you're looking for doesn't exist.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-sm rounded-lg">
                <EditBlog blog={blog} blogId={blogid} />
            </div>
        </div>
    );
} 