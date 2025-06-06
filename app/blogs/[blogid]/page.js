import { markdownToHtmlWithHeadingIds, extractHeadings } from '@/lib/markdown';
import dynamic from 'next/dynamic';

const BlogClientContent = dynamic(() => import('./BlogClientContent'));

export default async function BlogPage({ params }) {
    try {
        const { blogid } = await params;
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        
        // Fetch blog data from API
        const res = await fetch(`${baseUrl}/api/Blogs/getblog?id=${blogid}`, { 
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
        
        if (!res.ok) {
            console.error(`Failed to fetch blog: ${res.status} ${res.statusText}`);
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
        
        if (!blog || !blog.description) {
            console.error('Blog data is missing or incomplete');
            return (
                <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Invalid blog data</h1>
                        <p className="text-gray-600 dark:text-gray-400">This blog post appears to be incomplete or corrupted.</p>
                    </div>
                </div>
            );
        }
        
        const htmlContent = await markdownToHtmlWithHeadingIds(blog.description || '');
        const headings = await extractHeadings(blog.description || '');

        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-sm">
                    <BlogClientContent 
                        blog={blog} 
                        blogid={blogid} 
                        htmlContent={htmlContent} 
                        headings={headings}
                    />
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error rendering blog page:', error);
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Something went wrong</h1>
                    <p className="text-gray-600 dark:text-gray-400">We encountered an error while loading this blog post.</p>
                </div>
            </div>
        );
    }
}
