(() => {
  'use strict';
  const ALL = window.PMI_ACP_QUESTIONS || [];
  const SET_SIZE = 30;
  const TOTAL_SETS = 12;

  const esc = (value) => String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

  function storageKey(setNo) { return `pmiacp-practice-set-${setNo}`; }
  function resultKey(setNo) { return `pmiacp-practice-result-${setNo}`; }
  function loadAnswers(setNo) {
    try { return JSON.parse(localStorage.getItem(storageKey(setNo)) || '{}'); }
    catch { return {}; }
  }
  function saveAnswers(setNo, answers) { localStorage.setItem(storageKey(setNo), JSON.stringify(answers)); }
  function loadResult(setNo) {
    try { return JSON.parse(localStorage.getItem(resultKey(setNo)) || 'null'); }
    catch { return null; }
  }

  function renderHome() {
    const grid = document.querySelector('#setGrid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let s = 1; s <= TOTAL_SETS; s++) {
      const start = (s - 1) * SET_SIZE + 1;
      const end = s * SET_SIZE;
      const result = loadResult(s);
      const answers = loadAnswers(s);
      const answered = Object.keys(answers).length;
      const card = document.createElement('a');
      card.className = 'set-card';
      card.href = `quiz.html?set=${s}`;
      card.innerHTML = `
        <span class="eyebrow">30 questions</span>
        <h2>Practice Set ${s}</h2>
        <p>Questions ${start}–${end}</p>
        <div class="set-meta">
          <span>${result ? `Last score: ${esc(result.percentage)}%` : `${answered}/30 answered`}</span>
          <span class="pill ${result ? 'done' : ''}">${result ? 'Completed' : 'Start / Resume'}</span>
        </div>`;
      grid.appendChild(card);
    }
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
    return {correct, incorrect, unanswered, unscored, scorable, percentage};
  }

  function renderQuiz() {
    const root = document.querySelector('#quizRoot');
    if (!root) return;
    const setNo = getSetNo();
    const start = (setNo - 1) * SET_SIZE + 1;
    const end = setNo * SET_SIZE;
    const questions = ALL.filter(q => q.webSet === setNo);
    let answers = loadAnswers(setNo);
    let submitted = false;

    document.title = `PMI-ACP Practice Set ${setNo}`;
    document.querySelector('#setTitle').textContent = `Practice Set ${setNo}`;
    document.querySelector('#setRange').textContent = `Questions ${start}–${end}`;
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
          saveAnswers(setNo, answers);
          updateProgress();
        }
      });
      root.appendChild(card);
    }
    updateProgress();

    const submitBtn = document.querySelector('#submitBtn');
    const resultsEl = document.querySelector('#results');
    const reviewEl = document.querySelector('#review');

    function renderResults() {
      submitted = true;
      root.querySelectorAll('input').forEach(i => i.disabled = true);
      submitBtn.disabled = true;
      submitBtn.textContent = 'Test Submitted';
      const score = scoreSet(questions, answers);
      localStorage.setItem(resultKey(setNo), JSON.stringify(score));

      resultsEl.hidden = false;
      resultsEl.innerHTML = `
        <div class="result-card">
          <span class="eyebrow">Practice Set ${setNo} result</span>
          <div class="score">${score.percentage}%</div>
          <div><strong>${score.correct} correct out of ${score.scorable} scorable questions.</strong></div>
          ${score.unscored ? `<p class="source-note">This set contains ${score.unscored} unscored question because the supplied source does not provide its answer/explanation. The percentage is calculated using the ${score.scorable} source-scorable questions.</p>` : ''}
          <div class="stats">
            <div class="stat"><span>Correct</span><strong>${score.correct}</strong></div>
            <div class="stat"><span>Incorrect</span><strong>${score.incorrect}</strong></div>
            <div class="stat"><span>Unanswered</span><strong>${score.unanswered}</strong></div>
            <div class="stat"><span>Unscored</span><strong>${score.unscored}</strong></div>
          </div>
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
      resultsEl.scrollIntoView({behavior: 'smooth', block: 'start'});
    }

    submitBtn.addEventListener('click', () => {
      const unansweredCount = questions.filter(q => q.answer && !answers[q.number]).length;
      if (unansweredCount && !confirm(`You still have ${unansweredCount} scorable unanswered question${unansweredCount === 1 ? '' : 's'}. Submit anyway? Unanswered questions count as incorrect.`)) return;
      renderResults();
    });

    document.querySelector('#resetBtn').addEventListener('click', () => {
      if (!confirm('Clear your answers and result for this 30-question set?')) return;
      localStorage.removeItem(storageKey(setNo));
      localStorage.removeItem(resultKey(setNo));
      location.reload();
    });
  }

  renderHome();
  renderQuiz();
})();
