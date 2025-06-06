"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Chatbot from "@/components/Chatbot";
import Link from "next/link";
import { FaArrowLeft, FaLightbulb, FaQuestion, FaBook, FaUserCircle } from "react-icons/fa";

export default function HelpPage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    fetchSession();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
            <FaArrowLeft className="mr-2" /> Back to Home
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar with help topics */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Help Topics</h2>
              
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-start gap-3">
                  <FaLightbulb className="text-blue-600 dark:text-blue-400 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Getting Started</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Learn the basics of using Blawg</p>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg flex items-start gap-3">
                  <FaBook className="text-gray-600 dark:text-gray-400 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Writing Blogs</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Tips for creating engaging content</p>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg flex items-start gap-3">
                  <FaUserCircle className="text-gray-600 dark:text-gray-400 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Account Settings</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Managing your profile and preferences</p>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg flex items-start gap-3">
                  <FaQuestion className="text-gray-600 dark:text-gray-400 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">FAQ</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Frequently asked questions</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Contact Support</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Need more help? Our support team is available 24/7.
              </p>
              <Link 
                href="/help/email-support" 
                className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg transition-colors"
              >
                Email Support
              </Link>
            </div>
          </div>
          
          {/* Right side chatbot */}
          <div className="w-full lg:w-3/4 h-[600px]">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-full">
              <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Blawg Assistant</h1>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Ask our AI assistant any questions about using Blawg. Get instant help with writing blogs, managing your account, and more.
              </p>
              
              <div className="h-[calc(100%-100px)]">
                <Chatbot />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 