# Firebase + GitHub Pages setup

This build requires Firebase Authentication before the 694-question Test Lab is shown.

## Firebase Console

1. Authentication -> Sign-in method: keep **Google** enabled.
2. Authentication -> Settings -> Authorized domains: add your GitHub Pages hostname, for example `yourusername.github.io`.
3. Firestore -> Rules: publish the contents of `firestore.rules` supplied in this package.

Do not include `https://` or your repository path when adding the GitHub Pages authorized domain.

## GitHub repository

Upload the contents of this package to the same branch/folder used by GitHub Pages. The important new files are:

- `index.html`
- `firebase-config.js`
- `firestore.rules` (reference/deployment copy; GitHub Pages does not execute this file)
- `sw.js`

The Firebase web config is intentionally present in client-side code. Database protection comes from Authentication and Firestore Security Rules.

## What happens on access

1. The visitor sees only a Google sign-in gate.
2. Firebase Authentication verifies the Google account.
3. The app creates/updates `users/{uid}` in Firestore with name, email, provider, first access, last access, and access count.
4. The Test Lab becomes visible.
5. The user's existing quiz progress remains browser-local and continues to use the same localStorage keys.

## View users

In Firebase Console, open Firestore -> Data -> `users`. Each signed-in user has one document keyed by their Firebase UID.

This version does not yet provide an owner-only in-app admin dashboard. The current Firestore rules deliberately prevent users from reading other users' records.
