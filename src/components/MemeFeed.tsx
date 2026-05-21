import React, { useState } from "react";
import { MessageCircle, Heart, Send, Sparkles } from "lucide-react";
import { FeedMessage } from "../types";

interface MemeFeedProps {
  feedMessages: FeedMessage[];
  onAddUserMessage: (text: string) => void;
}

export function MemeFeed({ feedMessages, onAddUserMessage }: MemeFeedProps) {
  const [inputText, setInputText] = useState("");

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAddUserMessage(inputText.trim());
    setInputText("");
  };

  return (
    <div id="meme-feed" className="glass-panel p-5 shadow-lg relative overflow-hidden flex flex-col h-[500px]">
      {/* Background visual spotlight */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d4ff]/5 rounded-full blur-2xl" />

      {/* Header Block */}
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-indigo-400" />
          <h3 className="font-sans font-bold text-slate-200 text-sm tracking-wide uppercase">
            Context Fan Feed & Hot Takes
          </h3>
        </div>
        <span className="flex items-center gap-1 text-[10px] bg-black font-mono text-indigo-400 px-2 py-0.5 rounded border border-white/10 font-bold uppercase">
          <Sparkles className="w-3 h-3 text-indigo-400" /> Live Chat Sync
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3.5 pr-1.5 scrollbar-thin scrollbar-thumb-white/10">
        {feedMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono italic">
            Waiting for match timeline to populate fan feed reactions...
          </div>
        ) : (
          feedMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`p-3 rounded-lg border text-xs leading-relaxed transition-all duration-300 transform translate-x-0 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 ${msg.styleClass || ""}`}
            >
              <div className="flex items-start gap-2.5">
                {/* Simulated Avatar representing user */}
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-slate-300 text-sm border border-white/10 flex-shrink-0">
                  {msg.avatarSeed || "👤"}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="font-black text-slate-200 font-sans tracking-tight">
                      {msg.sender}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                  
                  <p className="text-slate-300 font-sans break-words text-xs md:text-sm">
                    {msg.text}
                  </p>

                  {/* Tiny Interact buttons */}
                  <div className="flex items-center gap-3 mt-1.5 pt-1.5 border-t border-white/5 text-[10px] text-slate-500 font-mono font-bold">
                    <button className="hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer">
                      <Heart className="w-3 h-3 text-red-500/30 hover:text-red-500" /> Likes
                    </button>
                    <span>•</span>
                    <span>Verified Companion Fan</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* User Chat input */}
      <form onSubmit={handleMessageSubmit} className="mt-auto border-t border-white/10 pt-3 relative z-10">
        <label className="text-[10px] font-mono text-slate-400 font-bold block mb-1.5 uppercase">
          Post Your Own Live Match Take:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type comment (e.g. 'Bumrah is an absolute god tonight!')..."
            className="flex-1 bg-black/45 border border-white/15 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-all font-sans font-medium"
          />
          <button
            type="submit"
            id="chat-submit"
            className="bg-indigo-600 hover:bg-indigo-500 font-bold px-3 py-2 text-white rounded-lg transition-transform transition-colors flex items-center justify-center flex-shrink-0 cursor-pointer text-xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
