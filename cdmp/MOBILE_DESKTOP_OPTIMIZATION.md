# Desktop and Phone Optimization

The private 694-question build was updated for responsive use without changing any question IDs or local-storage keys.

## Changes

- Responsive desktop, tablet, and phone layouts.
- Off-canvas session-control drawer below 1050 px.
- Touch targets of approximately 44–56 px for controls and answer options.
- Sticky phone session header and bottom question actions.
- Phone-friendly question navigator, tables, profile dialog, and results screen.
- Safe-area support for notched phones.
- Installable PWA files (`manifest.webmanifest`, `sw.js`, and app icons).
- Offline cache after the first HTTPS-hosted visit.
- Manual backup/restore of profile, progress, bookmarks, and missed queue between devices.
- Existing storage keys remain `cdmp-progress-v2` and `cdmp-user-profile-v1`.

## Important

Browser-local progress does not automatically synchronize. Use the backup/restore controls when switching devices.
