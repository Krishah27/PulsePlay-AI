import React from "react";
import { MatchEvent } from "../types";
import { TrendingDown, TrendingUp, Sparkles, Sword } from "lucide-react";

interface MomentumMeterProps {
  currentEvent: MatchEvent;
  reactionHistory: { ballIndex: number; rating: number; over: string }[];
  currentRating: number; // calculated live momentum
}

export function MomentumMeter({ currentEvent, reactionHistory, currentRating }: MomentumMeterProps) {
  const { battingTeam, bowlingTeam, runsNeeded, ballsLeft } = currentEvent;

  // Simple, realistic win-probability formula based on runs and balls left:
  const calculateWinProbability = () => {
    if (ballsLeft === 0) {
      return runsNeeded <= 0 ? { bat: 100, bowl: 0 } : { bat: 0, bowl: 100 };
    }
    
    const runsPerBallLeft = runsNeeded / ballsLeft;
    let battingProb = 50;

    if (runsPerBallLeft > 4) {
      battingProb = 5;
    } else if (runsPerBallLeft > 3) {
      battingProb = 15;
    } else if (runsPerBallLeft > 2) {
      battingProb = 30;
    } else if (runsPerBallLeft > 1.5) {
      battingProb = 45;
    } else if (runsPerBallLeft > 1.0) {
      battingProb = 60;
    } else if (runsPerBallLeft > 0.5) {
      battingProb = 85;
    } else {
      battingProb = 95;
    }

    const sentimentAdjustment = currentRating * 0.15;
    let finalBat = Math.max(2, Math.min(98, Math.round(battingProb + sentimentAdjustment)));
    
    if (runsNeeded <= 0) finalBat = 100;

    return {
      bat: finalBat,
      bowl: 100 - finalBat
    };
  };

  const { bat: batProb, bowl: bowlProb } = calculateWinProbability();

  // Get current color schemes
  const getProgressColor = () => {
    if (currentRating > 20) return "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.7)]";
    if (currentRating < -20) return "bg-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.7)]";
    return "bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.7)]";
  };

  return (
    <div id="momentum-meter" className="glass-panel p-5 shadow-lg relative overflow-hidden flex flex-col h-full justify-between">
      {/* Glare effect */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#00d4ff]/5 rounded-full blur-2xl" />

      <div>
        {/* Card Title */}
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sword className="w-5 h-5 text-indigo-400" />
            <h3 className="font-sans font-bold text-slate-200 text-sm tracking-wide uppercase">
              Win Probability / Momentum Meter
            </h3>
          </div>
          <div className="flex items-center gap-1.5 bg-indigo-555/10 px-2 py-0.5 rounded border border-indigo-500/20 text-[10px] text-indigo-400 font-mono font-bold">
            <Sparkles className="w-2.5 h-2.5 animate-spin" /> Live Metrics
          </div>
        </div>

        {/* Double-Gauge Bar */}
        <div className="mb-6 justify-center">
          <div className="flex justify-between items-end mb-2">
            <div className="text-left">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400">{battingTeam} Win Rate</span>
              <p className="text-2xl md:text-3xl font-black text-red-500 font-sans tracking-tight">
                {batProb}%
              </p>
            </div>
            <div className="text-slate-400 font-mono text-xs uppercase px-2 py-0.5 bg-black/40 rounded border border-white/10 mb-1">
              PROBABILITY
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400">{bowlingTeam} Win Rate</span>
              <p className="text-2xl md:text-3xl font-black text-blue-500 font-sans tracking-tight">
                {bowlProb}%
              </p>
            </div>
          </div>

          {/* Probability Bar Slider */}
          <div className="h-4 rounded-full bg-black/45 p-1 border border-white/10 flex overflow-hidden">
            <div 
              style={{ width: `${batProb}%` }} 
              className="h-full rounded-l bg-gradient-to-r from-red-600 to-red-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(239,68,68,0.4)]"
            />
            <div 
              style={{ width: `${bowlProb}%` }} 
              className="h-full rounded-r bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(59,130,246,0.4)]"
            />
          </div>
        </div>

        {/* Live Momentum swing Dial */}
        <div className="bg-white/5 border border-white/15 rounded-xl p-4 mb-4 backdrop-blur-md">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                Momentum Bias
              </p>
              <h4 className="text-base font-bold text-slate-200">
                {currentRating > 20 
                  ? "🔥 RCB Surge Mode" 
                  : currentRating < -20 
                  ? "❄️ MI Dominating Line" 
                  : "⚖️ Locked in Balance"}
              </h4>
            </div>
            
            <div className="flex items-center gap-1">
              {currentRating >= 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-400" />
              )}
              <span className={`text-sm font-mono font-bold ${currentRating >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {currentRating > 0 ? "+" : ""}{currentRating}
              </span>
            </div>
          </div>

          {/* Slider representing -100 to 100 */}
          <div className="relative h-2 bg-black/40 rounded-full border border-white/10">
            {/* Center Line Marker */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20" />
            
            {/* Active Pointer */}
            <div 
              className={`absolute top-1/2 -mt-2 -ml-2 w-4 h-4 rounded-full border-2 border-white transition-all duration-500 ease-out ${getProgressColor()}`}
              style={{ left: `${((currentRating + 100) / 200) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-2">
            <span>MI LOCKDOWN</span>
            <span>EQUAL BALANCE</span>
            <span>RCB BOUNDARIES</span>
          </div>
        </div>
      </div>

      {/* SVG Historical Momentum Curve Line */}
      <div className="border-t border-white/10 pt-4">
        <p className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider mb-2">
          Ball-By-Ball Momentum Waveform
        </p>
        
        {reactionHistory.length === 0 ? (
          <div className="h-16 flex items-center justify-center text-xs text-slate-500 font-mono italic">
            Over has not started yet...
          </div>
        ) : (
          <div className="relative h-20 w-full bg-black/40 rounded-lg border border-white/10 overflow-hidden">
            <svg className="w-full h-full p-2" viewBox="0 0 100 40" preserveAspectRatio="none">
              {/* Horizontal Center line */}
              <line x1="0" y1="20" x2="100" y2="20" stroke="#ff0055" strokeOpacity="0.2" strokeDasharray="3,3" />

              {/* Grid Lines */}
              <line x1="17" y1="0" x2="17" y2="40" stroke="white" strokeOpacity="0.05" />
              <line x1="34" y1="0" x2="34" y2="40" stroke="white" strokeOpacity="0.05" />
              <line x1="51" y1="0" x2="51" y2="40" stroke="white" strokeOpacity="0.05" />
              <line x1="68" y1="0" x2="68" y2="40" stroke="white" strokeOpacity="0.05" />
              <line x1="85" y1="0" x2="85" y2="40" stroke="white" strokeOpacity="0.05" />

              {/* Momentum Curve Path */}
              {(() => {
                const points = reactionHistory.map((item, index) => {
                  const x = (index / (Math.max(6, reactionHistory.length - 1))) * 100;
                  const y = 20 - (item.rating / 100) * 15;
                  return { x, y };
                });

                if (points.length === 0) return null;
                
                let pathString = `M ${points[0].x} ${points[0].y}`;
                for (let i = 1; i < points.length; i++) {
                  const cpX1 = points[i - 1].x + (points[i].x - points[i - 1].x) / 2;
                  const cpY1 = points[i - 1].y;
                  const cpX2 = cpX1;
                  const cpY2 = points[i].y;
                  pathString += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i].x} ${points[i].y}`;
                }

                return (
                  <>
                    <defs>
                      <linearGradient id="glowGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Shadow Sweep Area */}
                    <path
                      d={`${pathString} L ${points[points.length - 1].x} 20 L ${points[0].x} 20 Z`}
                      fill="url(#glowGradient)"
                    />
                    {/* Colored Solid Stroke Line */}
                    <path
                      d={pathString}
                      fill="none"
                      stroke="#00d4ff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Dot markers */}
                    {points.map((p, idx) => (
                      <circle
                        key={idx}
                        cx={p.x}
                        cy={p.y}
                        r="2.5"
                        fill={reactionHistory[idx].rating >= 0 ? "#10b981" : "#f43f5e"}
                        className="animate-pulse"
                      />
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
