import React from "react";
import { MatchEvent } from "../types";
import { Target, ShieldAlert, Cpu, Award } from "lucide-react";

interface TacticalInsightCardProps {
  currentEvent: MatchEvent;
  insightText: string;
  isGenerating: boolean;
}

export function TacticalInsightCard({ currentEvent, insightText, isGenerating }: TacticalInsightCardProps) {
  const { batter, bowler } = currentEvent;

  return (
    <div id="tactical-insights" className="glass-panel p-5 shadow-lg relative overflow-hidden flex flex-col h-full justify-between">
      {/* Target Crosshair grid background effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d4ff]/5 rounded-full blur-xl" />

      <div>
        {/* Card Title */}
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h3 className="font-sans font-bold text-slate-200 text-sm tracking-wide uppercase">
              AI Tactical & Strategic Insights
            </h3>
          </div>
          <span className="text-[10px] bg-black font-mono text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase">
            Data Grounded
          </span>
        </div>

        {/* Tactical text writeup from Gemini */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl mb-5">
          {isGenerating ? (
            <div className="flex flex-col gap-2.5 py-2">
              <div className="h-3 w-12/12 bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-11/12 bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-9/12 bg-white/10 rounded animate-pulse" />
            </div>
          ) : (
            <p className="text-slate-300 text-xs md:text-sm font-sans leading-relaxed">
              {insightText}
            </p>
          )}
        </div>

        {/* Simulated Pitch Map Hotzones Visualizer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {/* Bowling Pitch Zone */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <p className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider flex items-center gap-1 mb-2">
              <Target className="w-3.5 h-3.5 text-red-500 animate-pulse" /> Delivery Target Zone
            </p>
            
            <div className="relative h-28 bg-black/40 border border-white/10 rounded overflow-hidden flex flex-col justify-between p-1">
              <div className="text-center text-[9px] font-mono font-bold text-slate-500 border-b border-white/5 pb-0.5">
                PITCH LENGTH (CREASE)
              </div>
              
              {/* Pitch Zones Stack */}
              <div className="flex-1 flex flex-col text-[10px] font-mono font-bold text-center">
                <div className="flex-1 border-b border-white/5 hover:bg-rose-500/10 transition-colors flex items-center justify-center text-[9px] text-slate-500">
                  SHORT ZONE (BOUNCERS)
                </div>
                <div className="flex-1 border-b border-white/5 hover:bg-emerald-500/10 transition-colors flex items-center justify-center text-[9px] text-slate-500">
                  GOOD LENGTH (SWING)
                </div>
                <div className="flex-1 bg-gradient-to-r from-emerald-555/20 to-indigo-555/20 hover:bg-emerald-400/20 transition-colors flex items-center justify-center text-[9px] text-[#00d4ff]">
                  🎯 BLOCKHOLE yorker
                </div>
              </div>
            </div>
          </div>

          {/* Player Matchup Stats Card */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider flex items-center gap-1 mb-2">
                <ShieldAlert className="w-3.5 h-3.5 text-[#f0ff00]" /> Matchup Win Ratio
              </p>
              
              <div className="flex items-center justify-between text-xs font-semibold py-1 border-b border-white/10">
                <span className="text-slate-400 font-mono">{batter} SR</span>
                <span className="text-emerald-400 font-mono">164.8 against Pace</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold py-1 border-b border-white/10">
                <span className="text-slate-400 font-mono">{bowler} ER</span>
                <span className="text-[#f0ff00] font-mono">5.2 in Death Overs</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold py-1">
                <span className="text-slate-400 font-mono">Choke Ratio</span>
                <span className="text-rose-400 font-mono">0.12 (Extremely Low)</span>
              </div>
            </div>

            <div className="mt-2 text-center py-1 bg-emerald-500/5 rounded border border-emerald-500/25 flex items-center justify-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400">
              <Award className="w-3 h-3 text-emerald-400" /> MATCHUP EDGE: {bowler}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 mt-4 pt-3 flex items-center justify-between text-[10px] text-slate-550 font-mono font-bold">
        <span>STRATEGIC MATRIX: v4.1</span>
        <span>REAL TIME METERS ACTIVE</span>
      </div>
    </div>
  );
}
