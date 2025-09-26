import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
  </svg>
);


const API_KEY = "AIzaSyAG2dC2-OVTNecpplh4lRJevU2_xdrTHEE"; 
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });


const createChatbotPrompt = (history, users, subjects, developers) => {
    // This part remains the same. It formats the past conversation.
    const formattedHistory = history.map(msg => `${msg.sender === 'user' ? 'User' : 'Bot'}: ${msg.text}`).join('\n');

    // The return statement contains the new, improved prompt.
    return `You are "AttendBot", a helpful and intelligent AI assistant for an attendance management website named "Attendo".

Your primary goal is to answer user questions based *only* on the provided Data Context. You must be precise, helpful, and adhere to the following rules strictly.

**Core Instructions & Rules:**

1.  **System Introduction:** If the user asks "what is Attendo?", "who are you?", or a similar question about the system's purpose, you must respond with: "Attendo is a smart QR-based attendance marking and management system."

2.  **Strict Data Adherence:** All your answers must be derived *exclusively* from the "Data Context" section. Do not invent any information, including contact details, schedules, or personal opinions. If the information is not in the context, you must respond with: "I'm sorry, I don't have that information."

3.  **CRITICAL SECURITY RULE:** Under NO circumstances should you EVER reveal or mention the 'pincode' for any subject. The 'pincode' is highly confidential. If a user asks for it, refuse the request by saying something like, "I cannot share the subject pincode as it is confidential information."

4.  **Intelligent Name Matching:** You must handle minor spelling mistakes in names.
    * First, try to find an exact match for a name in the provided data.
    * If no exact match is found, look for the most likely person the user is referring to.
    * **Example:** If the user asks about "lecture ms kamali", you should recognize this is a probable misspelling of "kamila" from the 'Users Info' and provide details for "Sukumali". You can gently correct the user in your response, for example: "Regarding Ms. Sukumali (assuming you meant 'ms sukamali'), her role is 'Lecturer' and her email is..."

**Data Context:**
---
Users Info: ${JSON.stringify(users, null, 2)}

Subjects Info: ${JSON.stringify(subjects, null, 2)}

Developers Info: ${JSON.stringify(developers, null, 2)}
---

**Conversation History:**
${formattedHistory}
User: ${history.length > 0 ? history[history.length - 1].text : ''}
Bot:
`;
};


const ChatBox = ({ isOpen, isClose }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([{sender:"bot",text:"Welcome to Attendo,How Can I help You Today."}]);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const chatEndRef = useRef(null);

  // Static data can be defined outside the render cycle.
  const developers = useRef([
    { name: "HMN Bashitha", id: "2022/CSC/023" },
    { name: "Nipuna Diyaloga", id: "2022/CSC/017" },
    { name: "Anjula Nadeeshan", id: "2022/CSC/055" },
    { name: "Meenaha", id: "" },
    { name: "Jasmini", id: "" },
    { name: "Nuranga", id: "" },
  ]).current;


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use Promise.all for concurrent requests
        const [usersRes, subjectsRes] = await Promise.all([
          axios.get('https://attendance-uni-backend.vercel.app/users/getusers'),
          axios.get('https://attendance-uni-backend.vercel.app/subjects/getsubjects')
        ]);

        setUsers(usersRes.data.user || []);
        setSubjects(subjectsRes.data.subjects || []);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        // Optionally, inform the user in the chat
        setChatHistory(prev => [...prev, { sender: 'bot', text: 'Sorry, I am having trouble connecting to my knowledge base.' }]);
      }
    };
    if (isOpen) {
        fetchData();
    }
  }, [isOpen]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: message };
    // Create the next state of chat history immediately
    const newChatHistory = [...chatHistory, userMessage];

    setChatHistory(newChatHistory);
    setMessage('');
    setIsLoading(true);

    try {
      // Pass the updated history to the prompt function
      const fullPrompt = createChatbotPrompt(newChatHistory, users, subjects, developers);
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      const botMessage = { sender: 'bot', text: text };
      setChatHistory(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Error generating content:", error);
      const errorMessage = { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`z-50 fixed bottom-5 right-5 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-white rounded-xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out
      ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>

      <div className="bg-purple-600 text-white p-4 flex justify-between items-center rounded-t-xl">
        <h3 className="text-lg font-semibold">AttendBot AI</h3>
        <button onClick={() => isClose(!isOpen)} className="hover:bg-purple-700 p-1 rounded-full transition-colors" aria-label="Close Chat">
          <CloseIcon />
        </button>
      </div>


      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`p-3 max-w-xs lg:max-w-sm text-sm rounded-2xl shadow
                ${msg.sender === "user"
                  ? "bg-purple-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
            >
              {/* Basic markdown-like formatting for newlines */}
              {msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-500 p-3 rounded-2xl rounded-bl-none max-w-xs shadow">
              <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask AttendBot..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
            aria-label="Send Message"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
