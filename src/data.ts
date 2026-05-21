import { MatchEvent, AIReaction } from "./types";

export const TEAMS = [
  { id: "RCB", name: "Royal Challengers Bengaluru", short: "RCB", color: "from-red-600 to-black", accent: "#ef4444" },
  { id: "MI", name: "Mumbai Indians", short: "MI", color: "from-blue-600 to-blue-800", accent: "#3b82f6" },
  { id: "CSK", name: "Chennai Super Kings", short: "CSK", color: "from-yellow-400 to-yellow-600", accent: "#eab308" },
  { id: "KKR", name: "Kolkata Knight Riders", short: "KKR", color: "from-purple-800 to-yellow-500", accent: "#a855f7" }
];

export const PLAYERS = {
  RCB: ["Virat Kohli", "Dinesh Karthik", "Glenn Maxwell", "Mahipal Lomror"],
  MI: ["Jasprit Bumrah", "Hardik Pandya", "Rohit Sharma", "Suryakumar Yadav"],
  CSK: ["MS Dhoni", "Ruturaj Gaikwad", "Ravindra Jadeja"],
  KKR: ["Shreyas Iyer", "Sunil Narine", "Rinku Singh"]
};

// A highly dramatic simulated 20th Over IPL Chase
// Target: RCB needs 18 runs off 6 balls.
// Bowling: Jasprit Bumrah (MI)
// batting: Dinesh Karthik & Glenn Maxwell (RCB)
export const IPL_FINAL_OVER_SEQUENCE: MatchEvent[] = [
  {
    id: "ball-0",
    over: "19.0", // Pre-over state
    event: "RUN",
    runsScored: 0,
    batter: "Dinesh Karthik",
    bowler: "Jasprit Bumrah",
    score: "163/5",
    battingTeam: "RCB",
    bowlingTeam: "MI",
    runsNeeded: 18,
    ballsLeft: 6,
    commentaryText: "Bumrah takes his final mark. Dinesh Karthik stands alert, his gloves adjusted. 18 runs needed off the last 6 deliveries. The crowd is at absolute deafening levels. Who handles the pressure?"
  },
  {
    id: "ball-1",
    over: "19.1",
    event: "BOUNDARY",
    runsScored: 4,
    batter: "Dinesh Karthik",
    bowler: "Jasprit Bumrah",
    score: "167/5",
    battingTeam: "RCB",
    bowlingTeam: "MI",
    runsNeeded: 14,
    ballsLeft: 5,
    commentaryText: "FOUR! What a shot! Bumrah bowls full and searching on the pads, but Karthik shuffles off-side early and pre-dates. He whips it wide of short fine-leg for a blistering boundary! Perfect start for RCB!"
  },
  {
    id: "ball-2",
    over: "19.2",
    event: "DOT",
    runsScored: 0,
    batter: "Dinesh Karthik",
    bowler: "Jasprit Bumrah",
    score: "167/5",
    battingTeam: "RCB",
    bowlingTeam: "MI",
    runsNeeded: 14,
    ballsLeft: 4,
    commentaryText: "DOT BALL! Absolute mastery! Bumrah recovers with a bullet 147kph toe-crusher yorker. Karthik has to jam his bat down just in time, nearly toeing it on. No run possible, massive swing of tension!"
  },
  {
    id: "ball-3",
    over: "19.3",
    event: "RUN",
    runsScored: 1,
    batter: "Dinesh Karthik",
    bowler: "Jasprit Bumrah",
    score: "168/5",
    battingTeam: "RCB",
    bowlingTeam: "MI",
    runsNeeded: 13,
    ballsLeft: 3,
    commentaryText: "SINGLE Scrambled! Bumrah hits a back-of-a-length high cutter. Karthik forces it to deep cover. They push hard, nearly a mix-up, but complete the single. Glenn Maxwell now stands on strike!"
  },
  {
    id: "ball-4",
    over: "19.4",
    event: "WICKET",
    runsScored: 0,
    batter: "Glenn Maxwell",
    bowler: "Jasprit Bumrah",
    score: "168/6",
    battingTeam: "RCB",
    bowlingTeam: "MI",
    runsNeeded: 13,
    ballsLeft: 2,
    commentaryText: "WICKET!!! BUMRAH GETS THE BIG FISH! A mind-blowing slower bouncer. Maxwell tries to smash it into the upper stands over mid-wicket but gets deceived by the lack of pace. Top edge flies high into deep backward square leg, and Rohit Sharma slides and takes an epic catch! Silence in Bengaluru!"
  },
  {
    id: "ball-5",
    over: "19.5",
    event: "BOUNDARY",
    runsScored: 6,
    batter: "Mahipal Lomror",
    bowler: "Jasprit Bumrah",
    score: "174/6",
    battingTeam: "RCB",
    bowlingTeam: "MI",
    runsNeeded: 7,
    ballsLeft: 1,
    commentaryText: "SIX!!! DEAR LORD! MAHIPAL LOMROR OUT OF NOWHERE! First ball face! Bumrah misses his yorker length by a millimeter, slotting a low full toss. Lomror clears his front leg and swings down the ground, smashing it dead-straight into the stadium master-clock! Massive momentum swing!"
  },
  {
    id: "ball-6",
    over: "20.0",
    event: "BOUNDARY",
    runsScored: 6, // Let's make Lomror hit another SIX or index a dramatic boundary! Let's make it a 6, RCB WINS! Or a 4, MI wins by 2! Let's make RCB win for supreme epic factor!
    batter: "Mahipal Lomror",
    bowler: "Jasprit Bumrah",
    score: "180/6",
    battingTeam: "RCB",
    bowlingTeam: "MI",
    runsNeeded: 7,
    ballsLeft: 0,
    commentaryText: "SIX!!! HE HAS DONE IT! UNBELIEVABLE! MAHIPAL LOMROR IS THE HERO! Bumrah bowls a high-speed yorker on off-side. Lomror opens the face, slices it over deep backward point, over the boundary rope! RCB win! RCB cricket fans are crying on the pitch!"
  }
];

// Fallback high quality AI reaction matches just in case Gemini API is on a cold-start, has rate limits or network lag
export const PRESET_AI_REACTIONS: { [key: string]: { [key in "Hype Commentator" | "Tactical Analyst" | "Meme Lord" | "Chill Fan"]: AIReaction } } = {
  "ball-0": {
    "Hype Commentator": {
      reaction: "LADIES AND GENTLEMEN, THIS IS WHAT WE LIVE FOR! THE FINAL OVER OF A DRAMATIC IPL CLASH! 18 NEEDED OFF 6! BUMRAH VS KARTHIK! SEATBELTS ON!",
      tacticalInsight: "Bumrah will seek to bowl exclusively yorkers at the batter's toes, while Karthik is likely to slide outside off to exploit the short third-man boundary.",
      memeCommentary: "My blood pressure is currently off the charts! RCB fans, hold your breaths!",
      narrativeArc: "DEATH OVER SUSPENSE",
      poll: {
        question: "How many runs will Jasprit Bumrah concede in this over?",
        options: ["Under 10 runs (MI wins)", "11-17 runs (Super Over potential)", "18+ runs (RCB wins)", "Bumrah gets 2+ wickets"]
      },
      momentumRating: -10
    },
    "Tactical Analyst": {
      reaction: "A fascinating clinical scenario. Bumrah has 2 overs in the bank and is at top physical peak. Dinesh Karthik has an active strike rate of index 164.5 against right-arm medium fast in death overs.",
      tacticalInsight: "MI captain Hardik has configured a defensive field: deep point, deep midwicket, long on, and long off. This limits direct vertical hitting, forcing Karthik to attempt reverse scoops or high-risk lofted sweeps.",
      memeCommentary: "Cricket computers running millions of regressions. RCB win probability currently clocks at 22%. Optimal bowling path is low-full-toss avoidance.",
      narrativeArc: "TACTICAL CHESSMATCH",
      poll: {
        question: "What length is Bumrah most likely to execute on Ball 1?",
        options: ["Searing yorker (blockhole)", "Bouncing heavy short ball", "Slower wide-guarded cutter", "Hard length round-the-wicket"]
      },
      momentumRating: -15
    },
    "Meme Lord": {
      reaction: "Dinesh Karthik preparing to either become a complete deity in RCB folklore or cause collective therapy sessions for RCB fans in 6 balls. No in-between.",
      tacticalInsight: "Bumrah exists solely to generate memes of high-IQ defense while wearing absolute stone-cold killer expressions.",
      memeCommentary: "RCB dugout currently looks like they are calculating their absolute mortality. Ready to spam 'RCB RCB' under heavy strain.",
      narrativeArc: "MEME DUGOUT VIBES",
      poll: {
        question: "Choose RCB fans' mental state:",
        options: ["Complete emotional collapse", "Hoping for a random Bumrah no-ball", "Calculating scientific run rates", "Praying to DK as a savior"]
      },
      momentumRating: -10
    },
    "Chill Fan": {
      reaction: "Man, I literally cannot look at the screen. RCB is doing RCB things again. Settle down with some popcorn and a cool drink, this is going to get stressful.",
      tacticalInsight: "DK just needs to make contact. Bumrah's release point is always tough to read, but a single splits the field easily.",
      memeCommentary: "If RCB loses this from here, I am deletion of my subscription, not even capping.",
      narrativeArc: "SOFA COACH MODE",
      poll: {
        question: "What is your snack status for this nail-biter?",
        options: ["Finished all popcorn already", "Cold beverage currently shivering in hand", "Biting finger nails exclusively", "Pacing around the room"]
      },
      momentumRating: -10
    }
  },
  "ball-1": {
    "Hype Commentator": {
      reaction: "FOUR! ABSOLUTELY MAGNIFICENT! KARTHIK MOVES LIKE A CHEETAH AND CRACKS IT BACK OVER SHORT FINE-LEG! WHAT VALUE! PRESSURE SWINGING!",
      tacticalInsight: "Bumrah chased the pads but overpitched slightly, giving Karthik the leverage to pick up the angle and flick. Fine leg was up, in accordance to death fields.",
      memeCommentary: "RCB HAS LIFT OFF! DK IS COOKING! RCB RED LEVEL ALERT!",
      narrativeArc: "KARTHIK UNLEASHED",
      poll: {
        question: "Can Dinesh Karthik secure another boundary on the next ball?",
        options: ["Yes, he's in the red-hot zone", "No, Bumrah yorker reply incoming", "Just a scrambled single", "Strategic wicket call!"]
      },
      momentumRating: 25
    },
    "Tactical Analyst": {
      reaction: "A smart offensive transition. Karthik recognized MI's short-fine fielder was positioned inside the circle. By shifting his weight early, he converted a defensive yorker line into an easy wristy boundary.",
      tacticalInsight: "Bumrah's margin of error was negligible. He missed the yorker target by just 8 centimeters, allowing batsman leverage. Win probability RCB climbs by 12.4%.",
      memeCommentary: "Bumrah conceding a boundary is rarer than finding water on Mars. Statistically significant start.",
      narrativeArc: "MATCHUP COUNTER-PLAY",
      poll: {
        question: "Where should Bumrah target his next delivery?",
        options: ["Wide outside-off corridor", "A physical helmet-seeking bouncer", "Stump-seeking low yorker", "Slower back-of-the-hand cutter"]
      },
      momentumRating: 20
    },
    "Meme Lord": {
      reaction: "DK didn't just hit a boundary, he literally bypassed Bumrah's firewall. That shot was custom cheatcode hacks!",
      tacticalInsight: "DK literally said 'shuffling outside is my passion' and whipped it like a prime executive.",
      memeCommentary: "Bumrah looking at the pitch like 'who coded this ball' 💀",
      narrativeArc: "DK CHASSIS EXTREME",
      poll: {
        question: "Is DK secretly a time-traveler who played this ball before?",
        options: ["Definitely yes", "Bumrah is updating his defenses", "Typical RCB hopium", "MI captain crying internally"]
      },
      momentumRating: 22
    },
    "Chill Fan": {
      reaction: "Oh my goodness! Yes! DK you beauty! That line went straight to the boundary. I almost jumped off the sofa and spilled my drink!",
      tacticalInsight: "It looked like Bumrah tried for a leg-side yorker, but he just set it up perfectly for DK to scoop it past short fine leg.",
      memeCommentary: "My blood pressure went down slightly but we still need 14, calm down self.",
      narrativeArc: "GLIMMER OF RCB HOPE",
      poll: {
        question: "Will RCB pull this chase off?",
        options: ["Yes, we believe in DK!", "No, too early to celebrate", "Super Over is destiny", "I am too scared to say"]
      },
      momentumRating: 18
    }
  },
  "ball-4": {
    "Hype Commentator": {
      reaction: "HE'S GONE! OUT! BUMRAH GETS MAXWELL! WHAT A HIGH-DRA METRIC CUTTER! COCK-A-HOOP CELEBRATIONS IN THE MUMBAI DUGOUT!",
      tacticalInsight: "Incredible speed-off slower bouncer from Bumrah. Maxwell didn't account for the sticky bounce, leading to a fatal top edge taken brilliantly by Rohit.",
      memeCommentary: "MI FANS ARE ABSOLUTELY BANANAS! MAXWELL DISMISSED! HEARTBREAK FOR RCB AGAIN!",
      narrativeArc: "BUMRAH STRIKES DEATH",
      poll: {
        question: "With Lomror coming in, can RCB salvage 13 runs off 2 balls?",
        options: ["Yes, miracle is still on", "No, Bumrah is going to choke them", "Super Over is our only savior", "MI has 99% win probability now"]
      },
      momentumRating: -60
    },
    "Tactical Analyst": {
      reaction: "A masterclass slow-ball trap. Bumrah slowed his pace down to 121kph but maintained the identical arm swing. Maxwell had committed to a high-speed pull, leading to early contact and a steep vertical top-edge.",
      tacticalInsight: "With Lomror entering, a left-hander creates a shift. Bumrah has a 72% success rate against left-handers in the 20th over.",
      memeCommentary: "Win probability for Mumbai Indians spikes to 88.5%. Maximum tactical control achieved.",
      narrativeArc: "DEATH SPELL BY BUMRAH",
      poll: {
        question: "What should Lomror do on ball 5?",
        options: ["Swing down the ground immediately", "Take a single to give DK strike", "Defend and salvage net run rate", "Attempt a high-risk reverse sweep"]
      },
      momentumRating: -55
    },
    "Meme Lord": {
      reaction: "Maxwell literally disconnected during that delivery. Ping went over 999ms. Bumrah is built different, bro has no feelings.",
      tacticalInsight: "Maxwell tried the 'Unsubscribe' button on Bumrah's slow bouncer but it was non-clickable.",
      memeCommentary: "RCB fans deleted 'IPL Trophy' from draft folder again 😭",
      narrativeArc: "THE DREAM DIES? OR CHOKE LIVE?",
      poll: {
        question: "Current mood of an RCB fan:",
        options: ["Absolute pitch-black depression", "Searching 'how to survive stress'", "Blaming the umpire", "Waiting for the next season"]
      },
      momentumRating: -58
    },
    "Chill Fan": {
      reaction: "No way. No freaking way... Maxwell is out. Why would he hit that high? My sofa cushion is now fully compressed from me squeezing it. This is tragic.",
      tacticalInsight: "Bumrah fooled him with that off-cutter bouncer. Maxwell fell right into the trap. Now Lomror has a massive weight on his shoulders.",
      memeCommentary: "A typical tragic weekday RCB evening. This is exhausting.",
      narrativeArc: "SPOILT FUN",
      poll: {
        question: "Will Lomror pull a miracle?",
        options: ["Highly doubt it", "Maybe a quick boundary?", "Double runs", "Super Over loading"]
      },
      momentumRating: -50
    }
  }
};
