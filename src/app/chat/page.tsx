"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Sparkles,
  ArrowLeft,
  Loader2,
  MessageSquare,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";

import Button from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const suggestedQuestions = [
  "What should I wear for a job interview?",
  "What colors look best on olive skin?",
  "Suggest luxury handbags under $500",
  "What should I wear in winter?",
  "How to build a capsule wardrobe?",
  "Best outfit for a wedding guest?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      content: content.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: data.content,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={i} className="font-bold mt-3 mb-1">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <li key={i} className="ml-4 list-disc text-sm">
            {renderBold(line.slice(2))}
          </li>
        );
      }
      if (line.startsWith("✅") || line.startsWith("✨") || line.startsWith("🚫")) {
        return (
          <p key={i} className="text-sm ml-2">
            {renderBold(line)}
          </p>
        );
      }
      if (line.match(/^\d+\./)) {
        return (
          <p key={i} className="text-sm ml-2 mt-1">
            {renderBold(line)}
          </p>
        );
      }
      if (line.trim() === "") return <br key={i} />;
      return (
        <p key={i} className="text-sm">
          {renderBold(line)}
        </p>
      );
    });
  };

  const renderBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors mb-3"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-[var(--font-plus-jakarta)]">
                  AI Fashion <span className="gradient-text">Assistant</span>
                </h1>
                <p className="text-xs text-foreground-muted">
                  Ask me anything about fashion, styling, and outfits
                </p>
              </div>
            </div>
          </motion.div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card p-4 space-y-4 mb-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mb-4 shadow-lg shadow-brand/20">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-lg font-bold mb-2">
                  Welcome to StyleMind Chat
                </h2>
                <p className="text-sm text-foreground-muted mb-6 max-w-md">
                  I&apos;m your AI fashion assistant. Ask me about styling, colors,
                  outfits for any occasion, or fashion advice.
                </p>

                {/* Suggested questions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-left px-4 py-3 rounded-xl border border-border hover:border-brand/30 hover:bg-brand/5 transition-all text-sm text-foreground-muted hover:text-foreground cursor-pointer flex items-start gap-2"
                    >
                      <Lightbulb className="h-4 w-4 text-brand flex-shrink-0 mt-0.5" />
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "gradient-brand text-white rounded-br-md"
                          : "bg-background-secondary border border-border rounded-bl-md"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <div className="space-y-1 leading-relaxed">{renderContent(message.content)}</div>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-background-secondary border border-border rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-foreground-muted">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Thinking about your style...
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about fashion, styling, colors..."
              className="flex-1 h-12 px-5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand placeholder:text-foreground-muted/50"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-12 w-12"
              icon={<Send className="h-5 w-5" />}
            />
          </form>
        </div>
      </main>
    </>
  );
}
