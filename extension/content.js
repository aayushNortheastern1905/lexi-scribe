// Lexi Scribe — Content Script

const SUPPORTED_LANGS = {
  'Vietnamese':     { flag: '🇻🇳' },
  'Spanish':        { flag: '🇪🇸' },
  'Hindi':          { flag: '🇮🇳' },
  'Portuguese':     { flag: '🇧🇷' },
  'Haitian Creole': { flag: '🇭🇹' },
  'French':         { flag: '🇫🇷' },
  'Chinese':        { flag: '🇨🇳' },
  'Arabic':         { flag: '🇸🇦' },
};

let recognition = null;
let isRecording = false;
let fullTranscript = [];
let clinicalNotes = { symptoms: [], diagnosis: [], medications: [], instructions: [], followUp: '' };
let exchangeCount = 0;
let sessionStartTime = null;
let timerInterval = null;
// GROQ_API_KEY is loaded from config.js (gitignored)
let selectedLanguage = 'Spanish';

// ── Sidebar injection ────────────────────────────────────────────────────────

function injectSidebar() {
  if (document.getElementById('lexi-sidebar')) return;

  const container = document.createElement('div');
  container.id = 'lexi-sidebar-container';

  fetch(chrome.runtime.getURL('sidebar.html'))
    .then(r => r.text())
    .then(html => {
      container.innerHTML = html;
      document.body.appendChild(container);
      initSidebar();
    })
    .catch(err => console.error('Lexi Scribe: failed to load sidebar', err));
}

function initSidebar() {
  document.getElementById('lexi-close').addEventListener('click', () => {
    const c = document.getElementById('lexi-sidebar-container');
    if (c) c.remove();
  });

  document.getElementById('lexi-start').addEventListener('click', startSession);
  document.getElementById('lexi-end').addEventListener('click', endSession);

  chrome.storage.local.get(['language'], (data) => {
    if (data.language) document.getElementById('lexi-language').value = data.language;
  });
}

// ── Session lifecycle ────────────────────────────────────────────────────────

function startSession() {
  selectedLanguage = document.getElementById('lexi-language').value;
  chrome.storage.local.set({ language: selectedLanguage });

  document.getElementById('lexi-setup').style.display           = 'none';
  document.getElementById('lexi-status').style.display          = 'block';
  document.getElementById('lexi-transcript-section').style.display = 'flex';
  document.getElementById('lexi-notes-section').style.display   = 'block';
  document.getElementById('lexi-end-section').style.display     = 'block';

  sessionStartTime = Date.now();
  timerInterval    = setInterval(updateTimer, 1000);

  startSpeechRecognition();
}

function updateTimer() {
  const elapsed = Date.now() - sessionStartTime;
  const h = Math.floor(elapsed / 3600000).toString().padStart(2, '0');
  const m = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0');
  const s = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
  const el = document.getElementById('lexi-timer');
  if (el) el.textContent = `${h}:${m}:${s}`;
}

async function endSession() {
  isRecording = false;
  if (recognition) recognition.stop();
  clearInterval(timerInterval);

  const duration = Math.floor((Date.now() - sessionStartTime) / 1000);

  // Show a generating indicator in the sidebar
  const endBtn = document.getElementById('lexi-end');
  if (endBtn) { endBtn.textContent = '⏳ Generating summary…'; endBtn.disabled = true; }

  // Pre-generate summary before opening the dashboard
  let summary = null;
  if (fullTranscript.length > 0) {
    const rawText = fullTranscript.map(e => `${e.speaker.toUpperCase()}: ${e.text}`).join('\n');
    summary = await generateSummary(rawText, selectedLanguage);
  }

  chrome.storage.local.set({
    transcript: fullTranscript,
    summary,
    duration,
    language:   selectedLanguage,
    date:       new Date().toISOString(),
  }, () => {
    chrome.runtime.sendMessage({ type: 'OPEN_DASHBOARD' });
  });
}

async function generateSummary(transcript, language) {
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an expert medical scribe. Analyze this doctor-patient conversation and return a JSON object (no markdown, no extra text) with this exact structure:
{"visitSummary":"2-3 sentence summary","diagnosis":[],"prescriptions":[{"medication":"","dosage":"","frequency":"","instructions":"","warnings":""}],"patientInstructions":{"english":[],"${language}":[]},"followUp":"","analytics":{"doctorTalkTime":65,"patientTalkTime":35,"topicsCovered":{"symptoms":true,"diagnosis":true,"medications":true,"lifestyle":false,"followUp":true},"medicalTermsDetected":[]}}`,
          },
          { role: 'user', content: transcript },
        ],
        max_tokens: 1200,
      }),
    });
    const data = await res.json();
    const raw  = data.choices?.[0]?.message?.content?.trim() || '{}';
    const m    = raw.match(/\{[\s\S]*\}/);
    return m ? JSON.parse(m[0]) : null;
  } catch (e) {
    console.error('Lexi Scribe summary error:', e);
    return null;
  }
}

// ── Speech recognition ───────────────────────────────────────────────────────

function startSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Speech recognition is not supported in this browser. Use Chrome.');
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous     = true;
  recognition.interimResults = false;
  recognition.lang           = 'en-US';

  recognition.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        const text = event.results[i][0].transcript.trim();
        if (text) handleNewUtterance(text, 'doctor');
      }
    }
  };

  recognition.onerror = (e) => {
    if (e.error !== 'no-speech') console.error('Lexi Scribe speech error:', e.error);
  };

  recognition.onend = () => {
    if (isRecording) recognition.start();
  };

  isRecording = true;
  recognition.start();
}

// ── Utterance handling ───────────────────────────────────────────────────────

async function handleNewUtterance(text, speaker) {
  const entry = { speaker, text, timestamp: Date.now() - sessionStartTime };
  fullTranscript.push(entry);
  exchangeCount++;

  let translation = '';
  if (speaker === 'doctor') {
    translation = await translateText(text, selectedLanguage);
    addTranscriptMessage('doctor', text, translation, SUPPORTED_LANGS[selectedLanguage]?.flag || '🌐');
  } else {
    translation = await translateText(text, 'English');
    addTranscriptMessage('patient', text, translation, '🇺🇸');
  }

  entry.translation = translation;

  if (exchangeCount % 3 === 0) {
    const rawTranscript = fullTranscript.map(e => `${e.speaker.toUpperCase()}: ${e.text}`).join('\n');
    const notes = await extractClinicalNotes(rawTranscript);
    if (notes) {
      clinicalNotes = notes;
      updateNotesUI(notes);
    }
  }
}

// ── UI updates ───────────────────────────────────────────────────────────────

function addTranscriptMessage(speaker, text, translation, flag) {
  const container = document.getElementById('lexi-transcript');
  if (!container) return;

  const div = document.createElement('div');
  div.className = `lexi-msg ${speaker}`;
  div.innerHTML = `
    <div class="lexi-msg-label">${speaker === 'doctor' ? 'DR' : 'PT'}</div>
    <div class="lexi-msg-text">${escapeHtml(text)}</div>
    ${translation ? `<div class="lexi-msg-translation">${flag} ${escapeHtml(translation)}</div>` : ''}
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function updateNotesUI(notes) {
  const container = document.getElementById('lexi-notes');
  if (!container) return;

  const sections = [
    { key: 'symptoms',     label: 'Symptoms' },
    { key: 'diagnosis',    label: 'Diagnosis' },
    { key: 'medications',  label: 'Medications' },
    { key: 'instructions', label: 'Instructions' },
  ];

  let html = '';
  for (const { key, label } of sections) {
    if (notes[key]?.length) {
      html += `<div class="lexi-notes-section"><h4>${label}</h4>`;
      for (const item of notes[key]) {
        html += `<div class="lexi-notes-item">${escapeHtml(item)}</div>`;
      }
      html += '</div>';
    }
  }

  if (notes.followUp) {
    html += `<div class="lexi-notes-section"><h4>Follow Up</h4><div class="lexi-notes-item">${escapeHtml(notes.followUp)}</div></div>`;
  }

  container.innerHTML = html || '<div class="lexi-notes-empty">Extracting notes...</div>';
}

// ── Groq API calls ───────────────────────────────────────────────────────────

async function translateText(text, targetLanguage) {
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a medical interpreter. Translate the following text to ${targetLanguage}. Keep medical terms accurate. Simplify complex jargon for patients. Return ONLY the translation, nothing else.`,
          },
          { role: 'user', content: text },
        ],
        max_tokens: 200,
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || '';
  } catch (e) {
    console.error('Lexi Scribe translation error:', e);
    return '';
  }
}

async function extractClinicalNotes(transcript) {
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a medical scribe. Extract clinical information from this conversation transcript. Return ONLY a valid JSON object with these exact keys: {"symptoms": [], "diagnosis": [], "medications": [], "instructions": [], "followUp": ""}',
          },
          { role: 'user', content: transcript },
        ],
        max_tokens: 500,
      }),
    });
    const data = await res.json();
    const raw  = data.choices?.[0]?.message?.content?.trim() || '{}';
    const m    = raw.match(/\{[\s\S]*\}/);
    return m ? JSON.parse(m[0]) : null;
  } catch (e) {
    console.error('Lexi Scribe notes error:', e);
    return null;
  }
}

// ── Utilities ────────────────────────────────────────────────────────────────

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Boot ─────────────────────────────────────────────────────────────────────

injectSidebar();
