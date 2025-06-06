'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TextEditor from './TextEditor';
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from '@/app/Providers/AuthProvider';

export default function EditBlog({ blog, blogId }) {
    const [content, setContent] = useState(blog.description || '');
    const [loading, setLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Set the initial content once the blog data is loaded
        if (blog && blog.description) {
            setContent(blog.description);
            setIsLoaded(true);
        }
    }, [blog]);

    // Check if the current user is the blog creator
    useEffect(() => {
        if (user && blog && user.email !== blog.email) {
            toast.error("You don't have permission to edit this blog");
            router.push(`/blogs/${blogId}`);
        }
    }, [user, blog, blogId, router]);

    const handleUpdate = async () => {
        if (!user) {
            toast.error('Please login to update this blog.');
            return;
        }
        
        if (!content.trim()) {
            toast.error('Content is required!');
            return;
        }
        
        setLoading(true);
        try {
            const res = await fetch('/api/Blogs/updateblog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    blogId,
                    description: content,
                    userEmail: user.email
                })
            });
            
            if (res.ok) {
                toast.success('Blog updated successfully!');
                // Redirect back to the blog page
                router.push(`/blogs/${blogId}`);
            } else {
                const err = await res.json();
                toast.error('Failed: ' + (err.error || 'Unknown error'));
            }
        } catch (err) {
            toast.error('Failed to update blog.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push(`/blogs/${blogId}`);
    };

    if (!isLoaded) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <Toaster />
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Blog Post</h1>
            
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{blog.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    You can only edit the content of your blog post.
                </p>
            </div>
            
            <TextEditor value={content} onChange={setContent} />
            
            <div className="flex justify-end gap-4 mt-6">
                <button 
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    onClick={handleCancel}
                >
                    Cancel
                </button>
                <button 
                    className="px-6 py-3 bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105"
                    onClick={handleUpdate}
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update Post'}
                </button>
            </div>
        </div>
    );
} 