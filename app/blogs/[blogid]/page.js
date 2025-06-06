import { markdownToHtml } from '@/lib/markdown';
import dynamic from 'next/dynamic';

const BlogClientContent = dynamic(() => import('./BlogClientContent'));

export default async function BlogPage({ params }) {
    const { blogid } = params;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    // Fetch blog data from API
    const res = await fetch(`${baseUrl}/api/Blogs/getblog?id=${blogid}`, { cache: 'no-store' });
    if (!res.ok) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Blog not found</h1>
                    <p className="text-gray-600 dark:text-gray-400">The blog post you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }
    const { blog } = await res.json();
    const htmlContent = await markdownToHtml(blog.description || '');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-sm">
                <BlogClientContent blog={blog} blogid={blogid} htmlContent={htmlContent} />
            </div>
        </div>
    );
}
