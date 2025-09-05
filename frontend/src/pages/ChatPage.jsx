import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { useGetProductInfoAIMutation, useInsuranceChatMutation, useGetChatProductsQuery } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your insurance assistant. I can help you learn more about our insurance products, explain coverage options, and answer any insurance-related questions. What would you like to know?",
      sender: "bot",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [getProductInfoAI] = useGetProductInfoAIMutation();
  const [insuranceChat] = useInsuranceChatMutation();
  const { data: productsData } = useGetChatProductsQuery();
  const products = productsData?.products || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Check if the message is about a specific product pattern
      const productMatch = inputMessage.match(/(tell me about|info on|information about|explain) (.+?) (from|by) (.+)/i);
      
      let response;
      
      if (productMatch) {
        // If it's a specific product query
        const productName = productMatch[2].trim();
        const companyName = productMatch[4].trim();
        
        response = await getProductInfoAI({
          companyName,
          productName
        }).unwrap();
        
        const botResponse = {
          id: Date.now() + 1,
          text: response.info || "I couldn't find specific information about that product. Please try another query or ask a general insurance question.",
          sender: "bot",
        };
        
        setMessages((prev) => [...prev, botResponse]);
      } else {
        // Use LangChain for general insurance questions and explanations
        response = await insuranceChat(inputMessage).unwrap();
        
        const botResponse = {
          id: Date.now() + 1,
          text: response.response || "I'd be happy to help with your insurance questions. Could you please provide more details?",
          sender: "bot",
        };
        
        setMessages((prev) => [...prev, botResponse]);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorResponse = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting to the information service. Please try again later.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate suggestion buttons based on available products
  const productSuggestions = products.slice(0, 4).map(product => 
    `Tell me about ${product.product_name} from ${product.company_name}`
  );

  const generalSuggestions = [
    "What's the difference between term and whole life insurance?",
    "How does health insurance work?",
    "What factors affect insurance premiums?",
    "Explain deductibles and copayments"
  ];

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  return (
    <section className="bg-gray-900 text-gray-200 px-4 py-16 md:px-8">
      <div className="container mx-auto max-w-4xl">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-4">
            Insurance Assistant
          </h2>
          <p className="text-lg text-gray-400">
            Ask me anything about insurance products, coverage, or concepts
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start max-w-xs md:max-w-md lg:max-w-lg ${
                      message.sender === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === "user"
                          ? "bg-blue-600 ml-3"
                          : "bg-green-600 mr-3"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-2xl ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-200"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-green-600 mr-3">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="p-3 rounded-2xl bg-gray-700">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          <div className="border-t border-gray-700 p-4 bg-gray-750">
            <p className="text-sm text-gray-400 mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {productSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs bg-gray-600 text-gray-200 px-3 py-1 rounded-full hover:bg-gray-500 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
              {generalSuggestions.map((suggestion, index) => (
                <button
                  key={index + productSuggestions.length}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs bg-gray-600 text-gray-200 px-3 py-1 rounded-full hover:bg-gray-500 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-700 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about insurance products, coverage, or concepts..."
                className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}