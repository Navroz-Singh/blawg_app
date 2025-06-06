/**
 * Puter.js - Simple AI chatbot library
 * This is a lightweight alternative to using external AI APIs
 */

// Knowledge base with common patterns and responses
const knowledgeBase = [
  {
    patterns: ["hello", "hi", "hey", "greetings", "howdy"],
    responses: [
      "Hello! How can I help you with Blawg today?",
      "Hi there! What would you like to know about Blawg?",
      "Hey! I'm here to help with any questions about the Blawg platform."
    ]
  },
  {
    patterns: ["bye", "goodbye", "see you", "farewell"],
    responses: [
      "Goodbye! Feel free to come back if you have more questions.",
      "See you later! Hope I was able to help.",
      "Bye for now! Happy blogging!"
    ]
  },
  {
    patterns: ["thanks", "thank you", "appreciate"],
    responses: [
      "You're welcome! Anything else you'd like to know?",
      "Happy to help! Let me know if you have other questions.",
      "No problem at all! Feel free to ask if you need more assistance."
    ]
  },
  {
    patterns: ["create blog", "write blog", "new post", "publish", "writing"],
    responses: [
      "To create a new blog, click on the 'Write' link in the navigation bar. You'll be taken to the blog editor where you can add a title, content, and tags for your blog post. When you're finished, click the 'Publish' button.",
      "Creating a blog is easy! Just click 'Write' in the navbar, fill in your content, and hit Publish when you're done.",
      "To write a new post, navigate to the Write page from the top menu. Add your content and click Publish when you're ready to share it."
    ]
  },
  {
    patterns: ["edit profile", "change username", "account settings", "profile picture"],
    responses: [
      "To edit your profile, go to the 'My Account' page by clicking on your profile icon in the top right corner. From there, you can edit your username and view your account information.",
      "You can update your profile by going to My Account from your profile menu. There you can change your username and other details.",
      "Profile settings can be accessed through the My Account page. Look for the edit button next to your username to make changes."
    ]
  },
  {
    patterns: ["delete account", "remove account", "cancel account"],
    responses: [
      "To delete your account, go to 'My Account' > 'Settings'. In the Settings page, you'll find a 'Danger Zone' section with a 'Delete Account' button. Click it and confirm to delete your account. Note that your blogs will remain on the platform.",
      "Account deletion is available in My Account > Settings > Danger Zone. Be aware that while your account will be removed, your published blogs will remain.",
      "If you want to delete your account, head to Settings from your My Account page and look for the Delete Account option in the Danger Zone section."
    ]
  },
  {
    patterns: ["like blog", "comment", "dislike", "reaction", "commenting"],
    responses: [
      "When reading a blog post, you'll find like/dislike buttons and a comment section at the bottom of the post. Click the thumbs up icon to like, thumbs down to dislike, and use the comment box to leave a comment.",
      "To interact with blogs, scroll to the bottom of any post. You'll see options to like, dislike, and leave comments.",
      "Engagement features like likes, dislikes, and comments are available at the end of each blog post. Just scroll down to find them."
    ]
  },
  {
    patterns: ["view blogs", "my posts", "my blogs", "blog list", "my content"],
    responses: [
      "To view your blogs, click on 'My Blogs' in the navigation menu. This will show all the blogs you've created, along with statistics like views, likes, and comments.",
      "Your blog posts can be found in the My Blogs section, accessible from the main navigation. You'll also see stats for each post.",
      "Check out the My Blogs page to see all your published content along with performance metrics like views and likes."
    ]
  },
  {
    patterns: ["what is", "about", "platform", "purpose"],
    responses: [
      "Blawg is a blogging platform that allows you to create, share, and discover blog posts. You can write blogs, read content from other users, like and comment on posts, and manage your own blogging profile.",
      "Blawg is a community where people share ideas through blog posts. You can write your own content, engage with others' posts, and build your online presence.",
      "This platform is designed for bloggers to publish their thoughts and connect with readers. You can create content, get feedback, and discover interesting posts from others."
    ]
  },
  {
    patterns: ["change password", "reset password", "new password", "forgot password"],
    responses: [
      "Currently, you'll need to use the 'Forgot Password' feature during login to reset your password. We're working on adding a direct password change option in the account settings.",
      "To update your password, use the Forgot Password option on the login page. A direct password change feature is coming soon.",
      "Password resets are handled through the Forgot Password flow on the login screen. We plan to add in-account password changes in a future update."
    ]
  },
  {
    patterns: ["format", "styling", "bold", "italic", "headings", "lists", "editor", "markdown"],
    responses: [
      "Yes! When writing a blog, you can use the formatting toolbar to add headings, bold/italic text, lists, links, and more. You can also add images to make your posts more engaging.",
      "The blog editor has formatting tools for styling your text with headings, emphasis, lists, and other elements. Look for the toolbar above the writing area.",
      "Rich text formatting is available in the editor. You can add headings, bold or italic text, create lists, insert links, and enhance your posts with images."
    ]
  },
  {
    patterns: ["tags", "categories", "topics", "hashtags", "categorize"],
    responses: [
      "Tags help categorize your blog posts and make them more discoverable. When creating a blog, you can add relevant tags that describe the content. Users can click on tags to find similar content.",
      "When publishing a post, you can add tags to help categorize your content. This makes it easier for readers to find posts on topics they're interested in.",
      "Adding tags to your blogs improves discoverability. Choose relevant tags that describe your content so readers can find posts on topics they care about."
    ]
  },
  {
    patterns: ["dark mode", "light mode", "theme", "night mode", "dark theme"],
    responses: [
      "Yes! You can toggle between light and dark mode by clicking the sun/moon icon in the navigation bar. Your preference will be saved for future visits.",
      "Look for the sun/moon toggle in the top navigation to switch between light and dark modes. We'll remember your preference.",
      "Blawg supports both light and dark themes. Just click the theme icon in the navbar to switch between them."
    ]
  },
  {
    patterns: ["help", "support", "assistance", "contact"],
    responses: [
      "For help and support, you're in the right place! You can also reach our team by clicking 'Email Support' in the left sidebar of the Help page to fill out our support form.",
      "Need more assistance? You can contact our support team using the Email Support option in the Help page sidebar, which will open a form to send us a message.",
      "If you need further help, click the Email Support button on this page to access our contact form and send a detailed message to our support team."
    ]
  },
  // Adding new entries about blog management, account operations, etc.
  {
    patterns: ["edit blog", "update blog", "modify post", "change blog"],
    responses: [
      "To edit a blog post, go to 'My Blogs' in the navigation menu, find the blog you want to edit, and click on it. At the bottom of your blog post, you'll find an 'Edit' button that will take you to the editor with your existing content loaded.",
      "Editing your blogs is easy - navigate to My Blogs, select the post you want to update, and look for the Edit button at the bottom of the post. This will open the editor with your content ready to be modified.",
      "If you need to make changes to a published blog, visit the My Blogs page, open the blog you want to edit, and click the Edit button at the bottom of the post. Make your changes and save them."
    ]
  },
  {
    patterns: ["delete blog", "remove blog", "remove post", "delete post"],
    responses: [
      "To delete a blog post, first go to 'My Blogs' in the navigation menu. Open the blog you want to delete, then scroll to the bottom where you'll find a 'Delete' button. You'll need to confirm the deletion to permanently remove the blog.",
      "Deleting a blog is done from the My Blogs section. Open the specific blog post, scroll down to the bottom, and click the Delete button. A confirmation dialog will appear to prevent accidental deletions.",
      "If you want to remove a blog post, navigate to it from your My Blogs page, then use the Delete option at the bottom of the post. Confirm your choice when prompted."
    ]
  },
  {
    patterns: ["change username", "update username", "new username"],
    responses: [
      "To change your username, go to 'My Account' by clicking your profile icon. In the Profile Information section, you'll find your current username with an Edit button next to it. Click Edit, enter your new username, and click Save to update it.",
      "Updating your username is done through the My Account page. Look for the Edit button next to your current username, enter the new name, and save your changes.",
      "If you want a different username, head to My Account, find the username field in Profile Information, click Edit, and follow the prompts to set a new username."
    ]
  },
  {
    patterns: ["privacy", "private", "data", "information", "security"],
    responses: [
      "Blawg takes your privacy seriously. We only collect the information necessary to provide our services. You can control what personal information is visible on your profile through the My Account settings.",
      "Your privacy is important to us. The information you share on Blawg is handled according to our privacy policy, and you can manage your personal data through your account settings.",
      "We're committed to protecting your privacy and data security. You can adjust your privacy settings in the My Account section to control what information is shared publicly."
    ]
  },
  {
    patterns: ["logout", "sign out", "log out"],
    responses: [
      "To log out of Blawg, click on your profile icon in the top right corner and select 'Sign Out' from the dropdown menu. This will end your session immediately.",
      "Signing out is simple - just click your profile picture and select Sign Out from the options that appear.",
      "To log out, use the Sign Out option in your profile menu, accessible by clicking your profile icon in the navigation bar."
    ]
  },
  {
    patterns: ["dashboard", "analytics", "stats", "statistics", "performance"],
    responses: [
      "You can view analytics for your blogs in the My Blogs section. Each blog post shows stats like views, likes, dislikes, and comments, giving you insights into your content's performance.",
      "Blog performance statistics are available on the My Blogs page. You'll see metrics for each post including view count, likes, dislikes, and comment activity.",
      "To check how your blogs are performing, visit the My Blogs section where you'll find statistics for each post, including engagement metrics and view counts."
    ]
  },
  {
    patterns: ["draft", "save draft", "unpublished", "work in progress"],
    responses: [
      "Currently, Blawg automatically saves your work as you type in the editor. If you're not ready to publish, you can simply navigate away and return later to continue where you left off. We're working on a formal drafts feature for future updates.",
      "While writing a blog, your content is saved automatically. If you need to finish it later, you can leave the page and return to the editor to continue working on it before publishing.",
      "Blawg automatically saves your work-in-progress. If you need to step away, your content will be there when you return to continue editing before publishing."
    ]
  },
  {
    patterns: ["recover", "restore", "recover blog", "restore account"],
    responses: [
      "If you've deleted a blog post, unfortunately it cannot be recovered as deletion is permanent. For account issues, please contact our support team via the Email Support button on the Help page.",
      "Deleted blogs cannot be restored as the action is permanent. If you're having account access issues, please reach out to our support team for assistance.",
      "We don't currently have a recovery option for deleted blogs. For account recovery assistance, please contact our support team through the Help page."
    ]
  },
  {
    patterns: ["image", "picture", "photo", "upload image", "add image"],
    responses: [
      "To add images to your blog post, use the image upload button in the editor toolbar (it looks like a picture icon). You can upload images from your device, and they'll be inserted at your cursor position in the blog.",
      "Adding images is easy - while editing your blog, click the image icon in the toolbar, select an image file from your device, and it will be uploaded and inserted into your post.",
      "The blog editor includes an image upload feature accessible from the toolbar. Click the image icon, choose your file, and it will be added to your post at the cursor location."
    ]
  }
];

// Default responses for when no pattern matches
const defaultResponses = [
  "I'm not sure I understand. Could you ask about blog creation, account settings, or another feature of Blawg?",
  "I don't have specific information about that. Try asking about creating blogs, managing your account, or using Blawg features.",
  "I'm not able to answer that specific question. I can help with topics like writing blogs, account settings, or using platform features."
];

/**
 * Process a message and generate a response
 * @param {string} message - The user's message
 * @returns {string} - The bot's response
 */
export function processMessage(message) {
  if (!message) return getRandomResponse(defaultResponses);
  
  const normalizedMessage = message.toLowerCase();
  
  // Check for matches in the knowledge base
  for (const item of knowledgeBase) {
    for (const pattern of item.patterns) {
      if (normalizedMessage.includes(pattern)) {
        return getRandomResponse(item.responses);
      }
    }
  }
  
  // If no match is found, return a default response
  return getRandomResponse(defaultResponses);
}

/**
 * Get a random response from an array of possible responses
 * @param {string[]} responses - Array of possible responses
 * @returns {string} - A randomly selected response
 */
function getRandomResponse(responses) {
  const index = Math.floor(Math.random() * responses.length);
  return responses[index];
}

/**
 * Process chat history and generate a contextual response
 * @param {Array} messages - Array of message objects with role and content
 * @returns {string} - The bot's response
 */
export function processChat(messages) {
  if (!messages || !messages.length) {
    return "Hi there! I'm your Blawg assistant. How can I help you today?";
  }
  
  // Get the latest user message
  const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
  
  if (!lastUserMessage) {
    return "Hi there! I'm your Blawg assistant. How can I help you today?";
  }
  
  return processMessage(lastUserMessage.content);
} 