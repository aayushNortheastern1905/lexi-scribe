// Lexi Scribe — Dashboard

/* global Chart, jspdf */
let jsPDF = null;
let summaryData = null;
let sessionData = null;


document.addEventListener('DOMContentLoaded', () => {
  // Resolve jsPDF after all scripts are guaranteed loaded
  if (window.jspdf?.jsPDF) {
    jsPDF = window.jspdf.jsPDF;
  } else {
    console.warn('Lexi Scribe: jsPDF not available — PDF export disabled');
  }
  setupTabs();
  setupDownloadButtons();
  init();
});

function setupTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`).style.display = 'block';
    });
  });
}

function setupDownloadButtons() {
  document.getElementById('download-doctor').addEventListener('click', downloadDoctorPDF);
  document.getElementById('download-patient').addEventListener('click', downloadPatientPDF);
  document.getElementById('download-transcript').addEventListener('click', downloadTranscriptPDF);
}


async function init() {
  chrome.storage.local.get(['transcript', 'summary', 'duration', 'language', 'date'], async (data) => {
    sessionData = data;

    const date = data.date
      ? new Date(data.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const duration = data.duration ? `Duration: ${Math.floor(data.duration / 60)}min` : 'Duration: —';

    document.getElementById('visit-date').textContent     = date;
    document.getElementById('visit-duration').textContent = duration;

    const flag = getFlag(data.language);
    ['patient-flag', 'patient-flag2', 'patient-flag3', 'patient-flag4'].forEach(id => {
      document.getElementById(id).textContent = flag;
    });

    // Use pre-generated summary from content.js if available
    if (data.summary) {
      summaryData = data.summary;
    } else if (data.transcript?.length > 0) {
      const rawText = data.transcript.map(e => `${e.speaker.toUpperCase()}: ${e.text}`).join('\n');
      summaryData = await generateFullSummary(rawText, data.language || 'Spanish');
    } else {
      summaryData = getDemoData(data.language || 'Vietnamese');
    }

    renderDashboard(summaryData, data);

    document.getElementById('loading').style.display = 'none';
    document.getElementById('main').style.display    = 'block';
  });
}


async function generateFullSummary(transcript, language) {
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
            content: `You are an expert medical scribe. Analyze this doctor-patient conversation and return a detailed JSON with this exact structure (no markdown, no extra text):
{
  "visitSummary": "2-3 sentence summary in English",
  "diagnosis": ["list of diagnoses"],
  "prescriptions": [{"medication": "", "dosage": "", "frequency": "", "instructions": "", "warnings": ""}],
  "patientInstructions": {
    "english": ["list of instructions"],
    "${language}": ["same instructions in ${language}, simplified, no jargon"]
  },
  "followUp": "follow up details",
  "analytics": {
    "doctorTalkTime": 65,
    "patientTalkTime": 35,
    "topicsCovered": {"symptoms": true, "diagnosis": true, "medications": true, "lifestyle": false, "followUp": true},
    "medicalTermsDetected": ["term1", "term2"]
  }
}`,
          },
          { role: 'user', content: `Full transcript:\n${transcript}` },
        ],
        max_tokens: 2000,
      }),
    });
    const data = await res.json();
    const raw  = data.choices?.[0]?.message?.content?.trim() || '{}';
    const m    = raw.match(/\{[\s\S]*\}/);
    return m ? JSON.parse(m[0]) : getDemoData(language);
  } catch (e) {
    console.error('Dashboard summary error:', e);
    return getDemoData(language);
  }
}


function getDemoData(language) {
  const langInstructions = {
    Vietnamese: [
      'Uống thuốc Lisinopril 10mg mỗi buổi sáng',
      'Giảm ăn muối và thức ăn nhiều dầu mỡ',
      'Đo huyết áp mỗi ngày vào buổi sáng',
      'Tái khám sau 2 tuần',
      'Gọi ngay nếu chóng mặt nặng hơn hoặc đau ngực',
    ],
    Spanish: [
      'Tomar Lisinopril 10mg cada mañana',
      'Reducir el consumo de sal y alimentos grasos',
      'Medir la presión arterial cada mañana',
      'Regresar en 2 semanas',
      'Llamar de inmediato si el mareo empeora o hay dolor en el pecho',
    ],
    Hindi: [
      'हर सुबह Lisinopril 10mg लें',
      'नमक और तैलीय खाना कम करें',
      'हर सुबह ब्लड प्रेशर मापें',
      '2 हफ्ते बाद वापस आएं',
      'अगर चक्कर बढ़े या सीने में दर्द हो तो तुरंत कॉल करें',
    ],
  };

  return {
    visitSummary: 'Patient presented with persistent headache and dizziness over the past week. Blood pressure was found to be elevated at 145/92 mmHg. Diagnosed with Stage 1 Hypertension and prescribed Lisinopril 10mg once daily.',
    diagnosis: ['Hypertension Stage 1', 'Headache — likely hypertension-related'],
    prescriptions: [{
      medication:   'Lisinopril',
      dosage:       '10mg',
      frequency:    'Once daily in the morning',
      instructions: 'Take with or without food. Refill in 30 days.',
      warnings:     'Avoid NSAIDs and potassium supplements. Monitor for dry cough.',
    }],
    patientInstructions: {
      english: [
        'Take Lisinopril 10mg every morning',
        'Reduce salt and fatty food intake',
        'Monitor blood pressure daily',
        'Return in 2 weeks',
        'Call immediately if dizziness worsens or you have chest pain',
      ],
      [language]: langInstructions[language] || langInstructions.Spanish,
    },
    followUp: 'Return in 2 weeks for blood pressure monitoring. Dosage adjustment may be considered if blood pressure remains elevated.',
    analytics: {
      doctorTalkTime: 65,
      patientTalkTime: 35,
      topicsCovered: { symptoms: true, diagnosis: true, medications: true, lifestyle: true, followUp: true },
      medicalTermsDetected: ['Hypertension', 'Lisinopril', 'Blood Pressure', 'Dizziness', 'Headache', 'mmHg', 'Stage 1'],
    },
  };
}


function renderDashboard(data, session) {
  // Doctor tab
  document.getElementById('visit-summary').textContent = data.visitSummary;

  document.getElementById('diagnosis-list').innerHTML =
    data.diagnosis.map(d => `<li>${escapeHtml(d)}</li>`).join('');

  document.getElementById('prescriptions').innerHTML =
    data.prescriptions.map(p => `
      <div class="prescription-card">
        <div class="prescription-name">💊 ${escapeHtml(p.medication)} ${escapeHtml(p.dosage)}</div>
        <div class="prescription-detail">⏰ ${escapeHtml(p.frequency)}</div>
        <div class="prescription-detail">📋 ${escapeHtml(p.instructions)}</div>
        ${p.warnings ? `<div class="prescription-warning">⚠️ ${escapeHtml(p.warnings)}</div>` : ''}
      </div>
    `).join('');

  document.getElementById('instructions-en').innerHTML =
    (data.patientInstructions?.english || []).map(i => `<li>${escapeHtml(i)}</li>`).join('');

  document.getElementById('follow-up').textContent = data.followUp;

  // Patient tab
  document.getElementById('patient-summary').textContent = data.visitSummary;

  document.getElementById('patient-meds').innerHTML =
    data.prescriptions.map(p => `
      <div class="prescription-card">
        <div class="prescription-name">💊 ${escapeHtml(p.medication)} ${escapeHtml(p.dosage)}</div>
        <div class="prescription-detail">${escapeHtml(p.frequency)}</div>
      </div>
    `).join('');

  const language      = session.language || 'English';
  const langInstrKey  = data.patientInstructions?.[language] ? language : 'english';
  const langInstrs    = data.patientInstructions?.[langInstrKey] || [];
  document.getElementById('instructions-lang').innerHTML =
    langInstrs.map(i => `<li>${escapeHtml(i)}</li>`).join('');

  document.getElementById('patient-followup').textContent = data.followUp;

  // Analytics
  if (data.analytics) {
    renderCharts(data.analytics);
    renderMedicalTerms(data.analytics.medicalTermsDetected || []);
  }

  // Transcript
  if (session.transcript?.length > 0) {
    renderTranscript(session.transcript, session.language);
  } else {
    document.getElementById('full-transcript').innerHTML =
      '<p style="color:#9CA3AF;font-size:14px">No transcript recorded for this session.</p>';
  }
}

function renderCharts(analytics) {
  // Doughnut — talk time
  new Chart(document.getElementById('chart-talktime').getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ['Doctor', 'Patient'],
      datasets: [{
        data: [analytics.doctorTalkTime, analytics.patientTalkTime],
        backgroundColor: ['#1D9E75', '#BBF7D0'],
        borderWidth: 0,
      }],
    },
    options: {
      plugins: { legend: { position: 'bottom', labels: { font: { size: 12 } } } },
      cutout: '65%',
    },
  });

  // Horizontal bar — topics
  const topics = analytics.topicsCovered || {};
  const labels = ['Symptoms', 'Diagnosis', 'Medications', 'Lifestyle', 'Follow Up'];
  const keys   = ['symptoms', 'diagnosis', 'medications', 'lifestyle', 'followUp'];
  const values = keys.map(k => topics[k] ? 100 : 0);

  new Chart(document.getElementById('chart-topics').getContext('2d'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: values.map(v => v ? '#1D9E75' : '#E5E7EB'),
        borderRadius: 4,
      }],
    },
    options: {
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { max: 100, grid: { display: false }, ticks: { display: false } },
        y: { grid: { display: false }, ticks: { font: { size: 12 } } },
      },
    },
  });
}

function renderMedicalTerms(terms) {
  document.getElementById('medical-terms').innerHTML =
    terms.length
      ? terms.map(t => `<span class="term-pill">${escapeHtml(t)}</span>`).join('')
      : '<span style="color:#9CA3AF;font-size:13px">No medical terms detected.</span>';
}

function renderTranscript(transcript, language) {
  const flag = getFlag(language);
  document.getElementById('full-transcript').innerHTML = transcript.map(entry => {
    const mins = Math.floor(entry.timestamp / 60000).toString().padStart(2, '0');
    const secs = Math.floor((entry.timestamp % 60000) / 1000).toString().padStart(2, '0');
    return `
      <div class="transcript-entry">
        <div class="transcript-time">[${mins}:${secs}]</div>
        <div class="transcript-line">
          <span class="transcript-speaker">${entry.speaker === 'doctor' ? 'DR' : 'PT'}:</span>
          <span class="transcript-text">${escapeHtml(entry.text)}</span>
        </div>
        ${entry.translation
          ? `<div class="transcript-translation">${entry.speaker === 'doctor' ? flag : '🇺🇸'} ${escapeHtml(entry.translation)}</div>`
          : ''}
      </div>
    `;
  }).join('');
}


function downloadDoctorPDF() {
  if (!summaryData || !jsPDF) return;
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(22);
  doc.setTextColor(29, 158, 117);
  doc.text('Lexi Scribe — Visit Summary', 20, y); y += 10;

  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  const meta = `${document.getElementById('visit-date').textContent}  ·  ${document.getElementById('visit-duration').textContent}`;
  doc.text(meta, 20, y); y += 14;

  addSection(doc, 'Visit Summary', [summaryData.visitSummary], y);
  y += Math.ceil(summaryData.visitSummary.length / 90) * 6 + 22;

  addSection(doc, 'Diagnosis', summaryData.diagnosis, y);
  y += summaryData.diagnosis.length * 7 + 18;

  doc.setFontSize(14);
  doc.setTextColor(17, 24, 39);
  doc.text('Prescriptions', 20, y); y += 8;
  doc.setFontSize(11);
  summaryData.prescriptions.forEach(p => {
    doc.text(`• ${p.medication} ${p.dosage} — ${p.frequency}`, 24, y); y += 7;
    if (p.instructions) { doc.text(`  ${p.instructions}`, 24, y); y += 7; }
    if (p.warnings) {
      doc.setTextColor(185, 28, 28);
      doc.text(`  ⚠ ${p.warnings}`, 24, y); y += 7;
      doc.setTextColor(17, 24, 39);
    }
  });
  y += 6;

  addSection(doc, 'Follow Up', [summaryData.followUp], y);

  doc.save('lexi-scribe-doctor-report.pdf');
}

function downloadPatientPDF() {
  if (!summaryData || !sessionData || !jsPDF) return;
  const language = sessionData.language || 'English';
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(22);
  doc.setTextColor(29, 158, 117);
  doc.text('Your Visit Summary', 20, y); y += 12;

  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text(document.getElementById('visit-date').textContent, 20, y); y += 14;

  const langKey = summaryData.patientInstructions?.[language] ? language : 'english';
  const instrs  = summaryData.patientInstructions?.[langKey] || [];

  doc.setFontSize(14);
  doc.setTextColor(17, 24, 39);
  doc.text(`Instructions (${language})`, 20, y); y += 10;
  doc.setFontSize(12);
  instrs.forEach(i => {
    const lines = doc.splitTextToSize(`• ${i}`, 170);
    if (y + lines.length * 7 > 280) { doc.addPage(); y = 20; }
    doc.text(lines, 20, y); y += lines.length * 7;
  });
  y += 8;

  doc.setFontSize(14);
  doc.text('Your Medications', 20, y); y += 8;
  doc.setFontSize(12);
  summaryData.prescriptions.forEach(p => {
    doc.text(`• ${p.medication} ${p.dosage}`, 24, y); y += 7;
    doc.text(`  ${p.frequency}`, 24, y); y += 7;
  });
  y += 8;

  doc.setFontSize(14);
  doc.text('Next Appointment', 20, y); y += 8;
  doc.setFontSize(12);
  const fuLines = doc.splitTextToSize(summaryData.followUp, 170);
  doc.text(fuLines, 20, y);

  doc.save('lexi-scribe-patient-instructions.pdf');
}

function downloadTranscriptPDF() {
  if (!sessionData?.transcript?.length || !jsPDF) return;
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.setTextColor(29, 158, 117);
  doc.text('Full Transcript — Lexi Scribe', 20, y); y += 10;

  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text(document.getElementById('visit-date').textContent, 20, y); y += 12;

  doc.setFontSize(10);
  doc.setTextColor(17, 24, 39);
  const flag = getFlag(sessionData.language);

  sessionData.transcript.forEach(entry => {
    const mins = Math.floor(entry.timestamp / 60000).toString().padStart(2, '0');
    const secs = Math.floor((entry.timestamp % 60000) / 1000).toString().padStart(2, '0');
    const line = `[${mins}:${secs}] ${entry.speaker === 'doctor' ? 'DR' : 'PT'}: ${entry.text}`;
    const lines = doc.splitTextToSize(line, 170);
    if (y + lines.length * 6 + 10 > 280) { doc.addPage(); y = 20; }
    doc.text(lines, 20, y); y += lines.length * 6;
    if (entry.translation) {
      doc.setTextColor(107, 114, 128);
      const tLine  = `${entry.speaker === 'doctor' ? flag : '🇺🇸'} ${entry.translation}`;
      const tLines = doc.splitTextToSize(tLine, 165);
      doc.text(tLines, 26, y); y += tLines.length * 6;
      doc.setTextColor(17, 24, 39);
    }
    y += 3;
  });

  doc.save('lexi-scribe-transcript.pdf');
}


function addSection(doc, title, items, y) {
  doc.setFontSize(14);
  doc.setTextColor(17, 24, 39);
  doc.text(title, 20, y); y += 8;
  doc.setFontSize(11);
  items.forEach(item => {
    const lines = doc.splitTextToSize(`• ${item}`, 170);
    doc.text(lines, 24, y);
    y += lines.length * 6 + 2;
  });
}

function getFlag(language) {
  const map = {
    Vietnamese:       '🇻🇳',
    Spanish:          '🇪🇸',
    Hindi:            '🇮🇳',
    Portuguese:       '🇧🇷',
    'Haitian Creole': '🇭🇹',
    French:           '🇫🇷',
    Chinese:          '🇨🇳',
    Arabic:           '🇸🇦',
  };
  return map[language] || '🌐';
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
