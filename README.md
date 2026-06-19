# ⬡ TruthLens — Fake News Detector for Students

An AI-powered web app that analyzes news articles for credibility, detects misinformation patterns, and helps students develop media literacy skills.

**Built by Raviranjan** · Student, GNIOT Institute of Professional Studies

---

## 📁 Project Structure

```
fake-news-detector/
├── index.html          → Main HTML structure & UI
├── style.css            → Dark investigative theme styling (fully responsive)
├── app.js                → Frontend logic — history, share, UI rendering
├── api/
│   └── analyze.js     → Vercel serverless function (Groq API proxy)
├── vercel.json          → Vercel routing config
├── .gitignore            → Keeps secrets out of GitHub
└── README.md          → This file
```

---

## 🤖 How It Works

The app sends article text to a **Vercel serverless function** (`/api/analyze`), which securely calls the **Groq API** (LLaMA 3.3 70B model) using a server-side environment variable. The API key never touches the browser or GitHub — it lives only in Vercel's encrypted environment settings.

```
Browser (app.js) → /api/analyze (serverless) → Groq API → JSON result → Browser
```

---

## 🚀 Deployment (Vercel)

### 1. Push code to GitHub
```bash
git add .
git commit -m "deploy"
git push origin main
```

### 2. Import to Vercel
- Go to [vercel.com](https://vercel.com) → **Add New Project**
- Import your GitHub repo
- Framework Preset: **Other**
- Build Command / Output Directory: leave **empty**

### 3. Add Environment Variable
In Vercel → **Settings → Environment Variables**:

| Name | Value |
|---|---|
| `GROQ_API_KEY` | your Groq API key (`gsk_...`) |

### 4. Deploy
Click **Deploy**. Your live site will be available at:
```
https://fakenewsnet.vercel.app
```

> Get a free Groq API key at [console.groq.com](https://console.groq.com)

---

## 💻 Local Development

Since the API key lives server-side, plain `index.html` won't be able to call `/api/analyze` directly. To test locally with full functionality, use the Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

Then set your local environment variable when prompted, or create a `.env` file:
```
GROQ_API_KEY=gsk_xxxxxxxxxxxx
```

---

## ✅ Features

| Feature | Details |
|---|---|
| Credibility Score | 0–100 animated gauge meter |
| Verdict | FAKE / CREDIBLE / MIXED / UNCERTAIN |
| Red Flag Detection | Emotional language, missing sources, fallacies |
| AI Summary | Neutral summary of what the article claims |
| AI Reasoning | Why the AI gave this verdict |
| Student Tips | Actionable next steps (cross-verify, check sources) |
| Analysis History | Saved locally in browser, click to revisit |
| Share Result | Copies a formatted summary to clipboard |
| Fully Responsive | Mobile hamburger menu, adapts to all screen sizes |

---

## 🔍 What the AI Checks For

- Emotional or sensational language
- Missing or vague source attribution ("experts say")
- Absolute claims without evidence
- Logical fallacies and impossible statistics
- Clickbait patterns and conspiracy framing

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (no frameworks)
- **Backend**: Vercel Serverless Functions (Node.js)
- **AI Model**: LLaMA 3.3 70B Versatile via Groq API
- **Hosting**: Vercel
- **Storage**: Browser localStorage (analysis history)

---

## 🔒 Security Notes

- API key is stored **only** in Vercel's environment variables — never in code
- `config.js` is gitignored and not required for production (Vercel deployment)
- All API calls are proxied through the serverless function, keeping the key server-side

---

## 👤 Author

**Raviranjan**
Student, GNIOT Institute of Professional Studies
AI/ML · Flutter · Full-Stack Development

Built as part of an AICTE AI Internship project (Edunet Foundation × IBM SkillsBuild) to address misinformation among students.

---

## ⚠️ Disclaimer

TruthLens is an educational tool designed to support media literacy. It is not a substitute for professional fact-checking. Always cross-verify important news with trusted, official sources.