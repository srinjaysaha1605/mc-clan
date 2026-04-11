import React, { useEffect } from "react";
import { motion } from "motion/react";
import { X, Shield, Zap, Target, Eye, Anchor, Info } from "lucide-react";

interface ClanCodexProps {
  onClose: () => void;
}

export const ClanCodex: React.FC<ClanCodexProps> = ({ onClose }) => {
  useEffect(() => {
    const audio = new Audio("https://www.soundjay.com/communication/sounds/digital-beeps-05.mp3");
    audio.volume = 0.5;
    audio.play().catch((e) => console.warn("Audio autoplay blocked or failed:", e));
  }, []);

  const functions = [
    { name: "ASSAULT", desc: "front-line pressure, initiates fights", icon: <Zap size={16} /> },
    { name: "CONTROL", desc: "dictates pace, zones, slows enemies", icon: <Shield size={16} /> },
    { name: "SUPPORT", desc: "enables team, utility, backup", icon: <Info size={16} /> },
    { name: "RECON", desc: "info gathering, tracking, awareness", icon: <Eye size={16} /> },
    { name: "ANCHOR", desc: "holds position, defensive backbone", icon: <Anchor size={16} /> },
  ];

  const profiles = [
    { name: "ALPHA", desc: "dominant, leads fights, high confidence, aggressive control" },
    { name: "BETA", desc: "adaptive, supports flow, flexible playstyle" },
    { name: "GAMMA", desc: "unpredictable, chaotic, hard to read" },
    { name: "DELTA", desc: "precise, calculated, methodical execution" },
    { name: "OMEGA", desc: "silent, lethal, endgame closer, low presence high impact" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4 md:p-8"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-5xl h-full max-h-[90vh] bg-black border border-white/10 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-white/20 flex items-center justify-center text-white">
              <Target size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter uppercase">CLAN INTEL // CODEX</h2>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Operational Framework & Archetypes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-16 custom-scrollbar">
          {/* Clan Description */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <h3 className="text-xs font-black uppercase tracking-[0.5em] text-white/60">CLAN DESCRIPTION</h3>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg md:text-xl font-light leading-relaxed text-white/80 italic">
                "Masters At Chaos Humbling Useless Dumb Amateurs. We do what we do best, believe that or MACHUDA"
              </p>
              <div className="mt-8 flex justify-center gap-12 text-[10px] uppercase tracking-[0.3em] text-white/30">
                <div>EST. 2024</div>
                <div>SECURE NETWORK</div>
                <div>GLOBAL OPERATIONS</div>
              </div>
            </div>
          </section>

          {/* Functions */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <h3 className="text-xs font-black uppercase tracking-[0.5em] text-white/60">OPERATIONAL FUNCTIONS</h3>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {functions.map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors group"
                >
                  <div className="text-white/40 group-hover:text-white transition-colors mb-4">
                    {f.icon}
                  </div>
                  <h4 className="text-sm font-black tracking-widest mb-2">{f.name}</h4>
                  <p className="text-[10px] uppercase tracking-wider leading-relaxed text-white/40 group-hover:text-white/60 transition-colors">
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Profiles */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <h3 className="text-xs font-black uppercase tracking-[0.5em] text-white/60">PROFILE ARCHETYPES</h3>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profiles.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ x: i % 2 === 0 ? -20 : 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="flex gap-6 p-6 border border-white/5 bg-white/[0.01] hover:border-white/20 transition-all"
                >
                  <div className="text-4xl font-black text-white/5 select-none">
                    0{i + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-black tracking-tighter uppercase mb-1">{p.name}</h4>
                    <p className="text-xs uppercase tracking-widest leading-relaxed text-white/50">
                      {p.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] flex justify-between items-center text-[8px] uppercase tracking-[0.4em] text-white/20">
          <div>MACHUDA // INTEL // v4.02.1</div>
          <div>ENCRYPTED DATA STREAM // 256-BIT</div>
        </div>
      </motion.div>
    </motion.div>
  );
};
