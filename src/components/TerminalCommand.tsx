import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Terminal } from "lucide-react";

interface TerminalCommandProps {
  onClose: () => void;
  onCommand: (cmd: string) => void;
}

export const TerminalCommand: React.FC<TerminalCommandProps> = ({ onClose, onCommand }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input.trim());
      setInput("");
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-0 left-0 w-full z-[100] p-4 flex justify-center"
    >
      <div className="w-full max-w-xl bg-black border border-white/20 shadow-2xl p-4 flex items-center gap-4">
        <Terminal size={20} className="text-white/40" />
        <form onSubmit={handleSubmit} className="flex-1">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onBlur={onClose}
            placeholder="ENTER COMMAND (OVERRIDE, CHAOS, RESET)..."
            className="w-full bg-transparent border-none outline-none text-white font-mono text-sm uppercase tracking-widest placeholder:text-white/20"
          />
        </form>
        <div className="text-[10px] text-white/20 font-mono">PRESS ENTER</div>
      </div>
    </motion.div>
  );
};
