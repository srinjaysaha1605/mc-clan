import React, { useState } from "react";
import { motion } from "motion/react";
import { Lock, X } from "lucide-react";
import { api } from "../lib/api";

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLogin = ({ isOpen, onClose, onSuccess }: AdminLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await api.login(email, password);
      if (user) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "SYSTEM ERROR: UNABLE TO AUTHENTICATE");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md border border-white/20 bg-black p-8 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white hover:text-black transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 border-2 border-white flex items-center justify-center mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black tracking-tighter uppercase glitch-text">
            ADMIN ACCESS
          </h2>
          <p className="text-[10px] text-white/50 uppercase tracking-[0.3em] mt-2">
            SECURE TERMINAL LOGIN
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-white/50 uppercase tracking-widest">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border border-white/20 p-3 font-mono text-sm focus:border-white outline-none transition-colors"
                placeholder="ADMIN@SYNDICATE.NET"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-white/50 uppercase tracking-widest">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border border-white/20 p-3 font-mono text-sm focus:border-white outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-[10px] font-mono text-center animate-pulse uppercase">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-black py-4 uppercase tracking-widest hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                AUTHENTICATING...
              </>
            ) : (
              "INITIALIZE SESSION"
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};
