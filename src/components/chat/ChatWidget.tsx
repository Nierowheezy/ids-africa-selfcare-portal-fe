"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  X, 
  Send, 
  Minus, 
  Bot,
  Sparkles,
  Loader2
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const quickReplies = [
  "How do I renew my subscription?",
  "What are the payment methods?",
  "How can I contact support?",
  "Check my service status",
];

const botResponses: Record<string, string> = {
  "how do i renew my subscription?": 
    "To renew your subscription, go to Dashboard > Payment > Make Payment. You can pay using Paystack (card) or bank transfer. Your current plan will be extended once payment is confirmed.",
  "what are the payment methods?":
    "We accept two payment methods:\n\n1. **Paystack** - Pay instantly with your debit/credit card\n2. **Bank Transfer** - Transfer directly to our bank account\n\nBoth methods are secure and your service is activated immediately after payment confirmation.",
  "how can i contact support?":
    "You can reach our support team through:\n\n📧 Email: support@ids-africa.com\n📞 Phone: +234 800 123 4567\n🎫 Tickets: Create a support ticket from your dashboard\n\nOur team is available 24/7 to assist you!",
  "check my service status":
    "Based on your account, your current service status is:\n\n📦 Plan: Brauz Bronze\n🔴 Status: Suspended\n📅 Last Payment: 9th August 2022\n\nTo restore your service, please make a payment of NGN 12,000.",
  default:
    "Thanks for your message! I'm here to help you with:\n\n• Subscription renewals\n• Payment inquiries\n• Service status\n• Technical support\n\nPlease select a topic or describe your issue.",
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! 👋 I'm your IDS Africa assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      const response = botResponses[lowerText] || botResponses.default;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[380px] transition-all duration-300 ease-out ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4 pointer-events-none"
        } ${isMinimized ? "h-[60px]" : "h-[520px]"}`}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 h-full flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">IDS Assistant</h3>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white/80 text-xs">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
              >
                <Minus className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  >
                    {message.sender === "bot" && (
                      <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                        <AvatarFallback className="bg-red-100 text-red-600">
                          <Sparkles className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                        message.sender === "user"
                          ? "bg-red-600 text-white rounded-br-md"
                          : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "user"
                            ? "text-white/70"
                            : "text-gray-400"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {message.sender === "user" && (
                      <Avatar className="h-8 w-8 ml-2 flex-shrink-0">
                        <AvatarImage src="/images/profile.png" />
                        <AvatarFallback className="bg-gray-200 text-gray-600">
                          U
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center space-x-2 animate-in fade-in duration-300">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-red-100 text-red-600">
                        <Sparkles className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                      <div className="flex space-x-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              {messages.length <= 2 && (
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Quick replies:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => handleSend(reply)}
                        className="text-xs px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-600 transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 h-11 rounded-full border-gray-200 focus:border-red-500 focus:ring-red-500"
                  />
                  <Button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isTyping}
                    className="h-11 w-11 rounded-full bg-red-600 hover:bg-red-700 p-0 flex items-center justify-center transition-all hover:scale-105"
                  >
                    {isTyping ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
