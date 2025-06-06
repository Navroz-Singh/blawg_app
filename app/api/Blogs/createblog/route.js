import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';

export async function POST(req) {
    try {
        const body = await req.json();
        const {
            title,
            description,
            username,
            email,
            tags = [],
            likes = 0,
            dislikes = 0,
            views = 0,
            likedBy = [],
            dislikedBy = [],
            comments = [],
            userId
        } = body;

        const docRef = await addDoc(collection(db, 'Blogs'), {
            title,
            description,
            createdAt: serverTimestamp(),
            username,
            email,
            tags,
            likes,
            dislikes,
            views,
            likedBy,
            dislikedBy,
            comments,
            userId,
        });

        // Save blog ID under UserBlogs/{email}/blogs/{blogId}
        if (email && docRef.id) {
            const userBlogRef = doc(db, 'UserBlogs', email, 'blogs', docRef.id);
            await setDoc(userBlogRef, { createdAt: serverTimestamp() });
        }

        return new Response(JSON.stringify({ id: docRef.id, success: true }), { status: 201 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}