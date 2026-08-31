import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Player } from "./types";
import { cn } from "./lib/utils";
import { PlayerCard } from "./components/PlayerCard";
import { TerminalOverlay } from "./components/TerminalOverlay";
import { AdminLogin } from "./components/AdminLogin";
import { AdminDashboard } from "./components/AdminDashboard";
import { ClanCodex } from "./components/ClanCodex";
import { TerminalCommand } from "./components/TerminalCommand";
import { ShieldAlert, Info } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { api } from "./lib/api";
import { supabase, isSupabaseConfigured } from "./lib/supabase";

export default function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showCodex, setShowCodex] = useState(false);
  const [isRedMode, setIsRedMode] = useState(false);
  const [isChaosMode, setIsChaosMode] = useState(false);
  const [isUltimate, setIsUltimate] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewMode, setViewMode] = useState<'site' | 'admin'>('site');
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const handleTitleTap = () => {
    const now = Date.now();

    // Reset counter if taps are more than 1 second apart
    if (now - lastTapTime > 1000) {
      setTapCount(1);
    } else {
      const newCount = tapCount + 1;

      if (newCount >= 3) {
        setShowTerminal(true);
        setTapCount(0);
      } else {
        setTapCount(newCount);
      }
    }

    setLastTapTime(now);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setIsAuthReady(true);
      return;
    }

    // Auth Listener
    const unsubscribeAuth = api.onAuthChange(async (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);

      if (currentUser) {
        try {
          const profile = await api.getUserProfile(currentUser.id);

          if (!profile) {
            await api.createUserProfile(
              currentUser.id,
              currentUser.email || ""
            );
          }

          // Check if user is admin (based purely on database role)
          const updatedProfile = await api.getUserProfile(currentUser.id);
          setIsAdmin(updatedProfile?.role === 'admin');
        } catch (err) {
          console.error("Auth profile error:", err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });

    // Players Subscription
    const unsubscribePlayers = api.subscribeToPlayers((data) => {
      setPlayers(data);
      setLoading(false);
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "K") {
        e.preventDefault();
        setShowLogin(true);
      }

      if (e.key === "/" || e.key === "~") {
        e.preventDefault();
        setShowTerminal(true);
      }
    };

    // Safety timeout for auth readiness
    const safetyTimeout = setTimeout(() => {
      setIsAuthReady(true);
    }, 5000);

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      unsubscribeAuth();
      unsubscribePlayers();
      clearTimeout(safetyTimeout);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    await api.logout();
    setIsAdmin(false);
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono p-8 text-center">
        <div className="w-16 h-16 border-2 border-red-500 flex items-center justify-center mb-6 text-red-500 animate-pulse">
          <ShieldAlert size={32} />
        </div>

        <h1 className="text-2xl font-black uppercase mb-4 tracking-tighter text-red-500">
          CONFIGURATION ERROR
        </h1>

        <div className="max-w-md bg-zinc-900 border border-zinc-800 p-6 rounded-lg text-left space-y-4">
          <p className="text-zinc-400 text-xs uppercase tracking-widest">
            Supabase environment variables are missing. The application cannot
            connect to the database.
          </p>

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Status Check:
            </p>

            <ul className="text-[10px] space-y-1 font-mono">
              <li className="flex items-center gap-2">
                <span className="text-red-500">[MISSING]</span>
                <code className="bg-black px-1 py-0.5 rounded text-zinc-300">
                  VITE_SUPABASE_URL
                </code>
              </li>

              <li className="flex items-center gap-2">
                <span className="text-red-500">[MISSING]</span>
                <code className="bg-black px-1 py-0.5 rounded text-zinc-300">
                  VITE_SUPABASE_ANON_KEY
                </code>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <p className="text-[10px] text-zinc-500 mb-2 uppercase font-bold">
              How to fix in Netlify:
            </p>

            <ol className="text-[10px] text-zinc-400 list-decimal list-inside space-y-1 uppercase tracking-tighter">
              <li>
                Open <span className="text-white">Site configuration</span> &gt;{" "}
                <span className="text-white">Environment variables</span>
              </li>
              <li>Add both variables listed above</li>
              <li>Go to <span className="text-white">Deploys</span> tab</li>
              <li>
                Click <span className="text-white">Trigger deploy</span> &gt;{" "}
                <span className="text-white">
                  Clear cache and deploy site
                </span>
              </li>
            </ol>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-8 px-6 py-2 border border-white/20 hover:bg-white hover:text-black transition-colors text-xs uppercase tracking-widest"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-sm tracking-widest animate-pulse">
        INITIALIZING SYSTEM...
      </div>
    );
  }

  if (isAdmin && viewMode === 'admin') {
    return (
      <AdminDashboard
        players={players}
        onLogout={handleLogout}
        onViewSite={() => setViewMode('site')}
      />
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen bg-black text-white selection:bg-white selection:text-black relative overflow-hidden transition-colors duration-500",
        isRedMode &&
          "bg-red-950/20 text-red-500 selection:bg-red-500 selection:text-black border-red-500/20",
        isChaosMode && "chaos-glitch"
      )}
    >
      {/* Admin Bar */}
      {isAdmin && (
        <div className="relative z-[60] bg-white text-black p-2 flex justify-between items-center px-8 font-black text-[10px] tracking-[0.3em] uppercase">
          <span>ADMINISTRATOR SESSION ACTIVE</span>

          <div className="flex gap-4">
            <button
              onClick={() => setViewMode('admin')}
              className="hover:underline"
            >
              OPEN DASHBOARD
            </button>

            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline"
            >
              TERMINATE SESSION
            </button>
          </div>
        </div>
      )}

      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="scanline" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <motion.h1
            onClick={handleTitleTap}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none glitch-text cursor-pointer select-none"
          >
            ᗰᗩᑕᕼᑌᗪᗩ<br />ᗰᑕ☣︎
          </motion.h1>

          <motion.p
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-white/40 mt-4"
          >
            ELITE GAMING SYNDICATE // EST. 2024
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-end gap-2 text-right"
        >
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/60">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            SERVER STATUS: OPTIMAL
          </div>

          <button
            onClick={() => setShowCodex(true)}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors border border-white/10 px-3 py-1 bg-white/[0.02] hover:bg-white/[0.05]"
          >
            <Info size={10} />
            CLAN INTEL // CODEX
          </button>

          <div className="text-[10px] uppercase tracking-widest text-white/40">
            LOC: ASIA-PACIFIC // ENCRYPTION: AES-256
          </div>

          {user && (
            <div className="text-[10px] uppercase tracking-widest text-white/60 mt-2">
              USER: {user.email?.split('@')[0]} // STATUS: AUTHENTICATED
            </div>
          )}
        </motion.div>
      </header>

      {/* Main Grid */}
      <main className="relative z-10 p-8 md:p-12 pt-0">
        {loading ? (
          <div className="h-[50vh] flex items-center justify-center font-mono text-sm tracking-widest animate-pulse">
            INITIALIZING DATABASE...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {players.map((player) => (
              <PlayerCard
                key={player.id}
                player={{
                  ...player,
                  image:
                    isUltimate && player.ultimate_image
                      ? player.ultimate_image
                      : player.image
                }}
                onClick={() => setSelectedPlayer(player)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] uppercase tracking-[0.3em] text-white/20">
        <div>© 2026 MACHUDA. ALL RIGHTS RESERVED.</div>

        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">
            TWITCH
          </a>
          <a href="#" className="hover:text-white transition-colors">
            DISCORD
          </a>
          <a href="#" className="hover:text-white transition-colors">
            X.COM
          </a>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {selectedPlayer && (
          <TerminalOverlay
            player={selectedPlayer}
            onClose={() => setSelectedPlayer(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCodex && (
          <ClanCodex onClose={() => setShowCodex(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTerminal && (
          <TerminalCommand
            onClose={() => setShowTerminal(false)}
            onCommand={(cmd) => {
              const c = cmd.toUpperCase();

              if (c === "OVERRIDE") setIsRedMode(true);
              if (c === "CHAOS") setIsChaosMode(true);
              if (c === "ULTIMATE") setIsUltimate(true);

              if (c === "RESET") {
                setIsRedMode(false);
                setIsChaosMode(false);
                setIsUltimate(false);
              }
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogin && (
          <AdminLogin
            isOpen={showLogin}
            onClose={() => setShowLogin(false)}
            onSuccess={() => setIsAdmin(true)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
