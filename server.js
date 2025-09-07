// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());

// --- CORS (restrict to your site) ---
const allowed = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowed.length === 0) return cb(null, true);
      return allowed.includes(origin)
        ? cb(null, true)
        : cb(new Error("Not allowed by CORS"));
    },
  })
);

// --- Basic health check ---
app.get("/healthz", (_req, res) => res.status(200).send("ok"));

// --- Main endpoint ---
app.post("/api/polish-bio", async (req, res) => {
  try {
    const { bio, tone, short } = req.body || {};

    if (!bio || typeof bio !== "string" || bio.trim().length < 10) {
      return res
        .status(400)
        .json({ error: "Please provide a valid bio (>= 10 characters)." });
    }

    const lengthRule = short ? "Limit to 150 words." : "";
    const system =
      "You are a copywriter who helps mental health professionals write approachable bios.";
    const user = `
Rewrite the following therapist bio for a client-facing audience.
Tone: ${tone || "Warm & Compassionate"}.
Keep it accurate, warm, and jargon-free. ${lengthRule}

Bio:
${bio}

Respond with just the polished bio, no preface.
    `.trim();

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // ✅ stable + cheap
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.7,
      }),
    });

    if (!r.ok) {
      const errText = await r.text().catch(() => "");
      console.error("OpenAI error:", r.status, errText);

      // bubble up exact error message
      let clean = "";
      try {
        const parsed = JSON.parse(errText);
        clean = parsed?.error?.message || parsed?.message || errText;
      } catch {
        clean = errText || "Unknown upstream error";
      }

      return res
        .status(502)
        .json({ error: `Upstream ${r.status}: ${clean}` });
    }

    const data = await r.json();
    const output = data?.choices?.[0]?.message?.content?.trim();

    if (!output)
      return res.status(502).json({ error: "No output from model." });

    res.json({ output });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// --- Start ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`bio-polisher listening on :${PORT}`);
});
