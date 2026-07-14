"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { GripHorizontal, Zap, X, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { hack_getPendingOutcome } from "@/app/actions";

export const FloatingPredictor = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [prediction, setPrediction] = useState<{winner: string, dragonCard: number, tigerCard: number} | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    // Simulate a bit of delay for "hacking" feel
    await new Promise(r => setTimeout(r, 800));
    const result = await hack_getPendingOutcome();
    setPrediction(result);
    setLoading(false);
  };

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="fixed bottom-4 right-4 bg-red-600 p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors z-50"
    >
      <ShieldAlert className="text-white w-6 h-6" />
    </button>
  );

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: 100, y: 100 }}
      className="fixed z-50 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden"
      style={{ touchAction: "none" }}
    >
      {/* Header / Drag Handle */}
      <div className="bg-slate-800 p-2 flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-slate-700">
        <div className="flex items-center gap-2">
          <GripHorizontal className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Security Tester</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="text-center">
          <h3 className="text-sm font-semibold text-white">Dragon vs Tiger Predictor</h3>
          <p className="text-[10px] text-slate-400 mt-1">Testing server-side outcome leakage</p>
        </div>

        <div className="bg-black/40 rounded p-3 min-h-[80px] flex flex-col items-center justify-center border border-slate-800">
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] text-red-400 animate-pulse font-mono tracking-tighter">INTERCEPTING...</span>
            </div>
          ) : prediction ? (
            <div className="text-center animate-in fade-in zoom-in duration-300">
              <div className={cn(
                "text-2xl font-black uppercase tracking-tighter",
                prediction.winner === 'dragon' ? "text-red-500" : prediction.winner === 'tiger' ? "text-yellow-500" : "text-blue-500"
              )}>
                {prediction.winner}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">
                D: {prediction.dragonCard} | T: {prediction.tigerCard}
              </div>
            </div>
          ) : (
            <div className="text-slate-600 text-[10px] italic">No active prediction</div>
          )}
        </div>

        <button
          onClick={handlePredict}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs py-2 rounded font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Zap className="w-3 h-3" />
          GET NEXT OUTCOME
        </button>
      </div>

      <div className="bg-red-950/30 p-2">
         <p className="text-[8px] text-red-400 leading-tight">
           WARNING: This tool is for security testing only. Use it to verify if your game server leaks pre-calculated results.
         </p>
      </div>
    </motion.div>
  );
};
