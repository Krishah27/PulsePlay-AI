import React, { useState, useEffect } from "react";
import { Vote, Users, CheckCircle2 } from "lucide-react";

interface PollWidgetProps {
  question: string;
  options: string[];
  pollId: string;
}

export function PollWidget({ question, options, pollId }: PollWidgetProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [votePower, setVotePower] = useState<number[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);

  // Generate randomized but realistic voting distribution when pollId changes
  useEffect(() => {
    setSelectedOption(null);
    if (!options || options.length === 0) return;

    const baseVotes = Array.from({ length: options.length }, () => 
      Math.floor(Math.random() * 4000) + 1200
    );
    
    setVotePower(baseVotes);
    setTotalVotes(baseVotes.reduce((a, b) => a + b, 0));
  }, [pollId, options]);

  const handleVoteSelect = (index: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(index);
    
    setVotePower(prev => {
      const next = [...prev];
      next[index] += 1;
      return next;
    });
    setTotalVotes(prev => prev + 1);
  };

  return (
    <div id="polling-widget" className="glass-panel p-5 shadow-lg relative overflow-hidden flex flex-col h-full justify-between">
      {/* Visual neon bubble background */}
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#00d4ff]/5 rounded-full blur-2xl" />

      <div>
        {/* Card Title */}
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Vote className="w-5 h-5 text-indigo-400" />
            <h3 className="font-sans font-bold text-slate-200 text-sm tracking-wide uppercase">
              Autonomous Live Fan Polls
            </h3>
          </div>
          <div className="flex items-center gap-1 text-slate-400 font-mono text-[10px] font-bold">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{totalVotes.toLocaleString()} Voted</span>
          </div>
        </div>

        {/* Question Text */}
        <p className="text-white text-sm font-black font-sans leading-relaxed mb-4 tracking-tight">
          {question || "Drafting active poll for next ball..."}
        </p>

        {/* Options Grid / Status */}
        {options && options.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {options.map((option, idx) => {
              const hasVoted = selectedOption !== null;
              const isSelected = selectedOption === idx;
              
              const optCount = votePower[idx] || 0;
              const percent = totalVotes > 0 ? Math.round((optCount / totalVotes) * 100) : 0;

              return (
                <button
                  key={idx}
                  onClick={() => handleVoteSelect(idx)}
                  disabled={hasVoted}
                  className={`w-full relative text-left p-3.5 rounded-lg text-sm transition-all duration-300 overflow-hidden flex items-center justify-between ${
                    hasVoted 
                      ? isSelected 
                        ? "bg-black/60 border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
                        : "bg-white/5 border border-white/5"
                      : "bg-white/5 hover:bg-white/10 hover:border-white/20 border border-white/10 cursor-pointer"
                  }`}
                >
                  {/* Sweep Fill Progress Bar (only visible when voted) */}
                  {hasVoted && (
                    <div 
                      className={`absolute top-0 bottom-0 left-0 bg-indigo-500/15 transition-all duration-1000 ease-out border-r-2 ${
                        isSelected 
                          ? "border-[#00d4ff]" 
                          : "border-transparent"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  )}

                  {/* Choice Label Text */}
                  <div className="flex items-center gap-2.5 relative z-10 font-medium max-w-[80%]">
                    {hasVoted && isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-[#00d4ff] flex-shrink-0" />
                    )}
                    <span className={isSelected ? "text-[#00d4ff] font-bold" : "text-slate-300"}>
                      {option}
                    </span>
                  </div>

                  {/* Vote Percentage Box */}
                  {hasVoted && (
                    <span className={`text-xs font-mono font-bold relative z-10 ${isSelected ? "text-[#00d4ff] font-black" : "text-slate-500"}`}>
                      {percent}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 font-mono italic">
            Awaiting ball events to generate custom match polls...
          </div>
        )}
      </div>

      {selectedOption !== null && (
        <div className="mt-4 bg-indigo-500/10 border border-indigo-500/20 rounded p-2 text-center text-[10px] font-mono text-indigo-400 font-semibold uppercase animate-pulse">
          🎯 VOTE CLASSIFIED BY TELEMETRY! STADIUM SYNC COMPLETED
        </div>
      )}

      <div className="border-t border-white/10 mt-4 pt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono font-bold">
        <span>GAMIFICATION ENGINE v2</span>
        <span>EXCLUSIVELY CLIENT SYNCED</span>
      </div>
    </div>
  );
}
