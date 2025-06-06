import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        
        if (!email) {
            return new Response(JSON.stringify({ error: 'Missing email parameter' }), { status: 400 });
        }
        
        // Get user stats from UserBlogs collection
        const userRef = doc(db, 'UserBlogs', email);
        const userSnap = await getDoc(userRef);
        
        // If user document exists, get the likes and dislikes
        let totalLikes = 0;
        let totalDislikes = 0;
        
        if (userSnap.exists()) {
            const userData = userSnap.data();
            totalLikes = userData.likes || 0;
            totalDislikes = userData.dislikes || 0;
        }
        
        // Get all blogs by this user to calculate total views
        const userBlogsCol = collection(db, 'UserBlogs', email, 'blogs');
        const userBlogsSnap = await getDocs(userBlogsCol);
        const blogIds = userBlogsSnap.docs.map(doc => doc.id);
        
        // Fetch each blog to get view counts
        let totalViews = 0;
        
        const blogPromises = blogIds.map(async (blogId) => {
            const blogDoc = await getDoc(doc(db, 'Blogs', blogId));
            if (blogDoc.exists()) {
                const blogData = blogDoc.data();
                return blogData.views || 0;
            }
            return 0;
        });
        
        const viewCounts = await Promise.all(blogPromises);
        totalViews = viewCounts.reduce((sum, views) => sum + views, 0);
        
        return new Response(JSON.stringify({ 
            totalViews,
            totalLikes,
            totalDislikes
        }), { status: 200 });
    } catch (err) {
        console.error('Error fetching user stats:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
} 