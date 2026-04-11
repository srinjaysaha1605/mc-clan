import { motion } from "motion/react";
import { X } from "lucide-react";
import { Player } from "../types";
import { useTypingEffect } from "../hooks/useTypingEffect";

interface TerminalOverlayProps {
  player: Player | null;
  onClose: () => void;
}

export const TerminalOverlay = ({ player, onClose }: TerminalOverlayProps) => {
  if (!player) return null;

  const dataString = `
> ACCESSING ENCRYPTED DATABASE...
> DECRYPTING CALLSIGN: ${player.callsign}
> ANALYZING COMBAT DATA...

----------------------------------------
[ CALLSIGN ] : ${player.callsign}
[ FUNCTION ] : ${player.function}
[ PROFILE  ] : ${player.combatProfile}
[ WEAPON   ] : ${player.primaryWeapon}
[ STATUS   ] : ${player.status}
----------------------------------------

> SYSTEM READY.
  `.trim();

  const { displayedText } = useTypingEffect(dataString, 10, true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4 md:p-12"
    >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="scanline" />
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-4xl h-full max-h-[80vh] border border-white/20 bg-black/90 p-8 relative overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-white animate-pulse" />
              <h2 className="text-xl font-bold tracking-widest uppercase">
                PROFILE: {player.alias}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:text-black transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Terminal Content */}
          <div className="flex-1 font-mono text-sm md:text-base leading-relaxed overflow-y-auto custom-scrollbar">
            <pre className="whitespace-pre-wrap terminal-cursor">
              {displayedText}
            </pre>
          </div>

          {/* Footer Decoration */}
          <div className="mt-8 flex justify-between items-end opacity-30 text-[10px] uppercase tracking-[0.3em]">
            <div>BLOODSTRIKE // INTEL // v4.02.1</div>
            <div>SECURE CONNECTION ESTABLISHED</div>
          </div>
        </motion.div>
      </motion.div>
    );
  };
