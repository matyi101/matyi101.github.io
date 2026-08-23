# Owner Admin Dashboard Setup

The app now has an owner-only **Admin** button. It appears only when the signed-in Firebase UID has an admin marker in Firestore.

## One-time setup

1. Upload the new `index.html` and `sw.js` to GitHub Pages.
2. In Firebase Console, open **Firestore Database > Rules** and replace the current rules with the included `firestore.rules`, then click **Publish**.
3. Sign in to the Test Lab with the Google account that should be the owner.
4. Open the account button in the top bar and copy the displayed **Firebase UID**.
5. In Firebase Console, open **Firestore Database > Data**.
6. Create a top-level collection named `admins`.
7. Create a document whose **Document ID is exactly your Firebase UID**.
8. Add an optional Boolean field `enabled` with value `true` (the app also accepts a document with no fields).
9. Sign out and sign back in, or refresh the Test Lab.

The **Admin** button will then appear in the top bar for that account only.

## What the admin dashboard shows

- registered user count
- total recorded accesses
- users who accessed the lab today
- verified-email count
- user name and Firebase UID
- email address
- sign-in provider
- first access
- last access
- access count
- search and refresh controls

## Security model

Ordinary users can read/update only their own `users/{uid}` document. Admins can read all documents in `users` for the dashboard. Admins do not receive write access to other users and do not receive access to users' session subcollections.

The browser cannot create an admin marker. Admin access is granted only by manually creating/removing `admins/{uid}` in Firebase Console.

## Admin activity filters and CSV export
The admin dashboard now includes **All users**, **Today**, **Last 7 days**, and **Last 30 days** filters based on each user's `lastAccessAt` timestamp. **Export CSV** downloads the currently filtered/searched user list. This does not require additional Firestore permissions because it uses the same owner-only `/users` read access.
