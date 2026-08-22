# CDMP DMBOK2 Question Lab – Private Deduplicated Study Edition

This private, no-build HTML app contains **694 questions**: the original 490-question bank plus **204 genuinely new questions** from the supplied Data Strategy Professionals and DAMA Attempt PDFs after semantic deduplication and DMBOK verification.

## Files

- `index.html` — self-contained interactive app.
- `question_bank.json` — complete 694-question dataset.
- `question_bank.csv` — spreadsheet-friendly dataset.
- `SOURCE_INTEGRATION_AUDIT.csv` / `.json` — all 306 source decisions.
- `DEDUP_VERIFICATION_REPORT.md` — counts, methodology, corrections, and progress-compatibility statement.
- `FEATURE_REFINEMENTS.md` — profile, analytics, missed-question sessions, and mock-exam behavior.
- `TYPO_CORRECTIONS.md` — original-bank editorial correction log.

## Existing progress is preserved

Existing question IDs are unchanged and remain the first 490 records. The app continues to use:

- `cdmp-progress-v2`
- `cdmp-user-profile-v1`

Open `index.html` locally, or place the folder in a **private** GitHub repository. The Question source filter now has two study collections: **Original (490)** and **Combined Sources (204)**. Detailed source provenance is still shown inside each answer explanation and retained in the JSON/CSV fields. The 100-question simulator uses only verified/corrected questions.

## Private-use warning

The supplied Data Strategy Professionals materials and DAMA exam-attempt material contain redistribution restrictions. Do not publish this private build publicly unless you have permission.


## Desktop and phone use

- The interface adapts from a two-column desktop layout to a touch-friendly phone layout.
- On phones and tablets, the session controls open from the menu button as a slide-out drawer.
- Question navigation, answer choices, dialogs, and action buttons use larger touch targets.
- When hosted over HTTPS (for example, GitHub Pages), the app can be installed as a PWA and used offline after the first load.
- The app still works as a standalone `index.html` file, but PWA installation and offline caching require HTTPS.
- Profile and progress remain browser-local. Use **Backup data** and **Restore data** to move them between a computer and phone.


## Two source collections

- **Original** — the initial 490-question Z-Library-derived bank.
- **Combined Sources** — all 204 DMBOK-verified additions from the Data Strategy Professionals sets and DAMA practice-attempt PDFs.

The app presents these as two selectable source collections. It still retains `source_group`, `source_name`, and `source_question` for detailed provenance and audit purposes.
