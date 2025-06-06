import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export async function POST(req) {
    const { blogId, userEmail, emailby } = await req.json();
    const blogRef = doc(db, 'Blogs', blogId);
    const blogSnap = await getDoc(blogRef);
    const userRef = doc(db, 'UserBlogs', emailby);
    const userSnap = await getDoc(userRef);
    if (!blogSnap.exists()) {
        return Response.json({ error: 'Blog not found' }, { status: 404 });
    }
    if (!userSnap.exists()){
        return Response.json({ error: 'User not found' }, { status: 404 });
    }
    const user = userSnap.data();
    const blog = blogSnap.data();
    let likedBy = blog.likedBy || [];
    let dislikedBy = blog.dislikedBy || [];
    let likes = blog.likes || 0;
    let dislikes = blog.dislikes || 0;
    let changed = false;

    if (dislikedBy.includes(userEmail)) {
        dislikedBy = dislikedBy.filter(e => e !== userEmail);
        const newlikes = Math.max(0, user.likes - 1);
        await updateDoc(userRef, { dislikes: newlikes });
        dislikes = Math.max(0, dislikes - 1);
        changed = true;
    } else {
        dislikedBy.push(userEmail);
        await updateDoc(userRef, { dislikes: user.dislikes + 1 });
        dislikes += 1;
        changed = true;
        // Remove from likedBy if present
        if (likedBy.includes(userEmail)) {
            likedBy = likedBy.filter(e => e !== userEmail);
            const newlikes = Math.max(0, user.likes - 1);
            await updateDoc(userRef, { likes: newlikes });
            likes = Math.max(0, likes - 1);
        }
    }
    if (changed) {
        await updateDoc(blogRef, { likedBy, likes, dislikedBy, dislikes });
    }
    const updatedSnap = await getDoc(blogRef);
    return Response.json({ blog: { id: blogId, ...updatedSnap.data() } }, { status: 200 });
} 