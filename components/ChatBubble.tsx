"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: string;
  isBot?: boolean;
  delay?: number;
}

export function ChatBubble({ message, isBot = false, delay = 0 }: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "flex w-full mb-4",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-5 py-3 text-[15px] leading-relaxed shadow-sm whitespace-pre-line",
          isBot
            ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-100 dark:border-slate-700"
            : "bg-primary text-primary-foreground rounded-br-none"
        )}
      >
        {message}
      </div>
    </motion.div>
  );
}
