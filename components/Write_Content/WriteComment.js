"use client";

import { useState } from "react";
import { useAuth } from '@/app/Providers/AuthProvider';
import { UseUsername } from '@/app/Providers/UsernameProvider';
import { toast } from "react-hot-toast";

export default function WriteComment({ blogId }) {
    const { user } = useAuth();
    const { blawgUsername } = UseUsername();
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePost = async () => {
        if (!user) {
            toast.error("Please login to post a comment.");
            return;
        }
        if (!comment.trim()) {
            toast.error("Comment cannot be empty!");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/api/Blogs/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    blogId,
                    comment,
                    username: blawgUsername || "Anonymous",
                    email: user.email || "",
                    userId: user.id,
                }),
            });
            if (res.ok) {
                toast.success("Comment posted!");
                setComment("");
            } else {
                const err = await res.json();
                toast.error("Failed: " + (err.error || "Unknown error"));
            }
        } catch (err) {
            toast.error("Failed to post comment.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full px-0 md:px-0 mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Write a comment</h3>
            {!user && (
                <div className="mb-3 text-blue-600 dark:text-blue-400 font-medium text-sm">
                    Please login to post a comment.
                </div>
            )}
            <textarea
                className="w-full min-h-[80px] px-4 py-3 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none mb-4"
                placeholder="Share your thoughts..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                disabled={loading || !user}
            />
            <div className="flex justify-end">
                <button
                    className="px-5 py-2 bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold rounded-lg shadow hover:shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-60"
                    onClick={handlePost}
                    disabled={loading || !user || !comment.trim()}
                >
                    {loading ? "Posting..." : "Post Comment"}
                </button>
            </div>
        </div>
    );
} 