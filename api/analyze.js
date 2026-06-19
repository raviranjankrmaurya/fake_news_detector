// =============================================
//   Vercel Serverless Function
//   api/analyze.js — Groq API proxy
//   API key safely server side rahegi
// =============================================

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const API_KEY = process.env.GROQ_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "API key not configured on server." });

  const { articleText } = req.body;
  if (!articleText) return res.status(400).json({ error: "articleText required" });

  const systemPrompt = `You are TruthLens, an expert AI fact-checker for students. Analyze news articles for credibility and misinformation.

IMPORTANT: Respond ONLY with a valid JSON object. No explanation, no markdown, no backticks. Raw JSON only.

Format:
{
  "verdict": "FAKE" or "CREDIBLE" or "MIXED" or "UNCERTAIN",
  "credibility_score": <number 0-100>,
  "red_flags": ["flag1", "flag2", "flag3"],
  "summary": "2-3 sentence neutral summary of what the article claims.",
  "reasoning": "2-3 sentences explaining your verdict.",
  "tips": ["tip1", "tip2", "tip3"]
}

Scoring: 0-30 = clearly fake, 31-50 = misleading, 51-70 = mixed, 71-85 = mostly credible, 86-100 = highly credible.`;

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
        max_tokens: 1024,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user",   content: `Analyze this article and return JSON only:\n\n${articleText}` }
        ]
      })
    });

    if (!groqRes.ok) {
      const err = await groqRes.json().catch(() => ({}));
      return res.status(groqRes.status).json({ error: err?.error?.message || "Groq API error" });
    }

    const data = await groqRes.json();
    const rawText = data?.choices?.[0]?.message?.content || "";

    let cleanText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const fb = cleanText.indexOf("{");
    const lb = cleanText.lastIndexOf("}");
    if (fb !== -1 && lb !== -1) cleanText = cleanText.slice(fb, lb + 1);

    const parsed = JSON.parse(cleanText);
    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({ error: err.message || "Server error" });
  }
}