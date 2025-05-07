import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function GET(req, { params }) {
    const { email } = await params;
    const docRef = doc(db, 'username_email', email)
    const docSnap = await getDoc(docRef)

    const data = docSnap.data();
    // console.log(data.username);
    return new Response(JSON.stringify(data.username), {status: 200});
}

export async function POST(req) {
    try{
        const { email, username } = await req.json();
        
        const docRef = doc(db, 'username_email', email)
        await setDoc(docRef, {username})
        return new Response(JSON.stringify(username), {status: 200});

    }catch(err){
        return new Response(JSON.stringify({error:"some error has occured while creating user."}), {status: 500});
    }
}