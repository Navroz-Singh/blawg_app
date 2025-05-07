'use client';

import { useState } from 'react';
import TextEditor from './TextEditor';

export default function CreateBlog() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    return (
        <div className="container mx-auto p-4">
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
            
            <div className="flex justify-end mt-6">
                <button 
                    className="px-6 py-3 bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105"
                >
                    Publish Post
                </button>
            </div>
        </div>
    );
}
