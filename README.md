# Lexi Scribe

> Your AI medical scribe in every patient conversation.

A Chrome extension that sits inside Google Meet, Zoom, and Microsoft Teams and acts as an AI-powered medical scribe — translating in real time, extracting clinical notes automatically, and generating a full structured visit report at the end of every session.

Built as a proof-of-concept for [Lexi](https://withlexi.com) — the AI medical interpretation startup.

---

## Repo Structure

```
lexi-scribe/
├── extension/       # Chrome Extension (Vanilla JS)
└── web/             # Landing Page (Next.js 14)
```

## Extension Setup

1. Open Chrome → `chrome://extensions`
2. Enable **Developer Mode**
3. Click **Load Unpacked** → select the `extension/` folder
4. Open a Groq API key at [console.groq.com](https://console.groq.com)
5. Paste your key into `extension/content.js` and `extension/dashboard.js`

## Landing Page Setup

```bash
cd web
npm install
npm run dev
```

---

*Built by Aayush Sawant*
