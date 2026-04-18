/**
 * ClientChat — AI Concierge Chat
 *
 * Answers questions about treatments, pricing, and recommendations.
 * Trained on Radiantilyk Aesthetic services and pricing.
 * Pushes to booking when appropriate.
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Bot, User, ArrowLeft, Sparkles, CalendarDays,
  Loader2, MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { clientPath } from "@/lib/clientPaths";

const C = {
  gold: "#B8964A",
  goldLight: "#C4A882",
  ivory: "#FAF7F2",
  charcoal: "#2C2C2C",
  charcoalLight: "#4A4A4A",
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  "What should I get for my jawline?",
  "How much does Botox cost?",
  "What's good for acne scars?",
  "Do you offer financing?",
  "What's the difference between filler and Botox?",
  "What facial do you recommend?",
];

export default function ClientChat() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your AI beauty concierge at Radiantilyk Aesthetic. I can help you with treatment recommendations, pricing questions, and booking. What can I help you with today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reply || "I'm sorry, I couldn't process that. Could you try rephrasing?",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "I'm having trouble connecting right now. Please try again in a moment, or feel free to call us directly!",
            timestamp: new Date(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm having trouble connecting right now. Please try again in a moment!",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: C.ivory }}>
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 pt-12 pb-4 flex items-center gap-3"
        style={{
          background: `linear-gradient(135deg, ${C.charcoal} 0%, ${C.charcoalLight} 100%)`,
        }}
      >
        <button
          onClick={() => setLocation(clientPath("/home"))}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.gold + "30" }}>
            <Sparkles className="w-4 h-4" style={{ color: C.gold }} />
          </div>
          <div>
            <p className="text-sm font-medium text-white">AI Beauty Concierge</p>
            <p className="text-[10px] text-white/50">Powered by Radiantilyk</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                style={{
                  background: msg.role === "assistant" ? C.gold + "15" : C.charcoal + "10",
                }}
              >
                {msg.role === "assistant" ? (
                  <Bot className="w-3.5 h-3.5" style={{ color: C.gold }} />
                ) : (
                  <User className="w-3.5 h-3.5" style={{ color: C.charcoal }} />
                )}
              </div>
              <div
                className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                style={{
                  background: msg.role === "assistant" ? "white" : C.gold,
                  color: msg.role === "assistant" ? C.charcoal : "white",
                  borderTopLeftRadius: msg.role === "assistant" ? "4px" : undefined,
                  borderTopRightRadius: msg.role === "user" ? "4px" : undefined,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                {msg.content}
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: C.gold + "15" }}>
              <Bot className="w-3.5 h-3.5" style={{ color: C.gold }} />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white" style={{ borderTopLeftRadius: "4px" }}>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: C.gold, animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: C.gold, animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: C.gold, animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions (show when few messages) */}
      {messages.length <= 2 && (
        <div className="flex-shrink-0 px-4 pb-2">
          <p className="text-[10px] font-medium tracking-wider uppercase mb-2" style={{ color: C.charcoalLight + "60" }}>
            Popular Questions
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="px-3 py-1.5 rounded-full text-xs border hover:shadow-sm transition-shadow"
                style={{ borderColor: C.gold + "30", color: C.charcoal, background: "white" }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Book CTA */}
      {messages.length > 3 && (
        <div className="flex-shrink-0 px-4 pb-2">
          <button
            onClick={() => setLocation(clientPath("/book"))}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium"
            style={{ background: C.gold + "10", color: C.gold, border: `1px solid ${C.gold}20` }}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Ready to book? Schedule your appointment
          </button>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex-shrink-0 px-4 pb-6 pt-2"
        style={{ background: C.ivory }}
      >
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border"
          style={{ borderColor: C.gold + "20" }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about treatments, pricing..."
            disabled={isLoading}
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
            style={{ color: C.charcoal }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-30"
            style={{ background: C.gold, color: "white" }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
