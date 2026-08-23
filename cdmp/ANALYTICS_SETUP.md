# Firebase Analytics — CDMP Test Lab

This build adds optional Firebase Analytics to the existing GitHub Pages + Firebase setup.

## What is tracked after a user chooses “Allow analytics”

- Google login and logout events
- Quiz session start
- Checked-question events (knowledge area, question type, correct/incorrect)
- Quiz session completion (score, question count, duration, mode/session type)
- Bookmark changes
- Quiz result export
- Admin dashboard opening
- Admin CSV export

Names, email addresses, Firebase UID values, question text, and selected answer text are not sent as analytics event parameters by this implementation.

## Consent

Analytics is disabled unless the visitor explicitly chooses **Allow analytics**. The choice is saved in browser localStorage under `cdmp-analytics-consent-v1`.

## Where to view analytics

In Firebase Console, open your project and use the Analytics / Google Analytics reporting area. New Analytics installations can take time before standard reports populate. For immediate testing, use Google Analytics DebugView if you enable debug mode in your browser.

## Files changed

- `index.html` — Firebase Analytics SDK, consent banner, and event logging
- `sw.js` — cache version bumped to `cdmp-dmbok2-admin-v3-analytics`

No Firestore rules changes are required for Firebase Analytics.
