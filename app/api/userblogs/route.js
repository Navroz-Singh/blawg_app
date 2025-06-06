import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        if (!email) {
            return new Response(JSON.stringify({ error: 'Missing email parameter' }), { status: 400 });
        }
        // Get all blog IDs for this user
        const userBlogsCol = collection(db, 'UserBlogs', email, 'blogs');
        const userBlogsSnap = await getDocs(userBlogsCol);
        const blogIds = userBlogsSnap.docs.map(doc => doc.id);
        // Fetch each blog's details
        const blogPromises = blogIds.map(async (blogId) => {
            const blogDoc = await getDoc(doc(db, 'Blogs', blogId));
            return blogDoc.exists() ? { id: blogId, ...blogDoc.data() } : null;
        });
        const blogsData = (await Promise.all(blogPromises)).filter(Boolean);
        return new Response(JSON.stringify({ blogs: blogsData }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
} 