/**
 * PulsePlay AI Cricket App types
 */

export interface MatchEvent {
  id: string;
  over: string; // e.g. "19.1", "19.2", ...
  event: "DOT" | "RUN" | "BOUNDARY" | "WICKET";
  runsScored: number;
  batter: string;
  bowler: string;
  score: string;
  battingTeam: string;
  bowlingTeam: string;
  runsNeeded: number;
  ballsLeft: number;
  commentaryText: string;
}

export interface AIReaction {
  reaction: string;
  tacticalInsight: string;
  memeCommentary: string;
  narrativeArc: string;
  poll: {
    question: string;
    options: string[];
  };
  momentumRating: number; // -100 to 100 indicator (MI dominant vs RCB dominant)
}

export type PersonalityMode = "Hype Commentator" | "Tactical Analyst" | "Meme Lord" | "Chill Fan";

export interface CompanionState {
  personality: PersonalityMode;
  favoriteTeam: string;
  favoritePlayer: string;
}

export interface WebPollVote {
  pollId: string;
  selectedOptionIndex: number;
  votes: number[]; // real-time percentages
}

export interface SmartNotification {
  id: string;
  type: "MOMENTUM" | "PRESSURE" | "CLUTCH" | "ALERT";
  title: string;
  message: string;
  timestamp: string;
}

export interface FeedMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  styleClass: string;
  avatarSeed: string;
}
