import React, { useState, useEffect, useRef } from "react";
import { ScoreBanner } from "./components/ScoreBanner";
import { MomentumMeter } from "./components/MomentumMeter";
import { AICompanionCard } from "./components/AICompanionCard";
import { TacticalInsightCard } from "./components/TacticalInsightCard";
import { PollWidget } from "./components/PollWidget";
import { MemeFeed } from "./components/MemeFeed";
import { NotificationSimulation } from "./components/NotificationSimulation";

import { 
  MatchEvent, 
  AIReaction, 
  CompanionState, 
  SmartNotification, 
  FeedMessage 
} from "./types";
import { 
  IPL_FINAL_OVER_SEQUENCE, 
  PRESET_AI_REACTIONS, 
  TEAMS, 
  PLAYERS 
} from "./data";

import { 
  Flame, 
  Play, 
  Square, 
  RotateCcw, 
  Zap, 
  TrendingUp, 
  Volume2, 
  VolumeX, 
  Radio, 
  Info,
  ChevronRight,
  Sparkles
} from "lucide-react";

export default function App() {
  // --- STATE CORE ---
  const [matchMode, setMatchMode] = useState<"demo" | "random">("demo");
  const [currentBallIndex, setCurrentBallIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  
  // Custom companion configuration state
  const [companionState, setCompanionState] = useState<CompanionState>({
    personality: "Hype Commentator",
    favoriteTeam: "None",
    favoritePlayer: "None"
  });

  // Dynamic reaction fields
  const [activeReaction, setActiveReaction] = useState<AIReaction | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reactionHistory, setReactionHistory] = useState<{ ballIndex: number; rating: number; over: string }[]>([]);

  // Feed & Notification states
  const [feedMessages, setFeedMessages] = useState<FeedMessage[]>([]);
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [useVoice, setUseVoice] = useState(true);

  // References
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Random Scenario inputs (only visible under "Live Random Match" Mode)
  const [customInputScore, setCustomInputScore] = useState("142/4");
  const [customInputBatter, setCustomInputBatter] = useState("Virat Kohli");
  const [customInputBowler, setCustomInputBowler] = useState("Sandeep Sharma");
  const [customInputRunsNeeded, setCustomInputRunsNeeded] = useState(12);
  const [customInputBallsLeft, setCustomInputBallsLeft] = useState(6);
  const [customInputEvent, setCustomInputEvent] = useState<"RUN" | "BOUNDARY" | "WICKET" | "DOT">("BOUNDARY");

  // Get current active ball event details depending on selected mode
  const getCurrentEvent = (): MatchEvent => {
    if (matchMode === "demo") {
      return IPL_FINAL_OVER_SEQUENCE[currentBallIndex];
    } else {
      // Dynamic simulated customized event
      return {
        id: "random-ball",
        over: `19.${7 - customInputBallsLeft}`,
        event: customInputEvent,
        runsScored: customInputEvent === "BOUNDARY" ? 6 : customInputEvent === "WICKET" ? 0 : customInputEvent === "DOT" ? 0 : 2,
        batter: customInputBatter,
        bowler: customInputBowler,
        score: customInputScore,
        battingTeam: "RCB",
        bowlingTeam: "MI",
        runsNeeded: customInputRunsNeeded,
        ballsLeft: customInputBallsLeft,
        commentaryText: `High tension continues! ${customInputBatter} faces up in the active box against bowler ${customInputBowler}. Critical situation with ${customInputRunsNeeded} runs needed off only ${customInputBallsLeft} balls left.`
      };
    }
  };

  const currentEvent = getCurrentEvent();

  // --- COMPANION ACTION CHAIN (INTEGRATING GEMINI) ---
  const triggerCompanionReaction = async (eventDetails: MatchEvent) => {
    setIsGenerating(true);
    stopSpeaking();

    try {
      // POST request to Express backend Proxy (safe API usage)
      const response = await fetch("/api/gemini/reaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventData: eventDetails,
          personality: companionState.personality,
          favoriteTeam: companionState.favoriteTeam,
          favoritePlayer: companionState.favoritePlayer
        })
      });

      if (!response.ok) {
        throw new Error("Server-side reaction generation failed");
      }

      const reactionData: AIReaction = await response.json();
      setActiveReaction(reactionData);

      // Append results to stats charts history
      setReactionHistory(prev => {
        const key = `${eventDetails.over}-${companionState.personality}`;
        if (prev.some(item => `${item.over}-${companionState.personality}` === key)) return prev;
        return [...prev, { 
          ballIndex: currentBallIndex, 
          rating: reactionData.momentumRating, 
          over: eventDetails.over 
        }];
      });

      // Spawn custom stadium Twitter banters
      generateFanBanterMessages(eventDetails, reactionData);

      // Spawn automatic high-stakes notifications
      checkForNotifications(eventDetails, reactionData);

      // Optional TTS speak
      if (useVoice && reactionData.reaction) {
        speakReaction(reactionData.reaction);
      }

    } catch (err) {
      console.warn("Falling back to precompiled high quality presets...", err);
      // Fallback securely to prevent user-facing bugs
      const activePreset = PRESET_AI_REACTIONS[eventDetails.id]?.[companionState.personality] || 
                             PRESET_AI_REACTIONS["ball-0"]?.[companionState.personality];
      
      if (activePreset) {
        setActiveReaction(activePreset);
        setReactionHistory(prev => [...prev, { 
          ballIndex: currentBallIndex, 
          rating: activePreset.momentumRating, 
          over: eventDetails.over 
        }]);
        generateFanBanterMessages(eventDetails, activePreset);
        checkForNotifications(eventDetails, activePreset);
        if (useVoice && activePreset.reaction) {
          speakReaction(activePreset.reaction);
        }
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Trigger reaction whenever ball index or personality configuration shifts
  useEffect(() => {
    triggerCompanionReaction(currentEvent);
  }, [currentBallIndex, companionState.personality, companionState.favoriteTeam, companionState.favoritePlayer, matchMode]);

  // Autoplay handler
  useEffect(() => {
    if (autoplay) {
      autoplayTimerRef.current = setInterval(() => {
        handleNextBall();
      }, 15000); // deliver a ball autonomously every 15s to keep dashboard fresh!
    } else {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    }

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [autoplay, currentBallIndex]);

  // --- ACTIONS ---
  const handleNextBall = () => {
    if (currentBallIndex < IPL_FINAL_OVER_SEQUENCE.length - 1) {
      setCurrentBallIndex(prev => prev + 1);
    } else {
      // Loop or stop
      setAutoplay(false);
    }
  };

  const handlePrevBall = () => {
    if (currentBallIndex > 0) {
      setCurrentBallIndex(prev => prev - 1);
    }
  };

  const resetOver = () => {
    setCurrentBallIndex(0);
    setReactionHistory([]);
    setFeedMessages([]);
    setNotifications([]);
    setAutoplay(false);
    stopSpeaking();
  };

  const handleAddUserComment = (text: string) => {
    const newMsg: FeedMessage = {
      id: `user-${Date.now()}`,
      sender: `You (${companionState.favoriteTeam !== "None" ? companionState.favoriteTeam : "Neutral"} Fan)`,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      styleClass: "border-indigo-500/40 bg-indigo-950/20",
      avatarSeed: "🍿"
    };

    setFeedMessages(prev => [newMsg, ...prev]);

    // Fast mock reply from AI matching the statement context!
    setTimeout(() => {
      let replyText = "Very interesting perspective! Matchups are extremely tight right now.";
      if (companionState.personality === "Hype Commentator") {
        replyText = "ABSOLUTELY GORGEOUS TAKE! THE PRESSURES ARE OFF THE METERS!";
      } else if (companionState.personality === "Meme Lord") {
        replyText = "Standard hopium intake detected here. Let's see if that ages well 💀";
      } else if (companionState.personality === "Tactical Analyst") {
        replyText = "Computer heuristics map that strategy at a 14.8% edge shift. Validated.";
      }

      setFeedMessages(prev => [
        {
          id: `ai-reply-${Date.now()}`,
          sender: `Pulse Companion (${companionState.personality})`,
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          styleClass: "border-purple-500/30 bg-purple-950/10",
          avatarSeed: "⚡"
        },
        ...prev
      ]);
    }, 1200);
  };

  // --- BROADCAST NOTIFICATION SPARKS ---
  const checkForNotifications = (eventDetails: MatchEvent, reaction: AIReaction) => {
    const { event, runsNeeded, ballsLeft } = eventDetails;
    const newNoitifications: SmartNotification[] = [];

    // Trigger high-stakes notifications based on results
    if (event === "BOUNDARY" && reaction.momentumRating > 30) {
      newNoitifications.push({
        id: `notif-mom-${Date.now()}`,
        type: "MOMENTUM",
        title: "⚡ MOMENTUM COLLISION DETECTED!",
        message: `${eventDetails.batter} clears the boundary ropes! momentum swerved +${reaction.momentumRating} in favor of RCB!`,
        timestamp: "Live"
      });
    } else if (event === "WICKET") {
      newNoitifications.push({
        id: `notif-wic-${Date.now()}`,
        type: "PRESSURE",
        title: "🚨 CRUCIAL WICKET COLLAPSE!",
        message: `Bumrah dispatches ${eventDetails.batter}! Massive silent explosion across the cricket stands!`,
        timestamp: "Live"
      });
    }

    if (ballsLeft <= 2 && runsNeeded > 5) {
      newNoitifications.push({
        id: `notif-clu-${Date.now()}`,
        type: "CLUTCH",
        title: "🔥 CLUTCH OR CRASH MODE!",
        message: `Tense extreme calculations! RCB requires ${runsNeeded} runs in the remaining ${ballsLeft} balls!`,
        timestamp: "Immediate"
      });
    }

    if (newNoitifications.length > 0) {
      setNotifications(prev => [...prev, ...newNoitifications]);
    }
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // --- TWITTER BANTER GENERATION ---
  const generateFanBanterMessages = (eventDetails: MatchEvent, reaction: AIReaction) => {
    const { over, event, batter, bowler } = eventDetails;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const companionComment: FeedMessage = {
      id: `comp-msg-${Date.now()}`,
      sender: `🤖 Pulse Companion (${companionState.personality})`,
      text: reaction.reaction,
      timestamp: timeStr,
      styleClass: "border-indigo-500/20 bg-indigo-550/5 font-semibold",
      avatarSeed: "⚡"
    };

    const extraBanter: FeedMessage[] = [];

    if (event === "BOUNDARY") {
      extraBanter.push({
        id: `banter-1-${Date.now()}`,
        sender: "@rcb_loyal_stan",
        text: `WHAT A BELTER! ${batter} is literally putting on an exhibition! Bumrah's face says it all!`,
        timestamp: timeStr,
        styleClass: "",
        avatarSeed: "👹"
      });
      extraBanter.push({
        id: `banter-2-${Date.now()}`,
        sender: "@mumbai_tactician",
        text: "Bumrah missing the bowling blockhole. Completely uncharacteristic but that ball sat perfectly in the slot.",
        timestamp: timeStr,
        styleClass: "",
        avatarSeed: "📊"
      });
    } else if (event === "WICKET") {
      extraBanter.push({
        id: `banter-3-${Date.now()}`,
        sender: "@boom_supremacy",
        text: "THE ABSOLUTE GOAT OF DEATH OVERS! UNPLAYABLE SEARING YORKER SLOW CUTTER! SIT DOWN MAXWELL! 🤫",
        timestamp: timeStr,
        styleClass: "",
        avatarSeed: "👑"
      });
      extraBanter.push({
        id: `banter-4-${Date.now()}`,
        sender: "@sad_rcb_fan",
        text: "Why does this stadium feel like a graveyard again... I literally cannot take this level of annual choking.",
        timestamp: timeStr,
        styleClass: "",
        avatarSeed: "😭"
      });
    } else {
      extraBanter.push({
        id: `banter-5-${Date.now()}`,
        sender: "@fantasy_cricketeer",
        text: `Super tense ball. Single rotates the Strike.Preserves Karthik's focus.`,
        timestamp: timeStr,
        styleClass: "",
        avatarSeed: "🏏"
      });
    }

    setFeedMessages(prev => [companionComment, ...extraBanter, ...prev].slice(0, 50)); // limit feed length to keep it green
  };

  // --- NATIVE TEXT-TO-SPEECH AGENT VOICE SPEAKER ---
  const speakReaction = (text: string) => {
    if (!window.speechSynthesis) return;
    
    stopSpeaking();

    // Clean up markdown cues or emojis for fluent speech reads
    const cleanText = text.replace(/[*#🗣️🧠🍿🤪🚨⚡🔥👑🤫📊👑🤡📈🚀⏱️]/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.volume = 1;
    utterance.rate = companionState.personality === "Hype Commentator" ? 1.15 : 1.0; 
    
    // Attempt to pick a distinct persona voice
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (companionState.personality === "Hype Commentator") {
        // High energetic male sounding if exists
        const maleVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Microsoft David"));
        if (maleVoice) utterance.voice = maleVoice;
      } else if (companionState.personality === "Tactical Analyst") {
        // British analytic sounding
        const ukVoice = voices.find(v => v.name.includes("Google UK English") || v.name.includes("Microsoft Hazel"));
        if (ukVoice) utterance.voice = ukVoice;
      } else {
        const femaleVoice = voices.find(v => v.name.includes("Google UK English Female") || v.name.includes("Microsoft Zira"));
        if (femaleVoice) utterance.voice = femaleVoice;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <div id="app-root" className="min-h-screen mesh-bg text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative">
      <div className="mesh-bg fixed inset-0 -z-10 w-full h-full" />
      
      {/* Top Header Navigation Panel */}
      <header className="glass-panel mx-4 my-4 sticky top-4 z-40 shadow-2xl p-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-gradient-to-tr from-indigo-500 to-red-500 rounded-lg flex items-center justify-center font-black text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              🏏
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-black text-white tracking-wider uppercase font-sans">
                  PulsePlay AI
                </h1>
                <span className="flex items-center gap-1 bg-red-650 text-white font-mono px-2 py-0.5 rounded text-[10px] font-black animate-pulse uppercase tracking-tight">
                  <span className="pulse-indicator inline-block" />
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-widest">
                Autonomous IPL Cricket Companion
              </p>
            </div>
          </div>

          {/* Interactive Mode & Play Controls Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Safe Voice Play button toggle */}
            <button
              onClick={() => {
                const nextUse = !useVoice;
                setUseVoice(nextUse);
                if (!nextUse) stopSpeaking();
              }}
              id="voice-toggle-btn"
              className={`p-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                useVoice 
                  ? "bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/30 shadow-[0_0_10px_rgba(0,212,255,0.15)]" 
                  : "bg-white/5 text-slate-400 border-white/10"
              }`}
              title={useVoice ? "Mute Companion AI Commentary voice" : "Unmute Companion AI Commentary voice"}
            >
              {useVoice ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">Voice {useVoice ? "Active" : "Muted"}</span>
            </button>

            <div className="h-5 w-px bg-white/10" />

            {/* Match Mode Chooser */}
            <div className="flex bg-black/40 p-1 rounded-lg border border-white/10 text-xs text-xs">
              <button
                onClick={() => {
                  setMatchMode("demo");
                  resetOver();
                }}
                id="mode-demo-btn"
                className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                  matchMode === "demo"
                    ? "bg-white/10 text-indigo-400 font-extrabold shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🎥 IPL Final Over (Demo)
              </button>
              <button
                onClick={() => {
                  setMatchMode("random");
                  setReactionHistory([]);
                }}
                id="mode-random-btn"
                className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1 ${
                  matchMode === "random"
                    ? "bg-white/10 text-indigo-400 font-extrabold shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>Live Sandbox Simulator</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Primary Scoreboard banner */}
      <ScoreBanner 
        currentEvent={currentEvent} 
        totalBalls={IPL_FINAL_OVER_SEQUENCE.length} 
        currentBallIndex={currentBallIndex}
      />

      {/* Main Body Workspace Layout Grid */}
      <main className="max-w-7xl mx-auto w-full px-4 py-8 flex-grow">
        
        {/* Under Live Custom Sandbox Mode: show parameter panel */}
        {matchMode === "random" && (
          <div className="glass-panel p-5 rounded-xl mb-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
            <h3 className="text-sm font-black text-indigo-400 tracking-wider uppercase font-mono mb-3 flex items-center gap-1.5">
              <Radio className="w-4 h-4 animate-pulse text-indigo-400" /> Customized Match Event Sandbox Panel
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 font-mono tracking-wider font-bold block mb-1">SCORE</label>
                <input 
                  value={customInputScore}
                  onChange={(e) => setCustomInputScore(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 p-2 text-xs rounded text-white font-mono focus:outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff]/20"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono tracking-wider font-bold block mb-1">BATSMAN</label>
                <input 
                  value={customInputBatter}
                  onChange={(e) => setCustomInputBatter(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 p-2 text-xs rounded text-white focus:outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff]/20"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono tracking-wider font-bold block mb-1">BOWLER</label>
                <input 
                  value={customInputBowler}
                  onChange={(e) => setCustomInputBowler(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 p-2 text-xs rounded text-white focus:outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff]/20"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono tracking-wider font-bold block mb-1">RUNS NEEDED</label>
                <input 
                  type="number"
                  value={customInputRunsNeeded}
                  onChange={(e) => setCustomInputRunsNeeded(parseInt(e.target.value) || 0)}
                  className="w-full bg-black/40 border border-white/10 p-2 text-xs rounded text-white font-mono focus:outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff]/20"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono tracking-wider font-bold block mb-1">BALLS LEFT</label>
                <input 
                  type="number"
                  value={customInputBallsLeft}
                  onChange={(e) => setCustomInputBallsLeft(parseInt(e.target.value) || 1)}
                  className="w-full bg-black/40 border border-white/10 p-2 text-xs rounded text-white font-mono focus:outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff]/20"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono tracking-wider font-bold block mb-1">BALL EVENT</label>
                <select 
                  value={customInputEvent}
                  onChange={(e: any) => setCustomInputEvent(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 p-2 text-xs rounded text-white focus:outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff]/20"
                >
                  <option value="BOUNDARY">Boundary (6 Runs)</option>
                  <option value="WICKET">Wicket taken</option>
                  <option value="RUN">Quick Single / Run</option>
                  <option value="DOT">Dot Ball</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button
                onClick={() => triggerCompanionReaction(getCurrentEvent())}
                id="btn-trigger-sandbox"
                className="bg-indigo-650 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-indigo-400/50"
              >
                <span>Generate Autonomous AI Reaction ⚡</span>
              </button>
            </div>
          </div>
        )}

        {/* Demo Controller Deck */}
        {matchMode === "demo" && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-xl mb-6 shadow-2xl backdrop-blur-md">
            
            {/* Play direction states */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-slate-200 font-bold font-sans text-sm">
                  IPL Final Over Cinematic Scenario
                </span>
                <span className="bg-indigo-500/15 text-indigo-400 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                  Bumrah over setup
                </span>
              </div>
              <p className="text-xs text-slate-450 font-medium">
                Simulate RCB needing 18 runs from 6 balls of the final over. Trigger AI reactions ball-by-ball.
              </p>
            </div>

            {/* controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handlePrevBall}
                disabled={currentBallIndex === 0}
                id="btn-prev-ball"
                className="bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-bold px-3 py-2 text-xs rounded-lg transition-transform disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                Back Delivery
              </button>
              
              <button
                onClick={resetOver}
                id="btn-reset-over"
                className="bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 p-2 text-xs rounded-md transition-transform flex items-center justify-center cursor-pointer"
                title="Reset simulation to over beginning"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
              </button>

              <div className="h-5 w-px bg-white/10" />

              {/* Autoplay / Autonomous sequence simulation switcher */}
              <button
                onClick={() => setAutoplay(!autoplay)}
                id="btn-autoplay-toggle"
                className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 border ${
                  autoplay 
                    ? "bg-rose-550/15 text-rose-400 border-rose-500/40 animate-pulse" 
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                }`}
              >
                {autoplay ? (
                  <>
                    <Square className="w-3.5 h-3.5 text-rose-400" /> Stop Autoplay
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-white" /> Start Autoplay (Auto Matches)
                  </>
                )}
              </button>

              <button
                onClick={handleNextBall}
                disabled={currentBallIndex === IPL_FINAL_OVER_SEQUENCE.length - 1}
                id="btn-deliver-ball"
                className="bg-indigo-600 hover:bg-indigo-500 font-bold px-4 py-2 text-white rounded-lg transition-transform flex items-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-xs shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-indigo-400/50"
              >
                <span>Deliver Next Ball 🏏</span>
              </button>
            </div>
          </div>
        )}

        {/* Dashboard 3-column / 2-column Layout Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: AI Companion Spotlight Card & Tactical Insight */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Box A: Major AI Companion Bubble Screen */}
              <div className="md:col-span-2">
                <AICompanionCard 
                  onStateChange={(state) => setCompanionState(state)}
                  currentState={companionState}
                  activeReaction={activeReaction?.reaction || ""}
                  narrativeArc={activeReaction?.narrativeArc || "DEATH OVER DRAMA"}
                  isGenerating={isGenerating}
                  onSynthesizeSpeech={(text) => speakReaction(text)}
                  isSpeaking={isSpeaking}
                />
              </div>

              {/* Box B: Tactical Cricket Insights */}
              <div className="col-span-1">
                <TacticalInsightCard 
                  currentEvent={currentEvent}
                  insightText={activeReaction?.tacticalInsight || ""}
                  isGenerating={isGenerating}
                />
              </div>

              {/* Box C: Win rate slider indicator graphs */}
              <div className="col-span-1">
                <MomentumMeter 
                  currentEvent={currentEvent}
                  reactionHistory={reactionHistory}
                  currentRating={activeReaction?.momentumRating || 0}
                />
              </div>

            </div>
          </div>

          {/* Column 2: Live Bantering feed Lobby & polling widget panels */}
          <div id="right-rail" className="space-y-6">
            {/* Gamified Live fan polling tracker */}
            <PollWidget 
              question={activeReaction?.poll?.question || ""}
              options={activeReaction?.poll?.options || []}
              pollId={`${currentBallIndex}-${matchMode}`}
            />

            {/* Stadium Banters Tweet Desk */}
            <MemeFeed 
              feedMessages={feedMessages}
              onAddUserMessage={handleAddUserComment}
            />
          </div>

        </div>

        {/* Dynamic Stadium Features bottom info banner */}
        <footer className="mt-12 glass-panel p-5 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <p className="text-xs text-slate-400 font-sans font-medium leading-relaxed">
              <strong>PulsePlay AI</strong> uses server-side <strong>Gemini 3.5 Flash</strong> prompt chaining to dynamically parse live IPL match structures, calculating complex momentum shifts, emotional fan tones, and micro-polls instantly. Perfect for a multi-user hackathon demo.
            </p>
          </div>
          <span className="text-[10px] text-slate-500 font-mono font-bold uppercase shrink-0 whitespace-nowrap">
            PROUDLY CODE BUILT FOR CRICKET FANS
          </span>
        </footer>

      </main>

      {/* Floating Stadium BROADCAST notifications overlays */}
      <NotificationSimulation 
        notifications={notifications}
        onDismiss={handleDismissNotification}
      />

    </div>
  );
}
