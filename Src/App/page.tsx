import { GameTable } from "@/components/GameTable";
import { FloatingPredictor } from "@/components/FloatingPredictor";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full p-6 text-center">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 tracking-tighter uppercase italic">
          Dragon vs Tiger
        </h1>
        <p className="text-slate-500 text-sm mt-2 uppercase tracking-[0.3em]">Official Game Engine Simulation</p>
      </div>

      <GameTable />
      
      {/* This is the floating component the user requested */}
      <FloatingPredictor />

      <div className="mt-8 max-w-2xl text-center bg-slate-900/50 p-6 rounded-xl border border-slate-800">
        <h2 className="text-xl font-bold text-yellow-500 mb-2">Security Testing Instructions</h2>
        <ul className="text-sm text-slate-400 text-left list-disc list-inside space-y-2">
          <li>Click <span className="text-yellow-600 font-bold">DEAL CARDS</span> to start a new round.</li>
          <li>While the cards are "dealing" (2-second delay), use the <span className="text-red-500 font-bold">Floating Predictor</span>.</li>
          <li>Click <span className="text-red-600 font-bold">GET NEXT OUTCOME</span> in the floating tool.</li>
          <li>If the predictor shows the result <strong>before</strong> the game reveals it, your server is vulnerable to outcome leakage.</li>
        </ul>
      </div>

      <footer className="fixed bottom-4 left-4 text-[10px] text-slate-700 max-w-xs leading-tight">
        SYSTEM STATUS: ONLINE<br/>
        SECURITY LAYER: ACTIVE<br/>
        PREDICTION VULNERABILITY: MONITORING
      </footer>
    </main>
  );
}
