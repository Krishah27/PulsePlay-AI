import React, { useState } from "react";
import { PersonalityMode, CompanionState } from "../types";
import { 
  Megaphone, 
  BrainCircuit, 
  Laugh, 
  Coffee, 
  ChevronRight, 
  Users, 
  User, 
  Flame, 
  Volume2, 
  VolumeX,
  Laptop
} from "lucide-react";
import { TEAMS, PLAYERS } from "../data";

interface AICompanionCardProps {
  onStateChange: (state: CompanionState) => void;
  currentState: CompanionState;
  activeReaction: string;
  narrativeArc: string;
  isGenerating: boolean;
  onSynthesizeSpeech?: (text: string) => void;
  isSpeaking?: boolean;
}

export function AICompanionCard({ 
  onStateChange, 
  currentState, 
  activeReaction, 
  narrativeArc,
  isGenerating,
  onSynthesizeSpeech,
  isSpeaking = false
}: AICompanionCardProps) {
  const { personality, favoriteTeam, favoritePlayer } = currentState;
  const [showPersonalization, setShowPersonalization] = useState(false);

  // Return design attributes based on the current AI Mode
  const getModeStyles = () => {
    switch (personality) {
      case "Hype Commentator":
        return {
          icon: <Megaphone className="w-8 h-8 text-orange-400" />,
          glowBorder: "border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.15)]",
          avatarColor: "bg-gradient-to-tr from-amber-600 to-orange-500 text-white shadow-[0_0_15px_rgba(237,108,2,0.4)]",
          themeBg: "bg-orange-950/20",
          titleText: "HYPE COMMENTATOR (Ravi-Mode)",
          accentText: "text-orange-400",
          accentBg: "bg-orange-500/10",
          avatarFace: "🗣️"
        };
      case "Tactical Analyst":
        return {
          icon: <BrainCircuit className="w-8 h-8 text-emerald-400" />,
          glowBorder: "border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]",
          avatarColor: "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]",
          themeBg: "bg-emerald-950/20",
          titleText: "TACTICAL ANALYST (AI)",
          accentText: "text-emerald-400",
          accentBg: "bg-emerald-500/10",
          avatarFace: "🧠"
        };
      case "Meme Lord":
        return {
          icon: <Laugh className="w-8 h-8 text-fuchsia-400" />,
          glowBorder: "border-fuchsia-500/40 shadow-[0_0_20px_rgba(217,70,239,0.15)]",
          avatarColor: "bg-gradient-to-tr from-fuchsia-600 to-indigo-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.4)]",
          themeBg: "bg-fuchsia-950/20",
          titleText: "MEMRLORD 9000",
          accentText: "text-fuchsia-400",
          accentBg: "bg-fuchsia-500/10",
          avatarFace: "🤪"
        };
      case "Chill Fan":
        return {
          icon: <Coffee className="w-8 h-8 text-yellow-400" />,
          glowBorder: "border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.15)]",
          avatarColor: "bg-gradient-to-tr from-yellow-600 to-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]",
          themeBg: "bg-yellow-950/20",
          titleText: "CHILL COUCH CRITIC",
          accentText: "text-yellow-400",
          accentBg: "bg-yellow-500/10",
          avatarFace: "🍿"
        };
    }
  };

  const style = getModeStyles();

  const handlePersonalitySelect = (mode: PersonalityMode) => {
    onStateChange({ ...currentState, personality: mode });
  };

  const handleTeamSelect = (teamId: string) => {
    onStateChange({ 
      ...currentState, 
      favoriteTeam: teamId, 
      favoritePlayer: teamId === "None" ? "None" : (PLAYERS[teamId as keyof typeof PLAYERS]?.[0] || "None") 
    });
  };

  const handlePlayerSelect = (player: string) => {
    onStateChange({ ...currentState, favoritePlayer: player });
  };

  return (
    <div id="ai-companion" className={`glass-panel p-5 shadow-xl relative overflow-hidden transition-all duration-300 flex flex-col h-full justify-between`}>
      {/* Dynamic Floating Mode Spotlights */}
      <div className={`absolute top-0 left-0 right-0 h-40 ${style.themeBg} filter blur-3xl rounded-b-full pointer-events-none`} />

      <div>
        {/* Header Block with Mode Quick Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-white/10 pb-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] tracking-wider uppercase font-bold font-mono px-2 py-0.5 rounded ${style.accentBg} ${style.accentText}`}>
                {narrativeArc}
              </span>
              <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-ping" />
              <span className="text-slate-400 font-semibold text-xs uppercase font-mono">Companion Status: Live</span>
            </div>
            <h3 className="text-xl font-black text-white font-sans tracking-tight mt-1">PulsePlay Companion</h3>
          </div>

          <div className="flex flex-wrap gap-1">
            {(["Hype Commentator", "Tactical Analyst", "Meme Lord", "Chill Fan"] as PersonalityMode[]).map((mode) => {
              const active = mode === personality;
              return (
                <button
                  key={mode}
                  onClick={() => handlePersonalitySelect(mode)}
                  id={`btn-${mode.toLowerCase().replace(" ", "-")}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1 ${
                    active 
                      ? `${style.avatarColor} border border-white/20`
                      : "bg-white/5 text-slate-300 hover:text-white border border-white/10 hover:bg-white/10"
                  }`}
                >
                  <span>{mode === "Hype Commentator" ? "🗣️" : mode === "Tactical Analyst" ? "🧠" : mode === "Meme Lord" ? "🤪" : "🍿"}</span>
                  <span className="hidden md:inline">{mode.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Companion Personality Configuration Toggle */}
        <div className="mb-4 relative z-10">
          <button
            onClick={() => setShowPersonalization(!showPersonalization)}
            id="toggle-personalization"
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all text-xs"
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Customize Companion Affiliations</span>
            <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${showPersonalization ? 'rotate-90' : ''}`} />
          </button>

          {showPersonalization && (
            <div className="mt-3 bg-black/60 p-4 rounded-lg border border-white/10 flex flex-col gap-3 backdrop-blur-md">
              {/* Favorite Team Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-mono font-bold uppercase flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Pitch Fandom Bias (Favorite Team)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleTeamSelect("None")}
                    className={`px-2 py-1 text-xs font-bold rounded ${
                      favoriteTeam === "None" ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    No Bias (Neutral)
                  </button>
                  {TEAMS.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => handleTeamSelect(team.id)}
                      className={`px-2 py-1 text-xs font-bold rounded transition-all flex items-center justify-center gap-1 ${
                        favoriteTeam === team.id 
                          ? "bg-indigo-600 text-white border border-white/20" 
                          : "bg-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: team.accent }} />
                      <span>{team.short}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Favorite Player Select */}
              {favoriteTeam !== "None" && (
                <div className="flex flex-col gap-1.5 border-t border-white/10 pt-3">
                  <label className="text-[10px] text-slate-400 font-mono font-bold uppercase flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> Star Player Hype Target
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {PLAYERS[favoriteTeam as keyof typeof PLAYERS]?.map((player) => (
                      <button
                        key={player}
                        onClick={() => handlePlayerSelect(player)}
                        className={`px-2 py-1 text-xs font-bold rounded transition-all ${
                          favoritePlayer === player ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {player}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Bubble Reaction Display */}
        <div className="relative z-10 mb-6 mt-4">
          <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-4 md:p-5 backdrop-blur-md">
            {/* Companion Character Avatar Circle */}
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0 relative ${style.avatarColor}`}>
              <span>{style.avatarFace}</span>
              {isGenerating && (
                <span className="absolute inset-0 rounded-full border-2 border-[#00d4ff] animate-ping opacity-60" />
              )}
              {isSpeaking && (
                <span className="absolute -bottom-1 -right-1 bg-red-500 border-2 border-slate-900 p-1 rounded-full animate-bounce">
                  <Volume2 className="w-3 h-3 text-white" />
                </span>
              )}
            </div>

            {/* Speach bubble content */}
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 mb-1.5 border-b border-white/5 pb-1">
                <span className={`text-xs font-black tracking-tight ${style.accentText}`}>
                  {style.titleText}
                </span>

                {onSynthesizeSpeech && (
                  <button 
                    onClick={() => onSynthesizeSpeech(activeReaction)}
                    disabled={isGenerating || !activeReaction}
                    className="p-1 px-1.5 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Read commentary vocal via TTS"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {isGenerating ? (
                <div className="flex flex-col gap-2 py-2">
                  <div className="h-3 w-11/12 bg-white/10 rounded animate-pulse" />
                  <div className="h-3 w-10/12 bg-white/10 rounded animate-pulse" />
                  <div className="h-3 w-8/12 bg-white/10 rounded animate-pulse" />
                </div>
              ) : (
                <p className="text-slate-100 text-sm md:text-base leading-relaxed font-sans font-medium">
                  "{activeReaction}"
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* active settings tags info footer */}
      <div className="border-t border-white/10 pt-3 relative z-10 flex flex-wrap items-center justify-between text-[10px] text-slate-500 font-mono font-bold">
        <div className="flex items-center gap-1.5">
          <span>Mode:</span>
          <span className={`${style.accentText}`}>{personality}</span>
        </div>
        {favoriteTeam !== "None" && (
          <div className="flex items-center gap-1.5">
            <span>Fandom Bias:</span>
            <span className="text-red-400">{favoriteTeam} ({favoritePlayer})</span>
          </div>
        )}
      </div>
    </div>
  );
}
