import { processChat } from '@/lib/puter/chatbot';

export async function POST(req) {
  try {
    const { messages } = await req.json();

    // Validate the request
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages are required and must be an array' }),
        { status: 400 }
      );
    }

    // Use puter.js to generate a response
    const responseContent = processChat(messages);

    // Return the response
    return new Response(
      JSON.stringify({ 
        message: {
          role: 'assistant',
          content: responseContent
        }
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Chatbot API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process your request' }),
      { status: 500 }
    );
  }
} 