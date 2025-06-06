import { db } from '@/lib/firebase';
import { doc, getDoc, deleteDoc, updateDoc, collection, deleteDoc as deleteDocument } from 'firebase/firestore';

export async function POST(req) {
    try {
        const { blogId, userEmail } = await req.json();
        
        // Get blog reference
        const blogRef = doc(db, 'Blogs', blogId);
        const blogSnap = await getDoc(blogRef);
        
        if (!blogSnap.exists()) {
            return Response.json({ error: 'Blog not found' }, { status: 404 });
        }
        
        const blog = blogSnap.data();
        
        // Check if the user is the creator of the blog
        if (blog.email !== userEmail) {
            return Response.json({ error: 'Unauthorized' }, { status: 403 });
        }
        
        // Get user blog reference
        const userRef = doc(db, 'UserBlogs', userEmail);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
            return Response.json({ error: 'User not found' }, { status: 404 });
        }
        
        const userData = userSnap.data();
        
        // Get likes and dislikes from the blog
        const likes = blog.likes || 0;
        const dislikes = blog.dislikes || 0;
        
        // Update the user's likes and dislikes data
        const updatedUserData = {
            likes: Math.max(0, (userData.likes || 0) - likes),
            dislikes: Math.max(0, (userData.dislikes || 0) - dislikes)
        };
        
        // Update user data
        await updateDoc(userRef, updatedUserData);
        
        // Delete the blog document from the user's blogs collection
        const userBlogRef = doc(db, 'UserBlogs', userEmail, 'blogs', blogId);
        await deleteDoc(userBlogRef);
        
        // Delete the blog from the main Blogs collection
        await deleteDoc(blogRef);
        
        return Response.json({ success: true, message: 'Blog deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting blog:', error);
        return Response.json({ error: 'Failed to delete blog' }, { status: 500 });
    }
} 