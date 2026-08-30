import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Player } from "../types";
import { cn } from "../lib/utils";

interface PlayerCardProps {
  player: Player;
  onClick: () => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onClick }) => {
  return (
    <motion.div
      layoutId={`card-${player.id}`}
      onClick={onClick}
      className={cn(
        "relative group cursor-pointer bg-black border border-white/10 overflow-hidden",
        "aspect-[2/3] flex flex-col items-center justify-end p-6",
        "card-glow"
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Silhouette Image */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.img
            key={player.image}
            src={player.image}
            alt={player.alias}
            initial={{ opacity: 0, scale: 0.95, filter: "brightness(2) blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "brightness(1) blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "brightness(2) blur(4px)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full h-full object-contain silhouette-img opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

      {/* Content */}
      <div className="relative z-10 text-center w-full">
        <h3 className="text-3xl font-black tracking-tighter uppercase mb-1 glitch-text">
          {player.alias}
        </h3>
        <p className="text-[10px] text-white/50 italic uppercase tracking-widest line-clamp-1">
          "{player.quote}"
        </p>
      </div>

      {/* Intel Scan Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-scan z-20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/[0.02] backdrop-blur-[1px]">
          <div className="text-[8px] font-black tracking-[0.4em] uppercase text-white/40 animate-pulse mb-1">
            SCANNING...
          </div>
          <div className="text-[10px] font-black tracking-[0.2em] uppercase text-white animate-reveal">
            MATCH FOUND: {player.alias}
          </div>
        </div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/30 group-hover:border-white transition-colors" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/30 group-hover:border-white transition-colors" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/30 group-hover:border-white transition-colors" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/30 group-hover:border-white transition-colors" />
    </motion.div>
  );
};
