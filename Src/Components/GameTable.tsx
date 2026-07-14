"use client";

import React, { useState, useEffect } from "react";
import { createPendingRound, completeRound, getGameHistory } from "@/app/actions";
import { cn } from "@/lib/utils";
import { Swords, History, RotateCcw } from "lucide-react";

export const GameTable = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [currentRound, setCurrentRound] = useState<any>(null);
  const [isDealing, setIsDealing] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const data = await getGameHistory();
    setHistory(data);
  };

  const playRound = async () => {
    setIsDealing(true);
    setCurrentRound(null);
    
    // 1. Create a pending round (cards are determined on server but "hidden")
    const pendingRound = await createPendingRound();
    
    // 2. Simulate cards dealing animation
    await new Promise(r => setTimeout(r, 2000));
    
    // 3. Complete the round and show cards
    const completedRound = await completeRound(pendingRound.id);
    setCurrentRound(completedRound);
    setIsDealing(false);
    fetchHistory();
  };

  const getCardDisplay = (val: number) => {
    const suits = ["♠", "♣", "♥", "♦"];
    const suit = suits[val % 4];
    const faces = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const face = faces[val - 1] || "A";
    return { face, suit };
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* Game Board */}
      <div className="relative aspect-video bg-emerald-900 rounded-[3rem] border-8 border-yellow-700 shadow-2xl overflow-hidden flex items-center justify-around px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_100%)]" />
        
        {/* Dragon Side */}
        <div className="flex flex-col items-center gap-4 z-10">
          <h2 className="text-red-500 text-4xl font-black italic tracking-tighter drop-shadow-lg">DRAGON</h2>
          <div className={cn(
            "w-32 h-44 bg-white rounded-xl border-4 border-red-600 shadow-2xl flex items-center justify-center text-4xl transition-all duration-500",
            isDealing ? "rotate-y-180 scale-105" : "rotate-0",
            !currentRound && !isDealing ? "opacity-30" : "opacity-100"
          )}>
            {currentRound ? (
              <div className={cn("flex flex-col items-center", ["♥", "♦"].includes(getCardDisplay(currentRound.dragonCard).suit) ? "text-red-600" : "text-black")}>
                <span>{getCardDisplay(currentRound.dragonCard).face}</span>
                <span>{getCardDisplay(currentRound.dragonCard).suit}</span>
              </div>
            ) : "DRAGON"}
          </div>
        </div>

        <div className="z-10 flex flex-col items-center gap-2">
           <Swords className="w-12 h-12 text-yellow-500 drop-shadow-lg" />
           <div className="bg-black/50 px-4 py-1 rounded-full text-yellow-500 text-sm font-bold border border-yellow-500/30">VS</div>
        </div>

        {/* Tiger Side */}
        <div className="flex flex-col items-center gap-4 z-10">
          <h2 className="text-yellow-500 text-4xl font-black italic tracking-tighter drop-shadow-lg">TIGER</h2>
          <div className={cn(
            "w-32 h-44 bg-white rounded-xl border-4 border-yellow-600 shadow-2xl flex items-center justify-center text-4xl transition-all duration-500",
            isDealing ? "rotate-y-180 scale-105" : "rotate-0",
            !currentRound && !isDealing ? "opacity-30" : "opacity-100"
          )}>
            {currentRound ? (
              <div className={cn("flex flex-col items-center", ["♥", "♦"].includes(getCardDisplay(currentRound.tigerCard).suit) ? "text-red-600" : "text-black")}>
                <span>{getCardDisplay(currentRound.tigerCard).face}</span>
                <span>{getCardDisplay(currentRound.tigerCard).suit}</span>
              </div>
            ) : "TIGER"}
          </div>
        </div>

        {/* Winner Overlay */}
        {currentRound && !isDealing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
             <div className="animate-bounce bg-white/90 text-black px-8 py-3 rounded-full text-2xl font-black shadow-2xl border-4 border-yellow-500">
               {currentRound.winner.toUpperCase()} WINS!
             </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={playRound}
          disabled={isDealing}
          className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-700 text-white font-bold py-4 px-12 rounded-full shadow-xl transition-all active:scale-95 flex items-center gap-2 text-xl"
        >
          {isDealing ? <RotateCcw className="animate-spin" /> : "DEAL CARDS"}
        </button>
      </div>

      {/* History */}
      <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <History className="text-yellow-500" />
          <h3 className="text-xl font-bold text-white">Previous Results</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {history.map((round) => (
            <div 
              key={round.id} 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 shadow-lg",
                round.winner === 'dragon' ? "bg-red-900 border-red-500 text-red-200" : 
                round.winner === 'tiger' ? "bg-yellow-900 border-yellow-500 text-yellow-200" : 
                "bg-blue-900 border-blue-500 text-blue-200"
              )}
            >
              {round.winner[0].toUpperCase()}
            </div>
          ))}
          {history.length === 0 && <p className="text-slate-500 italic">No rounds played yet</p>}
        </div>
      </div>
    </div>
  );
};
