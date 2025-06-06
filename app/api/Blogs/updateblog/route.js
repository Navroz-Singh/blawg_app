import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export async function POST(req) {
    try {
        const { blogId, description, userEmail } = await req.json();
        
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
        
        // Update only the description field
        await updateDoc(blogRef, { 
            description
        });
        
        // Get the updated blog
        const updatedBlogSnap = await getDoc(blogRef);
        
        return Response.json({ 
            success: true, 
            message: 'Blog updated successfully',
            blog: {
                id: blogId,
                ...updatedBlogSnap.data()
            }
        }, { status: 200 });
    } catch (error) {
        console.error('Error updating blog:', error);
        return Response.json({ error: 'Failed to update blog' }, { status: 500 });
    }
} 