# CDMP DMBOK2 Question Lab

A no-build, static GitHub Pages study app created from the supplied **CDMP - Data Management Fundamentals Exam Questions on DMBOK2 (2nd Edition)** question bank.

## Contents

- `index.html` - self-contained interactive quiz interface with all 490 questions embedded; no framework or build step required.
- `quiz-data.js` - the same question dataset as a reusable JavaScript data file.
- `question_bank.json` - machine-readable full extraction.
- `question_bank.csv` - spreadsheet-friendly full extraction.

The question set contains **490 questions**: 290 single-choice and 200 multi-select questions, covering Chapters 1-17 plus Practice Test 1 and Practice Test 2 (100 questions each).

## Run locally

Open `index.html` in a browser. It is fully self-contained and does not require a local server.

## Publish with GitHub Pages

1. Create a GitHub repository.
2. Upload all files in this folder to the repository root.
3. In **Settings -> Pages**, choose **Deploy from a branch**.
4. Select the `main` branch and `/ (root)` folder, then save.
5. GitHub Pages will publish the static site at the Pages URL shown in the repository settings.

## Study modes

- **Study mode**: check answers one at a time and read the explanation and DMBOK evidence.
- **Exam mode**: hides answers until submission and uses 54 seconds per question, matching 90 minutes for 100 questions.
- Filter by source section, knowledge area, text, bookmarks, or session size.
- Optional question and answer-choice shuffling.
- Bookmarking is saved in browser `localStorage`.
- Session results can be exported as JSON.

## DMBOK references

The source question bank was written against **DMBOK2 (2017)** and supplies a DMBOK page reference for each item. Those source page references are retained. A second page reference is matched against the supplied **DMBOK2 Revised Edition (2024)** so the material can be found in the newer edition when it has moved.

Two apparent page-reference errors in the source bank are flagged in the app:

- Chapter 4, Question 20: source bank says p. 82; the relevant 2017 diagramming-clarity material is on p. 116 (2024 revised p. 117).
- Chapter 17, Question 10: source bank says p. 174; the relevant 2017 team-building material is on p. 589 (2024 revised p. 556).

## Source note

The supplied question book describes itself as unofficial revision material and states that it is not endorsed by DAMA. The app preserves the original question wording, including occasional source typos, while adding structured answer explanations and DMBOK cross-references.
