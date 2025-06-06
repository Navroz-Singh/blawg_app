import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id parameter' }), { status: 400 });
    }
    const blogDoc = await getDoc(doc(db, 'Blogs', id));
    if (!blogDoc.exists()) {
      return new Response(JSON.stringify({ error: 'Blog not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ blog: { id, ...blogDoc.data() } }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
} 