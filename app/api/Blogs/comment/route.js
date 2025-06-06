import { db } from '@/lib/firebase';
import { doc, getDoc, arrayUnion, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req){
    const {blogId, comment, username, email, userId} = await req.json();
    const blogRef = doc(db, 'Blogs', blogId);
    const blogSnap = await getDoc(blogRef);
    if(!blogSnap.exists()){
        return Response.json({error: 'Blog not found'}, {status: 404});
    }
    const newComment = {
        comment,
        username,
        email,
        userId,
        timestamp: Date.now()
      };
    await updateDoc(blogRef, {comments: arrayUnion(newComment)});
    return Response.json({message: 'Comment added successfully'}, {status: 200});
}
