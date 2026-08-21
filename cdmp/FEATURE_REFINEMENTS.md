# Feature Refinements

This revision adds persistent adaptive-study features while keeping the app static and GitHub Pages compatible.

## Added

### Weak-area tracking
- Saves question-level attempts and latest result in browser local storage.
- Ranks weak knowledge areas using both current mastery and cumulative accuracy.
- Builds a focused study session from up to four weakest areas.
- Prioritizes currently missed questions and less-practised chapter questions.

### DMBOK chapter statistics
- Tracks all 17 chapters/knowledge areas.
- Shows bank size, unique attempted items, total attempts, accuracy, current mastery, missed count, and status.
- Includes practice-test attempts in the corresponding DMBOK knowledge-area statistics.

### Missed-question sessions
- Adds incorrect checked answers to a persistent queue.
- Adds unanswered questions from submitted/timed-out exams to the queue.
- Removes a question from the queue after a correct retry.
- Allows a dedicated missed-question practice session using the selected session-size control.

### 100-question exam simulator
- Fixed at 100 questions and 90 minutes.
- No answer explanations are shown until submission.
- Auto-submits at time expiry.
- Warns visually in the last 15 minutes and last 5 minutes.
- Keeps a question navigator for revisiting items.
- Uses one of the two knowledge-area distributions present in the supplied 100-question practice tests.
- Draws fresh questions from Chapter 1-14 pools rather than replaying a source practice test verbatim.

### Results and history
- Adds a knowledge-area score table to every completed session.
- Keeps the most recent 30 completed sessions locally.
- Adds a "Retry incorrect" action that starts an active study session rather than only showing read-only explanations.
- Exports the current session plus a progress snapshot as JSON.

## Local storage

- `cdmp-bookmarks` - existing bookmark list.
- `cdmp-theme` - existing light/dark preference.
- `cdmp-progress-v2` - adaptive progress, missed queue, and recent session history.

All progress remains on the device/browser unless the user exports it.
## Local user profile

The app now includes an optional browser-local study profile. A learner can save:

- display name;
- CDMP study goal;
- a personal target score;
- a target exam date;
- a primary DMBOK focus area.

The profile appears in the top bar and on the home dashboard. It summarizes the number of unique questions attempted, cumulative accuracy, current mastery, persistent missed-question count, and best 100-question simulator score. The profile is stored in `localStorage` under `cdmp-user-profile-v1`; it does not require an account, does not leave the browser, and can be removed without deleting study progress. JSON result exports include a snapshot of the local profile when one exists.

