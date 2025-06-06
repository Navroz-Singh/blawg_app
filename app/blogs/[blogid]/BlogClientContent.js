"use client";

import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useAuth } from '@/app/Providers/AuthProvider';
import WriteComment from '@/components/Write_Content/WriteComment';
import ConfirmationModal from '@/components/ConfirmationModal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';

function timeAgo(timestamp) {
    if (!timestamp) return '';
    const now = Date.now();
    const diff = Math.floor((now - timestamp) / 1000);
    if (diff < 60) return '< 1 minute ago';
    if (diff < 3600) return `${Math.floor(diff / 60)} minute${Math.floor(diff / 60) === 1 ? '' : 's'} ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) === 1 ? '' : 's'} ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) === 1 ? '' : 's'} ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} month${Math.floor(diff / 2592000) === 1 ? '' : 's'} ago`;
    return `${Math.floor(diff / 31536000)} year${Math.floor(diff / 31536000) === 1 ? '' : 's'} ago`;
}

export default function BlogClientContent({ blog: initialBlog, blogid, htmlContent }) {
    const { user } = useAuth();
    const router = useRouter();
    const [blog, setBlog] = useState(initialBlog);
    const [likeLoading, setLikeLoading] = useState(false);
    const [dislikeLoading, setDislikeLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    let createdAt = '';
    if (blog.createdAt && blog.createdAt.seconds) {
        const date = new Date(blog.createdAt.seconds * 1000);
        createdAt = date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    }

    const likedBy = blog.likedBy || [];
    const dislikedBy = blog.dislikedBy || [];
    const likes = blog.likes || 0;
    const dislikes = blog.dislikes || 0;
    const emailby = blog.email
    const userEmail = user?.email;
    const hasLiked = userEmail && likedBy.includes(userEmail);
    const hasDisliked = userEmail && dislikedBy.includes(userEmail);

    const handleLike = async () => {
        if (!userEmail) {
            toast.error("Please login to like the blog.");
            return;
        }
        setLikeLoading(true);
        try {
            const res = await fetch(`/api/Blogs/likeblog`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blogId: blogid, userEmail, emailby }),
            });
            if (res.ok) {
                const { blog: updatedBlog } = await res.json();
                setBlog(updatedBlog);
            } else {
                toast.error('Failed to update like.');
            }
        } catch (err) {
            toast.error('Failed to update like.');
        } finally {
            setLikeLoading(false);
        }
    };

    const handleDislike = async () => {
        if (!userEmail) {
            toast.error("Please login to dislike the blog.");
            return;
        }
        setDislikeLoading(true);
        try {
            const res = await fetch(`/api/Blogs/dislikeblog`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blogId: blogid, userEmail, emailby }),
            });
            if (res.ok) {
                const { blog: updatedBlog } = await res.json();
                setBlog(updatedBlog);
            } else {
                toast.error('Failed to update dislike.');
            }
        } catch (err) {
            toast.error('Failed to update dislike.');
        } finally {
            setDislikeLoading(false);
        }
    };

    // Add a handler to update comments after posting
    const handleCommentPosted = async () => {
        // Refetch blog data to get the latest comments  
        try {
            const res = await fetch(`/api/Blogs/getblog?id=${blogid}`);
            if (res.ok) {
                const { blog: updatedBlog } = await res.json();
                setBlog(updatedBlog);
            }
        } catch (err) {
            toast.error('Failed to update comments.');
        }
    };
    
    // Delete blog handler
    const handleDeleteBlog = async () => {
        if (!userEmail) {
            toast.error("You must be logged in to delete this blog.");
            return;
        }
        
        setIsDeleting(true);
        try {
            const res = await fetch('/api/Blogs/deleteblog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blogId: blogid, userEmail }),
            });
            
            if (res.ok) {
                toast.success('Blog deleted successfully');
                // Redirect to homepage after successful deletion
                router.push('/');
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to delete blog');
            }
        } catch (err) {
            toast.error('An error occurred while deleting the blog');
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <>
            <Toaster />
            <ConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteBlog}
                title="Delete Blog"
                message="Are you sure you want to delete this blog? This action cannot be undone. All likes, dislikes, and comments will be permanently removed."
            />
            <article className="px-6 py-6 md:px-12 md:py-8">
                {/* Header section */}
                <header className="mb-6">
                    <div className="flex justify-between items-start">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-3">
                            {blog.title}
                        </h1>
                        
                        {/* Action buttons - only visible to blog creator */}
                        {userEmail && blog.email === userEmail && (
                            <div className="flex gap-2">
                                <Link href={`/edit/${blogid}`}>
                                    <button
                                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                        </svg>
                                        Edit
                                    </button>
                                </Link>
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    disabled={isDeleting}
                                    className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                                >
                                    {isDeleting ? (
                                        <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <FaTrash className="w-4 h-4" />
                                    )}
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {/* Meta information */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                                {blog.username || 'Anonymous'}
                            </span>
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {createdAt}
                        </span>
                    </div>
                </header>

                {/* Blog content */}
                <div
                    className="
                        prose prose-gray dark:prose-invert
                        mx-auto max-w-3xl
                        prose-headings:mt-1 prose-headings:mb-1
                        prose-p:mt-0 prose-p:mb-1
                        prose-a:mt-0 prose-a:mb-1
                        dark:prose-headings:text-white
                        dark:prose-p:text-gray-300
                        prose-img:rounded-lg prose-img:shadow-md
                    "
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />

                {/* Engagement section */}
                <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        {/* Like button */}
                        <button
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 group ${hasLiked ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
                            onClick={handleLike}
                            disabled={likeLoading || dislikeLoading}
                        >
                            {likeLoading ? (
                                <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className={`w-5 h-5 group-hover:scale-110 transition-transform ${hasLiked ? 'text-blue-600 dark:text-blue-400' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.9752 12.1852L20.2361 12.0574L20.9752 12.1852ZM20.2696 16.265L19.5306 16.1371L20.2696 16.265ZM6.93777 20.4771L6.19056 20.5417L6.93777 20.4771ZM6.12561 11.0844L6.87282 11.0198L6.12561 11.0844ZM13.995 5.22142L14.7351 5.34269V5.34269L13.995 5.22142ZM13.3323 9.26598L14.0724 9.38725V9.38725L13.3323 9.26598ZM6.69814 9.67749L6.20855 9.10933H6.20855L6.69814 9.67749ZM8.13688 8.43769L8.62647 9.00585H8.62647L8.13688 8.43769ZM10.5181 4.78374L9.79208 4.59542L10.5181 4.78374ZM10.9938 2.94989L11.7197 3.13821V3.13821L10.9938 2.94989ZM12.6676 2.06435L12.4382 2.77841L12.4382 2.77841L12.6676 2.06435ZM12.8126 2.11093L13.042 1.39687L13.042 1.39687L12.8126 2.11093ZM9.86195 6.46262L10.5235 6.81599V6.81599L9.86195 6.46262ZM13.9047 3.24752L13.1787 3.43584V3.43584L13.9047 3.24752ZM11.6742 2.13239L11.3486 1.45675V1.45675L11.6742 2.13239ZM3.9716 21.4707L3.22439 21.5353L3.9716 21.4707ZM3 10.2342L3.74721 10.1696C3.71261 9.76945 3.36893 9.46758 2.96767 9.4849C2.5664 9.50221 2.25 9.83256 2.25 10.2342H3ZM20.2361 12.0574L19.5306 16.1371L21.0087 16.3928L21.7142 12.313L20.2361 12.0574ZM13.245 21.25H8.59635V22.75H13.245V21.25ZM7.68498 20.4125L6.87282 11.0198L5.3784 11.149L6.19056 20.5417L7.68498 20.4125ZM19.5306 16.1371C19.0238 19.0677 16.3813 21.25 13.245 21.25V22.75C17.0712 22.75 20.3708 20.081 21.0087 16.3928L19.5306 16.1371ZM13.2548 5.10015L12.5921 9.14472L14.0724 9.38725L14.7351 5.34269L13.2548 5.10015ZM7.18773 10.2456L8.62647 9.00585L7.64729 7.86954L6.20855 9.10933L7.18773 10.2456ZM11.244 4.97206L11.7197 3.13821L10.2678 2.76157L9.79208 4.59542L11.244 4.97206ZM12.4382 2.77841L12.5832 2.82498L13.042 1.39687L12.897 1.3503L12.4382 2.77841ZM10.5235 6.81599C10.8354 6.23198 11.0777 5.61339 11.244 4.97206L9.79208 4.59542C9.65573 5.12107 9.45699 5.62893 9.20042 6.10924L10.5235 6.81599ZM12.5832 2.82498C12.8896 2.92342 13.1072 3.16009 13.1787 3.43584L14.6307 3.05921C14.4252 2.26719 13.819 1.64648 13.042 1.39687L12.5832 2.82498ZM11.7197 3.13821C11.7548 3.0032 11.8523 2.87913 11.9998 2.80804L11.3486 1.45675C10.8166 1.71309 10.417 2.18627 10.2678 2.76157L11.7197 3.13821ZM11.9998 2.80804C12.1345 2.74311 12.2931 2.73181 12.4382 2.77841L12.897 1.3503C12.3873 1.18655 11.8312 1.2242 11.3486 1.45675L11.9998 2.80804ZM14.1537 10.9842H19.3348V9.4842H14.1537V10.9842ZM4.71881 21.4061L3.74721 10.1696L2.25279 10.2988L3.22439 21.5353L4.71881 21.4061ZM3.75 21.5127V10.2342H2.25V21.5127H3.75ZM3.22439 21.5353C3.2112 21.3828 3.33146 21.25 3.48671 21.25V22.75C4.21268 22.75 4.78122 22.1279 4.71881 21.4061L3.22439 21.5353ZM14.7351 5.34269C14.8596 4.58256 14.8241 3.80477 14.6307 3.0592L13.1787 3.43584C13.3197 3.97923 13.3456 4.54613 13.2548 5.10016L14.7351 5.34269ZM8.59635 21.25C8.12244 21.25 7.72601 20.887 7.68498 20.4125L6.19056 20.5417C6.29852 21.7902 7.3427 22.75 8.59635 22.75V21.25ZM8.62647 9.00585C9.30632 8.42 10.0392 7.72267 10.5235 6.81599L9.20042 6.10924C8.85404 6.75767 8.3025 7.30493 7.64729 7.86954L8.62647 9.00585ZM21.7142 12.313C21.9695 10.8365 20.8341 9.4842 19.3348 9.4842V10.9842C19.9014 10.9842 20.3332 11.4959 20.2361 12.0574L21.7142 12.313ZM3.48671 21.25C3.63292 21.25 3.75 21.3684 3.75 21.5127H2.25C2.25 22.1953 2.80289 22.75 3.48671 22.75V21.25ZM12.5921 9.14471C12.4344 10.1076 13.1766 10.9842 14.1537 10.9842V9.4842C14.1038 9.4842 14.0639 9.43901 14.0724 9.38725L12.5921 9.14471ZM6.87282 11.0198C6.8474 10.7258 6.96475 10.4378 7.18773 10.2456L6.20855 9.10933C5.62022 9.61631 5.31149 10.3753 5.3784 11.149L6.87282 11.0198Z" />
                                </svg>
                            )}
                            <span className="font-medium">{likes}</span>
                        </button>

                        {/* Dislike button */}
                        <button
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 group ${hasDisliked ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
                            onClick={handleDislike}
                            disabled={likeLoading || dislikeLoading}
                        >
                            {dislikeLoading ? (
                                <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className={`w-5 h-5 group-hover:scale-110 transition-transform ${hasDisliked ? 'text-red-600 dark:text-red-400' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.9752 11.8148L20.2361 11.9426L20.9752 11.8148ZM20.2696 7.73505L19.5306 7.86285L20.2696 7.73505ZM6.93777 3.52293L6.19056 3.45832L6.93777 3.52293ZM6.12561 12.9156L6.87282 12.9802L6.12561 12.9156ZM13.995 18.7786L14.7351 18.6573V18.6573L13.995 18.7786ZM13.3323 14.734L14.0724 14.6128V14.6128L13.3323 14.734ZM6.69814 14.3225L6.20855 14.8907H6.20855L6.69814 14.3225ZM8.13688 15.5623L8.62647 14.9942H8.62647L8.13688 15.5623ZM10.5181 19.2163L9.79208 19.4046L10.5181 19.2163ZM10.9938 21.0501L11.7197 20.8618V20.8618L10.9938 21.0501ZM12.6676 21.9356L12.4382 21.2216L12.4382 21.2216L12.6676 21.9356ZM12.8126 21.8891L13.042 22.6031L13.042 22.6031L12.8126 21.8891ZM9.86195 17.5374L10.5235 17.184V17.184L9.86195 17.5374ZM13.9047 20.7525L13.1787 20.5642V20.5642L13.9047 20.7525ZM11.6742 21.8676L11.3486 22.5433V22.5433L11.6742 21.8676ZM3.9716 2.52928L3.22439 2.46467L3.9716 2.52928ZM3 13.7658L3.74721 13.8304C3.71261 14.2308 3.36893 14.5329 2.96767 14.5157C2.5664 14.4984 2.25 14.168 2.25 13.7662H3ZM20.2361 11.9426L19.5306 7.86285L21.0087 7.60724L21.7142 11.6868L20.2361 11.9426ZM13.245 2.75H8.59635V1.25H13.245V2.75ZM7.68498 3.58754L6.87282 12.9802L5.3784 12.851L6.19056 3.45832L7.68498 3.58754ZM19.5306 7.86285C19.0238 4.93227 16.3813 2.75 13.245 2.75V1.25C17.0712 1.25 20.3708 3.91899 21.0087 7.60724L19.5306 7.86285ZM13.2548 18.8998L12.5921 14.8553L14.0724 14.6128L14.7351 18.6573L13.2548 18.8998ZM7.18773 13.7544L8.62647 14.9942L7.64729 16.1305L6.20855 14.8907L7.18773 13.7544ZM11.244 19.0279L11.7197 20.8618L10.2678 21.2384L9.79208 19.4046L11.244 19.0279ZM12.4382 21.2216L12.5832 21.175L13.042 22.6031L12.897 22.6497L12.4382 21.2216ZM10.5235 17.184C10.8354 17.768 11.0777 18.3866 11.244 19.0279L9.79208 19.4046C9.65573 18.8789 9.45699 18.3711 9.20042 17.8908L10.5235 17.184ZM12.5832 21.175C12.8896 21.0769 13.1072 20.8399 13.1787 20.5642L14.6307 20.9408C14.4252 21.7325 13.819 22.3539 13.042 22.6031L12.5832 21.175ZM11.7197 20.8618C11.7548 20.9966 11.8523 21.1208 11.9998 21.1919L11.3486 22.5433C10.8166 22.2868 10.417 21.8136 10.2678 21.2384L11.7197 20.8618ZM11.9998 21.1919C12.1345 21.2569 12.2931 21.268 12.4382 21.2216L12.897 22.6497C12.3873 22.8135 11.8312 22.7756 11.3486 22.5433L11.9998 21.1919ZM14.1537 13.0158H19.3348V14.5158H14.1537V13.0158ZM4.71881 2.59389L3.74721 13.8303L2.25279 13.7011L3.22439 2.46465L4.71881 2.59389ZM3.75 2.48726V13.7658H2.25V2.48726H3.75ZM3.22439 2.46465C3.2112 2.61712 3.33146 2.75 3.48671 2.75V1.25C4.21268 1.25 4.78122 1.87205 4.71881 2.59389L3.22439 2.46465ZM14.7351 18.6573C14.8596 19.4174 14.8241 20.1952 14.6307 20.9408L13.1787 20.5642C13.3197 20.0208 13.3456 19.4539 13.2548 18.8998L14.7351 18.6573ZM8.59635 2.75C8.12244 2.75 7.72601 3.113 7.68498 3.58754L6.19056 3.45832C6.29852 2.20975 7.3427 1.25 8.59635 1.25V2.75ZM8.62647 14.9942C9.30632 15.58 10.0392 16.2773 10.5235 17.184L9.20042 17.8908C8.85404 17.2423 8.3025 16.6951 7.64729 16.1305L8.62647 14.9942ZM21.7142 11.687C21.9695 13.1635 20.8341 14.5158 19.3348 14.5158V13.0158C19.9014 13.0158 20.3332 12.5041 20.2361 11.9426L21.7142 11.687ZM3.48671 2.75C3.63292 2.75 3.75 2.63156 3.75 2.48726H2.25C2.25 1.80474 2.80289 1.25 3.48671 1.25V2.75ZM12.5921 14.8553C12.4344 13.8924 13.1766 13.0158 14.1537 13.0158V14.5158C14.1038 14.5158 14.0639 14.561 14.0724 14.6128L12.5921 14.8553ZM6.87282 12.9802C6.8474 13.2742 6.96475 13.5622 7.18773 13.7544L6.20855 14.8907C5.62022 14.3837 5.31149 13.6247 5.3784 12.851L6.87282 12.9802Z" />
                                </svg>
                            )}
                            <span className="font-medium">{dislikes}</span>
                        </button>
                    </div>

                    {/* Share button */}
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white 
                                         rounded-lg transition-colors duration-200 font-medium">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                        Share
                    </button>
                </div>
            </article>
            {/* Comments section */}
            <section className="border-t border-gray-200 dark:border-gray-700">
                <div className="px-6 py-6 md:px-12">
                    <WriteComment blogId={blogid} onCommentPosted={handleCommentPosted} />
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                        Comments
                    </h2>
                    {/* Comments display */}
                    {blog.comments && blog.comments.length > 0 ? (
                        <div className="flex flex-col gap-0 mt-4">
                            {Array.from(blog.comments).map((c, index) => (
                                <div key={index} className="flex gap-3 py-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-lg">
                                            {c.username ? c.username[0].toUpperCase() : 'A'}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <div className="font-semibold text-gray-900 dark:text-white text-base">{c.username || 'Anonymous'}</div>
                                            <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">{timeAgo(c.timestamp)}</span>
                                        </div>
                                        <div className="text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-line text-[15px]">{c.comment}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-base font-medium">
                            No comments yet. Be the first to start the discussion!
                        </div>
                    )}
                </div>
            </section>
        </>
    );
} 