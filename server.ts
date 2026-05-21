import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with named parameters
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Using fallback mock replies.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

const aiClient = getGeminiClient();

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: !!process.env.GEMINI_API_KEY });
});

// React Ball Event Interaction Endpoint (Server-Side proxying of Gemini API)
app.post("/api/gemini/reaction", async (req, res) => {
  try {
    const { 
      eventData, // matches the current simulated or live ball
      personality = "Hype Commentator", 
      favoriteTeam = "None", 
      favoritePlayer = "None" 
    } = req.body;

    if (!eventData) {
      return res.status(400).json({ error: "Missing eventData in request body" });
    }

    const {
      over,
      event,
      batter,
      bowler,
      score,
      requiredRuns,
      ballsLeft,
      runsScored,
      commentaryText
    } = eventData;

    // Craft custom context depending on user personalization choices
    let biasHint = "";
    if (favoriteTeam && favoriteTeam !== "None") {
      biasHint += `The fan's favorite team is the "${favoriteTeam}". If RCB or MI are playing, adapt response naturally (be extremely excited if they do well, or extremely stressed/heartbroken if they concede runs or lose wickets). `;
    }
    if (favoritePlayer && favoritePlayer !== "None") {
      biasHint += `The fan's absolute favorite player is "${favoritePlayer}". If this player is mentioned or is currently batting/bowling, offer high-praise, dramatic defending, or supreme hype for them. `;
    }

    // Direct instructions based on personality
    let systemInstruction = `You are a state-of-the-art Autonomous Match Companion and passionate expert Cricket Fan watching an intense IPL match in real-time. `;
    if (personality === "Hype Commentator") {
      systemInstruction += `Adopt a highly energetic, fast-talking, uppercase-screaming Hype Commentator voice (like Ravi Shastri or Harsha Bhogle). Use dramatic exclamation marks, hype up every shot, and convey sheer shock and adrenaline of a high-stakes final over.`;
    } else if (personality === "Tactical Analyst") {
      systemInstruction += `Adopt an elite, high-IQ Tactical Analyst persona. Use moneyball metrics, field placements strategy, bowling variations (slower-ball, yorkers), matchups data, pressure quotients, and mathematical run-rate analysis. Explain the 'why' behind captain and bowler choices.`;
    } else if (personality === "Meme Lord") {
      systemInstruction += `Adopt a terminally online, sarcastic, roast-heavy Meme Lord fan persona. Use internet slang, meme formats (e.g. ' RCB heartrate goes stonks', 'Bumrah is him', 'Surely they can\\'t choke this again'), and playful modern banters. Keep it witty and funny.`;
    } else { // Chill Fan
      systemInstruction += `Adopt a cozy, highly relatable Chill Fan sitting on the sofa eating snacks. Act like a casual friend chatting, expressing standard worries ('RCB is raising my BP again'), eating popcorn, swearing under breath, and being easily excited but casual.`;
    }

    systemInstruction += `\n\nContext guidelines: ${biasHint}`;

    const prompt = `
Match Event details:
- Ball Over: ${over}
- Event Type: ${event}
- Batsman: ${batter}
- Bowler: ${bowler}
- Current Score: ${score}
- Required Runs: ${requiredRuns} runs left in the match
- Balls Remaining: ${ballsLeft} balls left
- Runs Scored this ball: ${runsScored}
- Context commentary of the ball: "${commentaryText || ''}"

Generate a live autonomous reaction payload for this specific ball. Respond in pure JSON adhering to the exact schema requested. Keep reactions highly relevant to this specific wicket, boundary, dot ball or single in the context of the super intense final over!
`;

    if (!aiClient) {
      // Fallback response if API Key is not set, guaranteeing the app has 100% demo uptime
      const fallbackPayload = generateFallbackResponse(eventData, personality, favoriteTeam, favoritePlayer);
      return res.json(fallbackPayload);
    }

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reaction: {
              type: Type.STRING,
              description: "The primary emotional reaction matching the persona. Extremely specific to the bowler, batsman, and run-chase stakes. Make it 2-3 sentences max."
            },
            tacticalInsight: {
              type: Type.STRING,
              description: "A professional tactical overview explaining the delivery line, field placement, bowling matchup, or batter's mental stakes."
            },
            memeCommentary: {
              type: Type.STRING,
              description: "A funny meme-style caption, hot take, or sarcastic social-media reaction matching the current ball."
            },
            narrativeArc: {
              type: Type.STRING,
              description: "A brief punchy storyline headline of the match right now, e.g., 'THE BUMRAH MASTERCLASS' or 'RCB CHOKE INCOMING' or 'DK REDEMPTION'."
            },
            poll: {
              type: Type.OBJECT,
              properties: {
                question: {
                  type: Type.STRING,
                  description: "An engaging poll question directly related to the next ball prediction, tactical option, or final match outcome."
                },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly 4 options for fans to vote on based on the game's turning point."
                }
              },
              required: ["question", "options"]
            },
            momentumRating: {
              type: Type.INTEGER,
              description: "An integer between -100 and 100 describing batting team momentum. Positive values mean batting team dominates, negative values mean defending bowler dominates. Be extreme for big shots/wickets!"
            }
          },
          required: ["reaction", "tacticalInsight", "memeCommentary", "narrativeArc", "poll", "momentumRating"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json(parsedData);

  } catch (error: any) {
    console.error("Gemini reaction API error:", error);
    res.status(500).json({ 
      error: "Failed to generate AI companion reaction.", 
      details: error.message,
      fallback: true,
      data: generateFallbackResponse(req.body?.eventData || {}, req.body?.personality, req.body?.favoriteTeam, req.body?.favoritePlayer)
    });
  }
});

// Helper function to return high quality fallback response if API is unreachable or key is keyless
function generateFallbackResponse(eventData: any, personality: string, favoriteTeam: string, favoritePlayer: string) {
  const { over, event, batter, bowler, requiredRuns, ballsLeft, score } = eventData || {};
  
  let reaction = `What a sensation! At over ${over}, ${batter} faces off against ${bowler}. The tension is unreal under these night stadium lights!`;
  let tacticalInsight = `The bowling lineup is adjusting their fielders wide. ${bowler} is trying to force a mistake by aiming for a wide blockhole yorker.`;
  let memeCommentary = `My heart rate is currently higher than RCB's historical run rates 📈`;
  let narrativeArc = "DEATH OVER THRILLER";
  let momentumRating = 0;
  let qText = "What will be the outcome of the next delivery?";
  let pOpts = ["Searing yorker (dot ball)", "Cracking boundary (4/6)", "Scrambled single", "Crucial wicket!"];

  if (event === "BOUNDARY") {
    reaction = `BOOM! That is out of here! ${batter} absolutely dispatches ${bowler} back into the stands! What a massive maximum!`;
    tacticalInsight = `${bowler} missed the absolute blockhole yorker by inches, pitching a low full toss that was right in ${batter}'s slot on the leg side.`;
    memeCommentary = `Ball went directly into orbit. NASA tracking it as we speak 🚀`;
    narrativeArc = "BATTERS UNLEASHED";
    momentumRating = 45;
    qText = "Can the batter replicate this shot next delivery?";
    pOpts = ["Absolutely, another 6!", "Bowler bowls a yorker reply", "Double runs", "Wicket incoming"];
  } else if (event === "WICKET") {
    reaction = `OUT!!! HE'S GONE! Absolute silence in the crowd but utter ecstasy for fans of ${bowler}! Major collapse moment!`;
    tacticalInsight = `Stunning slower-ball variation from ${bowler}. Foresaw the charge, shortened the length, leading to a simple caught-and-bowled or catch on the boundary.`;
    memeCommentary = "F for the RCB dugout. Silent mode activated 🔇";
    narrativeArc = "BOWLING MASTERCLASS";
    momentumRating = -55;
    qText = "Is this the ultimate turning point of the match?";
    pOpts = ["Yes, game over for batting team", "No, DK is still at the crease", "Too close to call", "Super Over pending!"];
  } else if (event === "DOT") {
    reaction = `Gold dust! A priceless dot ball under monumental pressure! ${bowler} wins this mini-battle of wills hands down!`;
    tacticalInsight = `${bowler} nails the off-stump wide line, keeping it extremely safe from the long-on boundary hazard. Out of options, ${batter} chops it directly to cover.`;
    memeCommentary = "That dot ball felt longer than a 5-day Test match ⏳";
    narrativeArc = "BUMRAH CHOKEOUT";
    momentumRating = -20;
  } else {
    // Normal single / double
    reaction = `Smart cricket! Just picking up the gap and scrambling for runs. Keep the scoreboard ticking!`;
    tacticalInsight = `Excellent placement down to deep cover. The batsman uses the defensive field layout to rotate strike and preserve wickets.`;
    memeCommentary = "Not a boundary but we take those. Scrambling counts!";
    narrativeArc = "THE CHASE INTENSIFIES";
    momentumRating = 5;
  }

  // Adjust style based on personality
  if (personality === "Hype Commentator") {
    reaction = `UNBELIEVABLE SCENES! ${reaction.toUpperCase()} THIS IS CRICKET IN ITS ABSOLUTE HIGHEST FORM! 🔥`;
    memeCommentary = `GET ON YOUR FEET! ${memeCommentary.toUpperCase()}`;
  } else if (personality === "Meme Lord") {
    reaction = `Bro, ${batter} is literally doing sidequests at this point. ${reaction}`;
    memeCommentary = `Actual footage of me right now: 🤡. ${memeCommentary}`;
  } else if (personality === "Tactical Analyst") {
    reaction = `Matchup analysis validates this outcome. ${reaction}`;
  }

  return {
    reaction,
    tacticalInsight,
    memeCommentary,
    narrativeArc,
    poll: {
      question: qText,
      options: pOpts
    },
    momentumRating
  };
}

// Vite integration middleware setup
async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PulsePlay AI server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
