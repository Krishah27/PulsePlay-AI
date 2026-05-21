import React from "react";
import { MatchEvent } from "../types";
import { AppWindow, Flame, TrendingUp } from "lucide-react";

interface ScoreBannerProps {
  currentEvent: MatchEvent;
  totalBalls: number;
  currentBallIndex: number;
}

export function ScoreBanner({ currentEvent, totalBalls, currentBallIndex }: ScoreBannerProps) {
  const {
    over,
    score,
    battingTeam,
    bowlingTeam,
    runsNeeded,
    ballsLeft,
    batter,
    bowler,
    commentaryText
  } = currentEvent;

  // Calculate current runrate and required runrate
  const requiredRR = ballsLeft > 0 ? ((runsNeeded / ballsLeft) * 6).toFixed(2) : "0.00";

  return (
    <div id="score-banner" className="glass-panel mx-4 my-2 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Dynamic Background Pulse Glimmer */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#ff0055] via-[#00d4ff] to-[#f0ff00] animate-pulse" />
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#ff0055]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#00d4ff]/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 relative z-10">
        {/* Broadcast Live Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Left Block: Match Teams & Score */}
          <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-start">
            <div className="flex items-center gap-3">
              {/* Batting Team Badge */}
              <div className="flex items-center">
                <span className="bg-red-600 text-white font-mono font-bold px-3 py-1.5 text-xs md:text-sm rounded-l border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                  {battingTeam}
                </span>
                <span className="bg-white/5 text-slate-300 font-bold px-2 py-1.5 text-[10px] md:text-xs rounded-r border-y border-r border-white/10">
                  Batting
                </span>
              </div>
              
              <span className="text-slate-500 font-bold text-sm">vs</span>

              {/* Bowling Team Badge */}
              <div className="flex items-center">
                <span className="bg-blue-600 text-white font-mono font-bold px-3 py-1.5 text-xs md:text-sm rounded-l border border-blue-500/50">
                  {bowlingTeam}
                </span>
                <span className="bg-white/5 text-slate-200 font-bold px-2 py-1.5 text-[10px] md:text-xs rounded-r border-y border-r border-white/10">
                  Bowling
                </span>
              </div>
            </div>

            {/* LIVE PULSING EMITTER */}
            <div className="flex items-center gap-2 bg-[#ff0055]/10 border border-[#ff0055]/30 px-3 py-1 rounded text-[#ff0055] font-mono text-xs font-bold uppercase animate-pulse">
              <span className="pulse-indicator" />
              Live Death Over
            </div>
          </div>

          {/* Center Block: Huge Score Display */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 bg-white/5 border border-white/10 px-6 py-3 rounded-xl w-full lg:w-auto backdrop-blur-md">
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Current Score</p>
              <h2 className="text-2xl md:text-3xl font-black font-sans text-white tracking-tight">
                {score} <span className="text-slate-400 text-sm font-normal">({over})</span>
              </h2>
            </div>

            <div className="h-8 w-px bg-white/10 hidden md:block" />

            <div className="text-center px-2">
              <p className="text-[10px] uppercase font-bold text-[#ff0055] tracking-wider font-mono flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-[#ff0055]" /> Runs Needed
              </p>
              <h2 className="text-2xl md:text-3xl font-black font-sans text-[#ff0055] tracking-tight animate-pulse">
                {runsNeeded} <span className="text-slate-400 text-xs font-bold font-mono">off {ballsLeft} balls</span>
              </h2>
            </div>

            <div className="h-8 w-px bg-white/10 hidden md:block" />

            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-[#f0ff00] tracking-wider font-mono">Required RR</p>
              <h2 className="text-xl md:text-2xl font-black font-sans text-[#f0ff00] tracking-tight">
                {requiredRR} <span className="text-xs text-slate-500 font-normal">/ over</span>
              </h2>
            </div>
          </div>

          {/* Right Block: Pitch Matchups */}
          <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto border-t border-white/10 pt-4 lg:pt-0 lg:border-t-0 justify-around">
            <div className="flex items-center gap-3 text-sm">
              <div className="bg-white/5 px-3 py-1.5 rounded border border-white/10">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Batsman on Strike</span>
                <span className="text-white font-bold">{batter}</span>
              </div>
              <span className="text-[#00d4ff] font-bold font-mono">VS</span>
              <div className="bg-white/5 px-3 py-1.5 rounded border border-white/10">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Bowler in Action</span>
                <span className="text-white font-bold">{bowler}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Ball tracker timeline blocks */}
        <div className="mt-4 flex items-center gap-2 border-t border-white/15 pt-4">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono pr-2">
            Over Progress:
          </div>
          <div className="flex-1 flex gap-1 h-3 rounded-full overflow-hidden bg-black/40 p-0.5 border border-white/10">
            {Array.from({ length: totalBalls }).map((_, i) => {
              const isPast = i < currentBallIndex;
              const isCurrent = i === currentBallIndex;
              let bgClass = "bg-white/10";
              if (isPast) bgClass = "bg-[#00d4ff] shadow-[0_0_8px_rgba(0,212,255,0.7)]";
              if (isCurrent) bgClass = "bg-[#ff0055] animate-pulse shadow-[0_0_10px_rgba(255,0,85,0.9)]";
              
              return (
                <div 
                  key={i} 
                  className={`flex-1 rounded-full transition-all duration-300 ${bgClass}`}
                  title={isCurrent ? "Active Ball" : isPast ? "Completed Ball" : "Upcoming Ball"}
                />
              );
            })}
          </div>
          <div className="text-xs text-slate-400 font-mono font-bold pl-2">
            {currentBallIndex}/{totalBalls} balls
          </div>
        </div>

        {/* Live Pitch Commentary Box */}
        <div className="mt-4 bg-white/5 rounded-lg p-3 border border-white/10 flex gap-4 items-start">
          <div className="p-2 bg-[#00d4ff]/10 rounded border border-[#00d4ff]/20 text-[#00d4ff] text-xs uppercase font-mono font-bold tracking-tight text-center whitespace-nowrap">
            BALL {over}
          </div>
          <p className="text-slate-300 font-sans text-xs md:text-sm leading-relaxed">
            {commentaryText}
          </p>
        </div>

      </div>
    </div>
  );
}
