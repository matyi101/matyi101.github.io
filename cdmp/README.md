# CDMP DMBOK2 Question Lab

A no-build, static GitHub Pages study app created from the supplied **CDMP - Data Management Fundamentals Exam Questions on DMBOK2 (2nd Edition)** question bank.

## Contents

- `index.html` - self-contained interactive quiz interface with all 490 questions embedded; no framework or build step required.
- `quiz-data.js` - the same question dataset as a reusable JavaScript data file.
- `question_bank.json` - machine-readable full extraction.
- `question_bank.csv` - spreadsheet-friendly full extraction.
- `TYPO_CORRECTIONS.md` - audit log of source typo/editorial corrections.
- `FEATURE_REFINEMENTS.md` - notes on the adaptive practice, progress tracking, and exam simulator added in the refined version.

The question set contains **490 questions**: 290 single-choice and 200 multi-select questions, covering Chapters 1-17 plus Practice Test 1 and Practice Test 2 (100 questions each).

## Run locally

Open `index.html` in a browser. It is fully self-contained and does not require a local server.

## Publish with GitHub Pages

1. Create a GitHub repository.
2. Upload all files in this folder to the repository root.
3. In **Settings -> Pages**, choose **Deploy from a branch**.
4. Select the `main` branch and `/ (root)` folder, then save.
5. GitHub Pages will publish the static site at the Pages URL shown in the repository settings.

## Study and adaptive practice modes

- **Local user profile**: create a browser-local study identity with display name, CDMP goal, personal target score, target exam date, and focus area. The profile card summarizes attempted questions, accuracy, current mastery, missed queue, and best 100-question mock score.
- **Study mode**: check answers one at a time and read the explanation and DMBOK evidence.
- **Custom exam mode**: hides answers until submission and uses 54 seconds per question, equivalent to 90 minutes for 100 questions.
- **Weak-area practice**: ranks knowledge areas from your saved attempts and builds a focused session from the areas with the lowest current mastery/accuracy.
- **Missed-question sessions**: incorrect answers and skipped exam questions are stored in a persistent retry queue. A correctly answered retry removes the item from that queue.
- **100-question exam simulator**: creates a unique 100-question, 90-minute exam from the chapter question pools and suppresses answer feedback until submission.
- Filter by source section, knowledge area, text, bookmarks, or session size.
- Optional question and answer-choice shuffling.
- Bookmarking is saved in browser `localStorage`.
- Session results and the current progress snapshot can be exported as JSON.

## 100-question simulator blueprint

The simulator is deliberately described as **source-aligned**, not as an official DAMA blueprint. The supplied book contains two 100-question practice tests. Their knowledge-area distributions are nearly identical, so the simulator randomly follows one of the two source profiles:

| Knowledge area | Practice Test 1 | Practice Test 2 |
|---|---:|---:|
| Data Management | 3 | 2 |
| Data Handling Ethics | 2 | 3 |
| Data Governance | 10 | 10 |
| Data Architecture | 6 | 6 |
| Data Modelling and Design | 11 | 11 |
| Data Storage and Operations | 6 | 6 |
| Data Security | 6 | 6 |
| Data Integration and Interoperability | 6 | 6 |
| Document and Content Management | 6 | 6 |
| Reference and Master Data | 10 | 10 |
| Data Warehousing and Business Intelligence | 9 | 9 |
| Metadata Management | 11 | 11 |
| Data Quality | 11 | 11 |
| Big Data and Data Science | 3 | 3 |
| **Total** | **100** | **100** |

The generated mock uses the chapter pools rather than copying one of the two source practice tests verbatim. This produces a fresh exam while preserving the source practice-test mix.

## Weak-area tracking and DMBOK chapter statistics

Progress is stored locally in the browser under `cdmp-progress-v2`. For each question, the app stores the number of attempts, correct/incorrect counts, the last result, answer streak, and last-answer timestamp.

The optional study profile is stored separately under `cdmp-user-profile-v1`. Removing the profile does **not** delete quiz progress, bookmarks, or the missed-question queue. No sign-in or server is used.

The home dashboard reports:

- total attempts;
- unique questions attempted;
- cumulative accuracy;
- current missed-question queue;
- weakest knowledge areas;
- recent session scores;
- all 17 DMBOK chapters, with bank-item count, unique attempted items, total attempts, cumulative accuracy, current mastery, missed questions, and a status label.

**Accuracy** is calculated across all recorded attempts. **Mastery** is based on the latest recorded result for each attempted question, so a later correct retry can improve the chapter's current mastery even though the earlier incorrect attempt remains part of cumulative accuracy.

Progress can be reset from the dashboard without removing bookmarks.

## DMBOK references

The source question bank was written against **DMBOK2 (2017)** and supplies a DMBOK page reference for each item. Those source page references are retained. A second page reference is matched against the supplied **DMBOK2 Revised Edition (2024)** so the material can be found in the newer edition when it has moved.

Two apparent page-reference errors in the source bank are flagged in the app:

- Chapter 4, Question 20: source bank says p. 82; the relevant 2017 diagramming-clarity material is on p. 116 (2024 revised p. 117).
- Chapter 17, Question 10: source bank says p. 174; the relevant 2017 team-building material is on p. 589 (2024 revised p. 556).

## Source note

The supplied question book describes itself as unofficial revision material and states that it is not endorsed by DAMA. The app preserves the source question intent and answer keys while correcting obvious spelling, grammar, extraction/truncation, and duplicate-option defects where the intended wording can be established without changing answer logic. See `TYPO_CORRECTIONS.md` for the audit trail. Answer-sensitive anomalies are left unchanged and documented rather than silently rewritten.
