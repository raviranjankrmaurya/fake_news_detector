# ⬡ TruthLens — Fake News Detector for Students

An AI-powered web app that analyzes news articles for credibility, detects misinformation, and helps students develop media literacy skills.

---

## 📁 Project Structure

```
fake-news-detector/
├── index.html    → Main HTML structure & UI
├── style.css     → Dark investigative theme styling
├── app.js        → API logic & all interactions
└── README.md     → This file
```

---

## 🔑 API Key Setup (1 Step Only!)

Open `app.js` and find line 7:

```javascript
const API_KEY = "YOUR_ANTHROPIC_API_KEY_HERE";
```

Replace with your actual key:

```javascript
const API_KEY = "sk-ant-api03-xxxxxxxxxxxxxxxxxxxx";
```

That's it! No other changes needed.

---

## 🚀 How to Run

**Option 1 — Direct Open (Recommended for testing)**
Just open `index.html` in your browser. That's it.

**Option 2 — VS Code Live Server**
- Install "Live Server" extension in VS Code
- Right-click `index.html` → Open with Live Server

**Option 3 — Python server (if Direct Open doesn't work)**
```bash
cd fake-news-detector
python -m http.server 8080
# Open: http://localhost:8080
```

---

## ✅ Features

| Feature | Details |
|---|---|
| Credibility Score | 0–100 animated meter |
| Verdict | FAKE / CREDIBLE / MIXED / UNCERTAIN |
| Red Flag Detection | Emotional language, missing sources, fallacies |
| AI Summary | Neutral summary of what the article claims |
| AI Reasoning | Why the AI gave this verdict |
| Student Tips | What to do next (cross-verify, check sources, etc.) |

---

## 🤖 How the AI Works

The app sends the article to **Claude (Anthropic API)** with a specialized prompt that checks for:
- Sensational or emotional language
- Missing or vague source attribution
- Logical fallacies and impossible statistics
- Clickbait patterns and conspiracy framing
- Absolute claims without evidence

---

## 🔒 Notes

- API key is in the frontend (for demo/student projects only)
- For production, move API calls to a backend server (Node.js / Flask)
- Uses `anthropic-dangerous-direct-browser-access: true` header for direct browser API access
- Works best with full article text (not just headlines)

---

## 👤 Project Info

- **Project**: Fake News Detector for Students
- **AI Model**: Claude Sonnet 4.6 (Anthropic)
- **Tech Stack**: Vanilla HTML + CSS + JavaScript
- **Purpose**: Media literacy & misinformation detection for students