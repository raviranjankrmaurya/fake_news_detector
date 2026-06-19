// =============================================
//   TruthLens — Fake News Detector
//   app.js — Vercel Serverless API + UI Logic
//   Built by Raviranjan
// =============================================

const API_URL = "/api/analyze"; // Vercel serverless function

// ── DOM References ──────────────────────────
const articleInput   = document.getElementById("articleInput");
const analyzeBtn     = document.getElementById("analyzeBtn");
const clearBtn       = document.getElementById("clearBtn");
const btnText        = document.getElementById("btnText");
const btnLoader      = document.getElementById("btnLoader");

const emptyState     = document.getElementById("emptyState");
const resultsContent = document.getElementById("resultsContent");
const errorState     = document.getElementById("errorState");
const errorMsg       = document.getElementById("errorMsg");

const verdictBadge   = document.getElementById("verdictBadge");
const meterFill      = document.getElementById("meterFill");
const scoreText      = document.getElementById("scoreText");
const flagsList      = document.getElementById("flagsList");
const summaryText    = document.getElementById("summaryText");
const reasoningText  = document.getElementById("reasoningText");
const tipsList       = document.getElementById("tipsList");

const resetBtn       = document.getElementById("resetBtn");
const errorResetBtn  = document.getElementById("errorResetBtn");
// ───────────────────────────────────────────


// ── Event Listeners ─────────────────────────
analyzeBtn.addEventListener("click", handleAnalyze);
clearBtn.addEventListener("click", clearInput);
resetBtn.addEventListener("click", resetToInput);
errorResetBtn.addEventListener("click", resetToInput);

articleInput.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "Enter") handleAnalyze();
});
// ───────────────────────────────────────────


// ── Main Handler ────────────────────────────
async function handleAnalyze() {
  const text = articleInput.value.trim();

  if (text.length < 30) {
    showError("Please paste a longer article or text (at least 30 characters) for accurate analysis.");
    showSection("error");
    return;
  }

  setLoadingState(true);
  showSection("loading");

  try {
    const result = await analyzeArticle(text);
    renderResults(result);
    saveToHistory(text, result);
    showSection("results");
  } catch (err) {
    console.error("Analysis error:", err);
    showError(err.message || "Analysis failed. Please check your internet connection.");
    showSection("error");
  } finally {
    setLoadingState(false);
  }
}


// ── API Call (Vercel Serverless → Groq) ─────
async function analyzeArticle(articleText) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ articleText })
  });

  const parsed = await response.json().catch(() => ({}));

  if (!response.ok || parsed.error) {
    throw new Error(parsed.error || `API Error: ${response.status}`);
  }

  const required = ["verdict", "credibility_score", "red_flags", "summary", "reasoning", "tips"];
  for (const field of required) {
    if (!(field in parsed)) {
      throw new Error(`Missing field "${field}" in response. Please try again.`);
    }
  }

  return parsed;
}


// ── Render Results ───────────────────────────
function renderResults(data) {
  const { verdict, credibility_score, red_flags, summary, reasoning, tips } = data;
  const score = Math.max(0, Math.min(100, Number(credibility_score)));

  verdictBadge.textContent = formatVerdict(verdict);
  verdictBadge.className = `verdict-badge ${verdict}`;

  setTimeout(() => {
    meterFill.style.width = `${score}%`;
    meterFill.style.background = getMeterColor(score);
    scoreText.textContent = `${score}%`;
    scoreText.style.color = getMeterColor(score);
  }, 200);

  flagsList.innerHTML = "";
  if (red_flags && red_flags.length > 0) {
    red_flags.forEach(flag => {
      const li = document.createElement("li");
      li.textContent = flag;
      flagsList.appendChild(li);
    });
    document.getElementById("redFlagsBlock").style.display = "block";
  } else {
    document.getElementById("redFlagsBlock").style.display = "none";
  }

  summaryText.textContent   = summary   || "No summary available.";
  reasoningText.textContent = reasoning || "No reasoning provided.";

  tipsList.innerHTML = "";
  if (tips && tips.length > 0) {
    tips.forEach(tip => {
      const li = document.createElement("li");
      li.textContent = tip;
      tipsList.appendChild(li);
    });
  }
}


// ── Helpers ─────────────────────────────────
function formatVerdict(verdict) {
  const map = {
    "FAKE":      "⚠ Likely Fake / Misinformation",
    "CREDIBLE":  "✔ Credible Source",
    "MIXED":     "~ Mixed Credibility",
    "UNCERTAIN": "? Uncertain — Needs Verification"
  };
  return map[verdict] || `? ${verdict}`;
}

function getMeterColor(score) {
  if (score < 35) return "#FF4D4D";
  if (score < 55) return "#FACC15";
  if (score < 75) return "#F5A623";
  return "#22C55E";
}

function setLoadingState(loading) {
  analyzeBtn.disabled = loading;
  btnText.classList.toggle("hidden", loading);
  btnLoader.classList.toggle("hidden", !loading);
}

function showSection(section) {
  emptyState.classList.add("hidden");
  resultsContent.classList.add("hidden");
  errorState.classList.add("hidden");

  if (section === "results") {
    resultsContent.classList.remove("hidden");
  } else if (section === "error") {
    errorState.classList.remove("hidden");
  } else {
    emptyState.classList.remove("hidden");
  }
}

function showError(msg) {
  errorMsg.textContent = msg;
}

function clearInput() {
  articleInput.value = "";
  articleInput.focus();
}

function resetToInput() {
  showSection("empty");
  meterFill.style.width = "0%";
  scoreText.textContent = "0%";
}
// ───────────────────────────────────────────


// ══════════════════════════════════════════
//   HISTORY — localStorage mein save karo
// ══════════════════════════════════════════
const HISTORY_KEY = "truthlens_history";

function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
  catch { return []; }
}

function saveToHistory(articleText, result) {
  const history = getHistory();
  const item = {
    id: Date.now(),
    snippet: articleText.slice(0, 120).trim(),
    verdict: result.verdict,
    credibility_score: result.credibility_score,
    summary: result.summary,
    reasoning: result.reasoning,
    red_flags: result.red_flags,
    tips: result.tips,
    time: new Date().toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })
  };
  history.unshift(item);
  if (history.length > 20) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const history = getHistory();
  const list    = document.getElementById("historyList");
  const empty   = document.getElementById("historyEmpty");

  Array.from(list.querySelectorAll(".history-item")).forEach(el => el.remove());

  if (history.length === 0) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  history.forEach(item => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.innerHTML = `
      <span class="history-verdict ${item.verdict}">${item.verdict}</span>
      <div class="history-text">
        <div class="history-snippet">${item.snippet}${item.snippet.length >= 120 ? "…" : ""}</div>
        <div class="history-meta">🕐 ${item.time}</div>
      </div>
      <span class="history-score" style="color:${getMeterColor(item.credibility_score)}">${item.credibility_score}%</span>
      <button class="history-del" data-id="${item.id}" title="Delete">✕</button>
    `;
    div.addEventListener("click", (e) => {
      if (e.target.classList.contains("history-del")) return;
      document.getElementById("articleInput").value = item.snippet;
      renderResults(item);
      showSection("results");
      document.getElementById("detector").scrollIntoView({ behavior: "smooth" });
    });
    div.querySelector(".history-del").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteHistoryItem(item.id);
    });
    list.appendChild(div);
  });
}

function deleteHistoryItem(id) {
  const history = getHistory().filter(i => i.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderHistory();
}

document.getElementById("clearHistoryBtn").addEventListener("click", () => {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
});

renderHistory();


// ══════════════════════════════════════════
//   SHARE — Clipboard copy
// ══════════════════════════════════════════
document.getElementById("shareBtn").addEventListener("click", shareResult);

function shareResult() {
  const verdict   = document.getElementById("verdictBadge").textContent;
  const score     = document.getElementById("scoreText").textContent;
  const summary   = document.getElementById("summaryText").textContent;
  const reasoning = document.getElementById("reasoningText").textContent;

  const text = `🔍 TruthLens Analysis\n\nVerdict: ${verdict}\nCredibility Score: ${score}\n\nSummary:\n${summary}\n\nReasoning:\n${reasoning}\n\n— Analyzed by TruthLens (Built by Raviranjan)`;

  navigator.clipboard.writeText(text).then(() => {
    showToast("✔ Result copied to clipboard!");
  }).catch(() => {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showToast("✔ Result copied!");
  });
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 300);
  }, 2500);
}


// ══════════════════════════════════════════
//   HAMBURGER MENU (mobile nav)
// ══════════════════════════════════════════
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("mobileNav").classList.toggle("hidden");
});

function closeMobileNav() {
  document.getElementById("mobileNav").classList.add("hidden");
}