import React, { useEffect } from "react";
import { SmartNotification } from "../types";
import { TrendingUp, Flame, ShieldAlert, Cpu, X } from "lucide-react";

interface NotificationSimulationProps {
  notifications: SmartNotification[];
  onDismiss: (id: string) => void;
}

export function NotificationSimulation({ notifications, onDismiss }: NotificationSimulationProps) {
  
  // Set automatic fades
  useEffect(() => {
    if (notifications.length === 0) return;
    
    // Auto clear the latest notification after 5 seconds to prevent spam clutter
    const latest = notifications[notifications.length - 1];
    const timer = setTimeout(() => {
      onDismiss(latest.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notifications, onDismiss]);

  if (notifications.length === 0) return null;

  return (
    <div id="toast-notifications" className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full px-4">
      {notifications.map((notif) => {
        let icon = <Cpu className="w-5 h-5 text-indigo-400" />;
        let borderGlow = "border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.25)]";
        
        if (notif.type === "MOMENTUM") {
          icon = <TrendingUp className="w-5 h-5 text-emerald-400 animate-bounce" />;
          borderGlow = "border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.25)]";
        } else if (notif.type === "PRESSURE" || notif.type === "ALERT") {
          icon = <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />;
          borderGlow = "border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.25)]";
        } else if (notif.type === "CLUTCH") {
          icon = <Flame className="w-5 h-5 text-[#f0ff00]" />;
          borderGlow = "border-[#f0ff00]/30 shadow-[0_0_15px_rgba(240,255,0,0.25)]";
        }

        return (
          <div 
            key={notif.id} 
            className={`glass-panel border-white/20 backdrop-blur-md rounded-xl p-4 flex gap-3 relative overflow-hidden transform animate-in slide-in-from-bottom duration-300 shadow-2xl`}
          >
            {/* Background color glow bleed */}
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-[#00d4ff] to-[#ff0055]" />
            
            <div className="bg-black/60 p-2 rounded-lg self-start border border-white/5">
              {icon}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-sans font-black text-slate-100 text-xs uppercase tracking-tight">
                  {notif.title}
                </h4>
                <button 
                  onClick={() => onDismiss(notif.id)}
                  className="text-slate-400 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-slate-300 text-xs font-sans leading-relaxed">
                {notif.message}
              </p>
              <span className="text-[8px] text-slate-500 font-mono mt-1 block">
                🚨 PulsePlay Broadcast Overlays • {notif.timestamp}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
