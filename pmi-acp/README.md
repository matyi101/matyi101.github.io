# PMI-ACP Practice Web — 12 Sets × 30 Questions

Static GitHub Pages practice site built from the 360-question practice bank.

## Features

- 360 questions divided sequentially into 12 sets of 30.
- Individual user profiles: enter a name or switch between previously created names.
- In-progress answers are stored separately for each user and test set in browser local storage.
- Every submitted attempt is stored in the selected user's test history.
- Home page shows Attempts, Sets Attempted, Best Score, Latest Score, Average Latest Score, per-set latest/best scores, and recent Test History.
- Optional CSV export of the selected user's stored history.
- **Reset My Records** clears the current user's entire local test history, saved results, and in-progress answers while keeping the user profile.
- **Delete User Profile** removes the selected name and all associated locally stored records from the browser.
- A **Reset This Test** button is permanently available at the top of every test. It clears only the current test's answers and current result; previous attempt history remains stored.
- Correct answers and explanations are hidden until the test is submitted.
- At submission, the site displays percentage, correct/incorrect/unanswered/unscored counts, then a full answer and explanation review.

## Scoring

Percentage = correct answers / source-scorable questions × 100.

The supplied source has no answer/explanation for Question 70. Therefore Practice Set 3 contains 30 displayed questions but 29 source-scorable questions.

## GitHub Pages

Upload the contents of this folder to the root of a GitHub repository, then enable GitHub Pages for the branch/folder you want to publish.

No server, database, package manager, or build step is required.

## Data storage

User records are stored with the browser `localStorage` API. Records therefore stay on the same browser/device and may be lost if browser storage is cleared. They do not synchronize automatically between computers or phones.
