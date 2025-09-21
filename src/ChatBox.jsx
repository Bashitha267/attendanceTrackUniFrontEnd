import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

// --- Helper Icons ---
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

const API_KEY = "AIzaSyD8vND5s90jrjfBcdggIK2zKdDCenE1F00";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const ChatBox = ({ isOpen, isClose }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const chatEndRef = useRef(null);

  // Fetch dynamic data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await axios.get('https://attendance-uni-backend.vercel.app/users/getusers');
        const subjectsRes = await axios.get('https://attendance-uni-backend.vercel.app/subjects/getsubjects');

        setUsers(usersRes.data.user);
        setSubjects(subjectsRes.data.subjects);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Developers list
  const developers = [
    { name: "HMN Bashitha", id: "2022/CSC/023" },
    { name: "Nipuna Diyaloga", id: "2022/CSC/017" },
    { name: "Anjula Nadeeshan", id: "2022/CSC/055" },
    { name: "Meenaha", id: "" },
    { name: "Jasmini", id: "" },
    { name: "Nuranga", id: "" },
  ];

  // Create chatbot prompt dynamically
  const createChatbotPrompt = (userQuery) => `
You are "AttendBot", a helpful AI assistant for an attendance management website.
Answer based only on the provided data.

Users Info: ${JSON.stringify(users)}
Subjects Info: ${JSON.stringify(subjects)}
Developers Info: ${JSON.stringify(developers)}

User: ${userQuery}
Bot:
`;

  // Handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: message };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const fullPrompt = createChatbotPrompt(message);
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      const botMessage = { sender: 'bot', text: text };
      setChatHistory(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Error generating content:", error);
      const errorMessage = { sender: 'bot', text: 'Sorry, something went wrong.' };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`z-50 fixed bottom-5 right-5 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-white rounded-xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out
      ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
      
      <div className="bg-purple-600 text-white p-4 flex justify-between items-center rounded-t-xl">
        <h3 className="text-lg font-semibold">Attendo AI</h3>
        <button onClick={() => isClose(!isOpen)} className="hover:bg-purple-900 p-1 rounded-full" aria-label="Close Chat">
          <CloseIcon />
        </button>
      </div>

     
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
         <div
  className={`p-3 max-w-xs text-sm 
    ${msg.sender === "user" 
      ? "bg-purple-600 text-white rounded-t-2xl rounded-l-2xl rounded-br-none ml-auto" 
      : "bg-gray-300 text-gray-800 rounded-t-2xl rounded-r-2xl rounded-bl-none mr-auto"
    }`}
>
  {msg.text}
</div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-500 p-3 rounded-lg max-w-xs">
              Thinking...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask AttendBot..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-900 disabled:bg-indigo-300 transition-colors"
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
