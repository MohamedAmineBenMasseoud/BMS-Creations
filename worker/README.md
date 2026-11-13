# BMS Creations — Portfolio AI Chatbot Worker

A lightweight Cloudflare Worker that acts as a secure, rate-limited backend proxy between the portfolio front-end and the **Google Gemini API** (`gemini-3.1-flash-lite`, free tier).

---

## Architecture & Security Highlights

- **Model:** `gemini-3.1-flash-lite` (default). Configurable via `env.GEMINI_MODEL` in `wrangler.toml [vars]` without modifying code.
- **Header-Based Authentication:** The `GEMINI_API_KEY` secret is transmitted via the `x-goog-api-key` header instead of URL query parameters. The key and full request URLs are never logged.
- **Strict Origin Verification:** The `Origin` header is checked before any processing. If missing or not matching `https://mohamedaminebenmasseoud.github.io` (or `localhost` / `127.0.0.1` for local development), the worker immediately returns a `403 Forbidden` JSON response.
- **Strict Grounding:** The assistant only answers using verified facts from Mohamed Amine's CV (`assets/cv.pdf`) and verified portfolio projects. If unknown, it directs the visitor to `contact.html`.
- **Input Guardrails:** Rejects messages over 300 characters (`400 Bad Request`) and truncates conversation history to the last 6 turns.
- **Rate Limiting:** Sliding-window per-IP rate limiter (15 requests/minute).
- **Graceful Degradation:** If Gemini is unavailable, rate-limited (429), or errors, the worker returns status `503`, triggering the client-side front-end to silently fall back to its internal intent matching engine.

---

## Step-by-Step Deployment Guide

### 1. Obtain a Free Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **Get API key** and create a new key.
4. Copy the generated key.

---

### 2. Log In to Cloudflare
From your project's `worker/` folder (or workspace root):

```bash
cd worker
npx wrangler login
```

A browser window will open asking you to authenticate and authorize Wrangler with your free Cloudflare account.

---

### 3. Add Your Gemini Secret
Store your API key securely inside Cloudflare's encrypted secret store:

```bash
npx wrangler secret put GEMINI_API_KEY
```

When prompted:
```text
✔ Enter a secret value: ************************************
```
Paste your Gemini API key and hit `Enter`.

---

### 4. Deploy the Worker
Deploy the worker to Cloudflare's global edge network:

```bash
npx wrangler deploy
```

Upon successful deployment, Wrangler outputs your live Worker URL, for example:
```text
Uploaded bms-portfolio-chatbot (0.85 sec)
Published bms-portfolio-chatbot (1.20 sec)
  https://bms-portfolio-chatbot.<your-subdomain>.workers.dev
```

---

### 5. Connect the Worker to the Front-End
Open `js/chatbot.js` in your portfolio repository and paste your live worker URL into the `WORKER_URL` constant at the top:

```javascript
const WORKER_URL = "https://bms-portfolio-chatbot.<your-subdomain>.workers.dev";
```

Commit and push your changes to GitHub. Your live site on GitHub Pages is now powered by Google Gemini with automatic client-side fallback!

---

## Local Development & Testing

To test the worker locally on your machine before deploying:

1. Create a `.dev.vars` file inside the `worker/` directory (this file is ignored by Git):
   ```ini
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

2. Start the local Wrangler dev server:
   ```bash
   npx wrangler dev
   ```

3. Test with curl or PowerShell (remember to provide an allowed `Origin` header):
   ```bash
   curl -X POST http://localhost:8787 \
     -H "Origin: http://localhost:8787" \
     -H "Content-Type: application/json" \
     -d '{"message": "What did Amine build?", "lang": "en"}'
   ```
