"use client";

import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaUser, FaSpinner } from 'react-icons/fa';

export default function Chatbot() {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hi there! I\'m your Blawg assistant. How can I help you today? You can ask me about creating blogs, account settings, or other features.'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        // Add user message to chat
        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Prepare all messages for context
            const allMessages = [...messages, userMessage];
            
            // Send chat history to API
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: allMessages
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();

            // Add assistant response to chat
            setMessages(prev => [...prev, data.message]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again later.'
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // Suggested questions that users can click on
    const suggestedQuestions = [
        "How do I create a new blog?",
        "How do I edit my profile?",
        "How do I delete my account?",
        "What is Blawg?"
    ];

    const handleSuggestedQuestion = (question) => {
        setInput(question);
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {/* Chat header */}
            <div className="bg-blue-600 dark:bg-blue-800 text-white p-4 flex items-center gap-2">
                <FaRobot className="text-xl" />
                <h2 className="font-bold">Blawg Assistant</h2>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                {message.role === 'user' ? (
                                    <>
                                        <span className="font-medium">You</span>
                                        <FaUser className="text-xs" />
                                    </>
                                ) : (
                                    <>
                                        <FaRobot className="text-xs" />
                                        <span className="font-medium">Assistant</span>
                                    </>
                                )}
                            </div>
                            <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 rounded-bl-none flex items-center gap-2">
                            <FaSpinner className="animate-spin text-blue-600 dark:text-blue-400" />
                            <span className="text-gray-800 dark:text-gray-200">Thinking...</span>
                        </div>
                    </div>
                )}
                
                {/* Suggested questions (show only at the beginning) */}
                {messages.length <= 2 && (
                    <div className="pt-4 pb-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Try asking:</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedQuestions.map((question, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestedQuestion(question)}
                                    className="px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Chat input */}
            <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? (
                            <FaSpinner className="animate-spin" />
                        ) : (
                            <FaPaperPlane />
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
} 