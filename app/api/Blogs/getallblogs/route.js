import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const limitParam = searchParams.get('limit');
        const maxBlogs = limitParam ? parseInt(limitParam) : 50; // Default to 50 blogs max
        
        // Get all blogs, ordered by creation date (newest first)
        const blogsCollection = collection(db, 'Blogs');
        const blogsQuery = query(
            blogsCollection,
            orderBy('createdAt', 'desc'),
            limit(maxBlogs)
        );
        
        const blogsSnapshot = await getDocs(blogsQuery);
        const blogs = blogsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        return new Response(JSON.stringify({ blogs }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'max-age=60, stale-while-revalidate=300' // Cache for 1 minute, stale for 5
            }
        });
    } catch (err) {
        console.error('Error fetching blogs:', err);
        return new Response(JSON.stringify({ error: err.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 