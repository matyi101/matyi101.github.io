(() => {
  'use strict';

  const ALL = window.PMI_ACP_QUESTIONS || [];
  const SET_SIZE = 30;
  const TOTAL_SETS = 12;
  const APP_PREFIX = 'pmiacp-practice-v2';

  const esc = (value) => String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

  const nowIso = () => new Date().toISOString();
  const profileListKey = () => `${APP_PREFIX}:profiles`;
  const currentProfileKey = () => `${APP_PREFIX}:current-profile`;
  const storageKey = (profileId, setNo) => `${APP_PREFIX}:${profileId}:set:${setNo}:answers`;
  const resultKey = (profileId, setNo) => `${APP_PREFIX}:${profileId}:set:${setNo}:result`;
  const historyKey = (profileId) => `${APP_PREFIX}:${profileId}:history`;

  function safeParse(raw, fallback) {
    try { return JSON.parse(raw); } catch { return fallback; }
  }

  function getProfiles() {
    const value = safeParse(localStorage.getItem(profileListKey()) || '[]', []);
    return Array.isArray(value) ? value : [];
  }

  function saveProfiles(profiles) {
    localStorage.setItem(profileListKey(), JSON.stringify(profiles));
  }

  function normalizeName(name) {
    return String(name || '').trim().replace(/\s+/g, ' ').slice(0, 80);
  }

  function hashName(name) {
    let hash = 5381;
    for (let i = 0; i < name.length; i++) hash = ((hash << 5) + hash) ^ name.charCodeAt(i);
    return (hash >>> 0).toString(36);
  }

  function findOrCreateProfile(name) {
    const clean = normalizeName(name);
    if (!clean) return null;
    const profiles = getProfiles();
    const existing = profiles.find(p => String(p.name).toLowerCase() === clean.toLowerCase());
    if (existing) {
      localStorage.setItem(currentProfileKey(), existing.id);
      return existing;
    }
    const profile = {
      id: `u-${hashName(clean.toLowerCase())}`,
      name: clean,
      createdAt: nowIso()
    };
    profiles.push(profile);
    saveProfiles(profiles);
    localStorage.setItem(currentProfileKey(), profile.id);
    return profile;
  }

  function setCurrentProfile(profileId) {
    const exists = getProfiles().some(p => p.id === profileId);
    if (exists) localStorage.setItem(currentProfileKey(), profileId);
  }

  function getCurrentProfile() {
    const id = localStorage.getItem(currentProfileKey());
    return getProfiles().find(p => p.id === id) || null;
  }

  function loadAnswers(profileId, setNo) {
    return safeParse(localStorage.getItem(storageKey(profileId, setNo)) || '{}', {});
  }

  function saveAnswers(profileId, setNo, answers) {
    localStorage.setItem(storageKey(profileId, setNo), JSON.stringify(answers));
  }

  function loadResult(profileId, setNo) {
    return safeParse(localStorage.getItem(resultKey(profileId, setNo)) || 'null', null);
  }

  function saveResult(profileId, setNo, result) {
    localStorage.setItem(resultKey(profileId, setNo), JSON.stringify(result));
  }

  function loadHistory(profileId) {
    const data = safeParse(localStorage.getItem(historyKey(profileId)) || '[]', []);
    return Array.isArray(data) ? data : [];
  }

  function addHistory(profileId, attempt) {
    const history = loadHistory(profileId);
    history.push(attempt);
    localStorage.setItem(historyKey(profileId), JSON.stringify(history));
  }

  function clearCurrentTest(profileId, setNo) {
    localStorage.removeItem(storageKey(profileId, setNo));
    localStorage.removeItem(resultKey(profileId, setNo));
  }

  function profileHasStoredData(profileId) {
    if (loadHistory(profileId).length) return true;
    for (let s = 1; s <= TOTAL_SETS; s++) {
      if (localStorage.getItem(storageKey(profileId, s)) || localStorage.getItem(resultKey(profileId, s))) return true;
    }
    return false;
  }

  function resetProfileRecords(profileId) {
    for (let s = 1; s <= TOTAL_SETS; s++) {
      localStorage.removeItem(storageKey(profileId, s));
      localStorage.removeItem(resultKey(profileId, s));
    }
    localStorage.removeItem(historyKey(profileId));
  }

  function deleteProfile(profileId) {
    resetProfileRecords(profileId);
    const remaining = getProfiles().filter(p => p.id !== profileId);
    saveProfiles(remaining);
    const currentId = localStorage.getItem(currentProfileKey());
    if (currentId === profileId) {
      if (remaining.length) localStorage.setItem(currentProfileKey(), remaining[0].id);
      else localStorage.removeItem(currentProfileKey());
    }
  }

  function formatDate(iso) {
    if (!iso) return '—';
    try {
      return new Intl.DateTimeFormat(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }).format(new Date(iso));
    } catch { return iso; }
  }

  function getSetNo() {
    const n = Number(new URLSearchParams(location.search).get('set'));
    return Number.isInteger(n) && n >= 1 && n <= TOTAL_SETS ? n : 1;
  }

  function scoreSet(questions, answers) {
    let correct = 0, incorrect = 0, unanswered = 0, unscored = 0;
    for (const q of questions) {
      if (!q.answer) { unscored++; continue; }
      const selected = answers[q.number];
      if (!selected) unanswered++;
      else if (selected === q.answer) correct++;
      else incorrect++;
    }
    const scorable = questions.length - unscored;
    const percentage = scorable ? Math.round((correct / scorable) * 1000) / 10 : 0;
    return { correct, incorrect, unanswered, unscored, scorable, percentage };
  }

  function latestAttemptForSet(history, setNo) {
    const attempts = history.filter(a => a.setNo === setNo);
    return attempts.length ? attempts[attempts.length - 1] : null;
  }

  function bestAttemptForSet(history, setNo) {
    const attempts = history.filter(a => a.setNo === setNo);
    if (!attempts.length) return null;
    return attempts.reduce((best, cur) => cur.percentage > best.percentage ? cur : best, attempts[0]);
  }

  function downloadText(filename, text, mime = 'text/plain;charset=utf-8') {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function exportHistoryCsv(profile) {
    const history = loadHistory(profile.id);
    const header = ['User','Practice Set','Attempt','Date','Correct','Incorrect','Unanswered','Unscored','Scorable','Percentage'];
    const rows = [header];
    const perSetCounter = {};
    history.forEach(a => {
      perSetCounter[a.setNo] = (perSetCounter[a.setNo] || 0) + 1;
      rows.push([
        profile.name,
        a.setNo,
        perSetCounter[a.setNo],
        a.submittedAt || '',
        a.correct,
        a.incorrect,
        a.unanswered,
        a.unscored,
        a.scorable,
        a.percentage
      ]);
    });
    const csv = rows.map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
    const safe = profile.name.replace(/[^a-z0-9_-]+/gi, '_').replace(/^_+|_+$/g, '') || 'user';
    downloadText(`PMI-ACP_${safe}_practice_history.csv`, csv, 'text/csv;charset=utf-8');
  }

  function renderProfileControls() {
    const panel = document.querySelector('#profilePanel');
    if (!panel) return;

    const profiles = getProfiles();
    const current = getCurrentProfile();
    const nameInput = document.querySelector('#userNameInput');
    const useBtn = document.querySelector('#useUserBtn');
    const select = document.querySelector('#profileSelect');
    const currentUserEl = document.querySelector('#currentUser');
    const message = document.querySelector('#profileMessage');
    const exportBtn = document.querySelector('#exportRecordsBtn');
    const resetRecordsBtn = document.querySelector('#resetRecordsBtn');
    const deleteProfileBtn = document.querySelector('#deleteProfileBtn');

    select.innerHTML = '<option value="">Select an existing user…</option>' + profiles
      .map(p => `<option value="${esc(p.id)}" ${current && p.id === current.id ? 'selected' : ''}>${esc(p.name)}</option>`)
      .join('');

    currentUserEl.innerHTML = current
      ? `<strong>Current user:</strong> ${esc(current.name)} <span class="pill done">Records enabled</span>`
      : '<strong>No user selected.</strong> Enter your name before starting a test.';

    exportBtn.disabled = !current || loadHistory(current.id).length === 0;
    if (resetRecordsBtn) resetRecordsBtn.disabled = !current || !profileHasStoredData(current.id);
    if (deleteProfileBtn) deleteProfileBtn.disabled = !current;

    useBtn.addEventListener('click', () => {
      const profile = findOrCreateProfile(nameInput.value);
      if (!profile) {
        message.textContent = 'Please enter your name.';
        nameInput.focus();
        return;
      }
      message.textContent = `Using profile: ${profile.name}`;
      location.reload();
    });

    nameInput.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') useBtn.click();
    });

    select.addEventListener('change', () => {
      if (!select.value) return;
      setCurrentProfile(select.value);
      location.reload();
    });

    exportBtn.addEventListener('click', () => {
      const profile = getCurrentProfile();
      if (profile) exportHistoryCsv(profile);
    });

    resetRecordsBtn?.addEventListener('click', () => {
      const profile = getCurrentProfile();
      if (!profile) return;
      const ok = confirm(`Reset all stored practice records for ${profile.name}? This clears test history, current results, and in-progress answers for all 12 sets. The user profile itself will remain.`);
      if (!ok) return;
      resetProfileRecords(profile.id);
      location.reload();
    });

    deleteProfileBtn?.addEventListener('click', () => {
      const profile = getCurrentProfile();
      if (!profile) return;
      const ok = confirm(`Delete the user profile ${profile.name}? This permanently removes this name and all of its locally stored test records from this browser.`);
      if (!ok) return;
      deleteProfile(profile.id);
      location.reload();
    });
  }

  function renderRecordSummary(profile) {
    const summary = document.querySelector('#recordSummary');
    const historyBody = document.querySelector('#historyBody');
    const historySection = document.querySelector('#historySection');
    if (!summary || !historyBody || !historySection) return;

    if (!profile) {
      summary.innerHTML = '<div class="empty-state">Select or create a user profile to store individual practice records.</div>';
      historySection.hidden = true;
      return;
    }

    const history = loadHistory(profile.id);
    const completedSets = new Set(history.map(a => a.setNo)).size;
    const best = history.length ? Math.max(...history.map(a => Number(a.percentage) || 0)) : null;
    const latestOverall = history.length ? history[history.length - 1] : null;
    const latestBySet = [];
    for (let s = 1; s <= TOTAL_SETS; s++) {
      const latest = latestAttemptForSet(history, s);
      if (latest) latestBySet.push(latest.percentage);
    }
    const avgLatest = latestBySet.length
      ? Math.round((latestBySet.reduce((a, b) => a + Number(b), 0) / latestBySet.length) * 10) / 10
      : null;

    summary.innerHTML = `
      <div class="record-card"><span>Attempts</span><strong>${history.length}</strong></div>
      <div class="record-card"><span>Sets attempted</span><strong>${completedSets}/12</strong></div>
      <div class="record-card"><span>Best Score</span><strong>${best === null ? '—' : `${best}%`}</strong></div>
      <div class="record-card"><span>Latest Score</span><strong>${latestOverall === null ? '—' : `${latestOverall.percentage}%`}</strong>${latestOverall ? `<small>Set ${latestOverall.setNo} · ${formatDate(latestOverall.submittedAt)}</small>` : ''}</div>
      <div class="record-card"><span>Average latest score</span><strong>${avgLatest === null ? '—' : `${avgLatest}%`}</strong></div>`;

    if (!history.length) {
      historySection.hidden = true;
      return;
    }

    historySection.hidden = false;
    const counts = {};
    const numbered = history.map(item => {
      counts[item.setNo] = (counts[item.setNo] || 0) + 1;
      return { ...item, attemptNo: counts[item.setNo] };
    }).reverse().slice(0, 30);

    historyBody.innerHTML = numbered.map(a => `
      <tr>
        <td>${formatDate(a.submittedAt)}</td>
        <td>Set ${a.setNo}</td>
        <td>${a.attemptNo}</td>
        <td><strong>${a.percentage}%</strong></td>
        <td>${a.correct}/${a.scorable}</td>
        <td>${a.incorrect}</td>
        <td>${a.unanswered}</td>
      </tr>`).join('');
  }

  function renderHome() {
    const grid = document.querySelector('#setGrid');
    if (!grid) return;

    renderProfileControls();
    const profile = getCurrentProfile();
    renderRecordSummary(profile);
    const history = profile ? loadHistory(profile.id) : [];

    grid.innerHTML = '';
    for (let s = 1; s <= TOTAL_SETS; s++) {
      const start = (s - 1) * SET_SIZE + 1;
      const end = s * SET_SIZE;
      const result = profile ? loadResult(profile.id, s) : null;
      const answers = profile ? loadAnswers(profile.id, s) : {};
      const answered = Object.keys(answers).length;
      const attempts = history.filter(a => a.setNo === s).length;
      const latest = latestAttemptForSet(history, s);
      const best = bestAttemptForSet(history, s);
      const card = document.createElement('a');
      card.className = `set-card${profile ? '' : ' disabled'}`;
      card.href = profile ? `quiz.html?set=${s}` : '#profilePanel';
      if (!profile) card.setAttribute('aria-disabled', 'true');
      card.innerHTML = `
        <span class="eyebrow">30 questions</span>
        <h2>Practice Set ${s}</h2>
        <p>Questions ${start}–${end}</p>
        <div class="set-records">
          ${attempts ? `<span>Attempts: <strong>${attempts}</strong></span><span>Latest: <strong>${latest.percentage}%</strong></span><span>Best: <strong>${best.percentage}%</strong></span>` : `<span>${profile ? `${answered}/30 answered` : 'Select a user first'}</span>`}
        </div>
        <div class="set-meta">
          <span>${result ? `Current result: ${esc(result.percentage)}%` : (attempts ? 'Ready to retake' : 'Not submitted yet')}</span>
          <span class="pill ${result || attempts ? 'done' : ''}">${result ? 'Submitted' : (attempts ? 'Retake' : 'Start / Resume')}</span>
        </div>`;
      if (!profile) {
        card.addEventListener('click', (ev) => {
          ev.preventDefault();
          document.querySelector('#userNameInput')?.focus();
        });
      }
      grid.appendChild(card);
    }
  }

  function renderQuiz() {
    const root = document.querySelector('#quizRoot');
    if (!root) return;

    const profile = getCurrentProfile();
    if (!profile) {
      location.replace('index.html?needUser=1');
      return;
    }

    const setNo = getSetNo();
    const start = (setNo - 1) * SET_SIZE + 1;
    const end = setNo * SET_SIZE;
    const questions = ALL.filter(q => q.webSet === setNo);
    let answers = loadAnswers(profile.id, setNo);
    let submitted = false;
    const existingResult = loadResult(profile.id, setNo);
    if (existingResult && existingResult.answers && Object.keys(existingResult.answers).length) {
      answers = existingResult.answers;
    }

    document.title = `PMI-ACP Practice Set ${setNo} — ${profile.name}`;
    document.querySelector('#setTitle').textContent = `Practice Set ${setNo}`;
    document.querySelector('#setRange').textContent = `Questions ${start}–${end}`;
    document.querySelector('#userDisplay').textContent = profile.name;

    const prev = document.querySelector('#prevSet');
    const next = document.querySelector('#nextSet');
    if (setNo > 1) prev.href = `quiz.html?set=${setNo - 1}`; else prev.style.display = 'none';
    if (setNo < TOTAL_SETS) next.href = `quiz.html?set=${setNo + 1}`; else next.style.display = 'none';

    function updateProgress() {
      const answered = questions.filter(q => answers[q.number]).length;
      document.querySelector('#progressText').textContent = `${answered}/30 answered`;
    }

    for (const q of questions) {
      const card = document.createElement('article');
      card.className = 'question-card';
      card.id = `q${q.number}`;
      card.innerHTML = `
        <div class="question-num">Question ${q.number}</div>
        <p class="question-text">${esc(q.question)}</p>
        <div class="options" role="radiogroup" aria-label="Question ${q.number}">
          ${Object.entries(q.choices).map(([letter, text]) => `
            <label class="option">
              <input type="radio" name="q${q.number}" value="${letter}" ${answers[q.number] === letter ? 'checked' : ''}>
              <span class="option-letter">${letter}.</span><span>${esc(text)}</span>
            </label>`).join('')}
        </div>`;
      card.addEventListener('change', (ev) => {
        if (submitted) return;
        if (ev.target.matches('input[type="radio"]')) {
          answers[q.number] = ev.target.value;
          saveAnswers(profile.id, setNo, answers);
          updateProgress();
        }
      });
      root.appendChild(card);
    }
    updateProgress();

    const submitBtn = document.querySelector('#submitBtn');
    const resetBtn = document.querySelector('#resetBtn');
    const resultsEl = document.querySelector('#results');
    const reviewEl = document.querySelector('#review');

    function renderResults(result, isNewAttempt) {
      submitted = true;
      root.querySelectorAll('input').forEach(i => i.disabled = true);
      submitBtn.disabled = true;
      submitBtn.textContent = 'Test Submitted';

      const score = result || scoreSet(questions, answers);
      if (isNewAttempt) {
        const submittedAt = nowIso();
        const stored = {
          ...score,
          setNo,
          submittedAt,
          answers: { ...answers }
        };
        saveResult(profile.id, setNo, stored);
        addHistory(profile.id, {
          ...score,
          setNo,
          submittedAt,
          answers: { ...answers }
        });
      }

      resultsEl.hidden = false;
      resultsEl.innerHTML = `
        <div class="result-card">
          <span class="eyebrow">${esc(profile.name)} · Practice Set ${setNo} result</span>
          <div class="score">${score.percentage}%</div>
          <div><strong>${score.correct} correct out of ${score.scorable} scorable questions.</strong></div>
          ${score.unscored ? `<p class="source-note">This set contains ${score.unscored} unscored question because the supplied source does not provide its answer/explanation. The percentage is calculated using the ${score.scorable} source-scorable questions.</p>` : ''}
          <div class="stats">
            <div class="stat"><span>Correct</span><strong>${score.correct}</strong></div>
            <div class="stat"><span>Incorrect</span><strong>${score.incorrect}</strong></div>
            <div class="stat"><span>Unanswered</span><strong>${score.unanswered}</strong></div>
            <div class="stat"><span>Unscored</span><strong>${score.unscored}</strong></div>
          </div>
          <p class="record-saved">This attempt is stored under <strong>${esc(profile.name)}</strong>. Use <strong>Reset This Test</strong> to start a new attempt; your previous attempt history remains saved.</p>
        </div>`;

      reviewEl.hidden = false;
      reviewEl.innerHTML = `<h2>Answers and explanations</h2><p>Review all 30 questions after submission.</p>`;
      for (const q of questions) {
        const selected = answers[q.number] || '';
        let status, label;
        if (!q.answer) { status = 'unscored'; label = 'Unscored'; }
        else if (!selected) { status = 'unanswered'; label = 'Unanswered'; }
        else if (selected === q.answer) { status = 'correct'; label = 'Correct'; }
        else { status = 'incorrect'; label = 'Incorrect'; }
        const item = document.createElement('article');
        item.className = `review-item ${status}`;
        const yourText = selected ? `${selected}. ${q.choices[selected]}` : 'No answer selected';
        const correctText = q.answer ? `${q.answer}. ${q.choices[q.answer]}` : 'Not provided in the supplied source';
        const explanation = q.explanation || 'No explanation is provided in the supplied source.';
        item.innerHTML = `
          <div class="review-head"><strong>Question ${q.number}</strong><span class="status ${status}">${label}</span></div>
          <div>${esc(q.question)}</div>
          <div class="answer-line"><strong>Your answer:</strong> ${esc(yourText)}</div>
          <div class="answer-line"><strong>Correct answer:</strong> ${esc(correctText)}</div>
          <div class="explanation"><strong>Explanation:</strong> ${esc(explanation)}</div>
          ${q.sourceNote ? `<div class="source-note">${esc(q.sourceNote)}</div>` : ''}`;
        reviewEl.appendChild(item);
      }
    }

    submitBtn.addEventListener('click', () => {
      const unansweredCount = questions.filter(q => q.answer && !answers[q.number]).length;
      if (unansweredCount && !confirm(`You still have ${unansweredCount} scorable unanswered question${unansweredCount === 1 ? '' : 's'}. Submit anyway? Unanswered questions count as incorrect.`)) return;
      const score = scoreSet(questions, answers);
      renderResults(score, true);
      resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    resetBtn.addEventListener('click', () => {
      if (!confirm('Reset this test? Your current answers and current result will be cleared. Previous attempt history for this user will remain stored.')) return;
      clearCurrentTest(profile.id, setNo);
      location.reload();
    });

    if (existingResult) {
      renderResults(existingResult, false);
    }
  }

  renderHome();
  renderQuiz();
})();
