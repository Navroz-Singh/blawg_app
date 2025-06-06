'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import TextEditor from './TextEditor';
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from '@/app/Providers/AuthProvider';
import { UseUsername } from '@/app/Providers/UsernameProvider';

export default function CreateBlog() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const { blawgUsername } = UseUsername();
    const [session, setSession] = useState(null);

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

    const handlePublish = async () => {
        if (!session) {
            toast.error('Please login to publish a blog.');
            return;
        }
        if (!title.trim() || !content.trim()) {
            toast.error('Title and content are required!');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/Blogs/createblog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description: content,
                    username: blawgUsername || '',
                    email: user?.email || '',
                    tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                    likes: 0,
                    dislikes: 0,
                    views: 0,
                    likedBy: [],
                    dislikedBy: [],
                    comments: [],
                    userId: session.user.id
                })
            });
            if (res.ok) {
                toast.success('Blog published!');
                setTitle('');
                setContent('');
                setTags('');
            } else {
                const err = await res.json();
                toast.error('Failed: ' + (err.error || 'Unknown error'));
            }
        } catch (err) {
            toast.error('Failed to publish blog.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Toaster />
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create New Blog Post</h1>
            
            <div className="mb-6">
                <label htmlFor="blog-title" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Title
                </label>
                <input
                    id="blog-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your blog title"
                    className="w-full px-4 py-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
            </div>
            
            <TextEditor value={content} onChange={setContent} />
            
            <div className="mb-6">
                <label htmlFor="blog-tags" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Tags (comma separated)
                </label>
                <input
                    id="blog-tags"
                    type="text"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    placeholder="e.g. react, firebase, webdev"
                    className="w-full px-4 py-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
            </div>
            
            <div className="flex justify-end mt-6">
                <button 
                    className="px-6 py-3 bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105"
                    onClick={handlePublish}
                    disabled={loading}
                >
                    {loading ? 'Publishing...' : 'Publish Post'}
                </button>
            </div>
        </div>
    );
}
