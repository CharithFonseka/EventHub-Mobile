# Prompt for Antigravity — Build "EventHub" (React Native + Firebase)

> Paste everything below into Antigravity as your project prompt. Before pasting, replace `<YOUR_GITHUB_REPO_URL>` with your actual empty GitHub repo URL (e.g. `https://github.com/yourname/eventhub.git`).

---

## Role and Working Style

You are acting as a senior React Native developer building a complete cross-platform mobile app for a university exercise. Work in **clearly defined stages**, and treat each stage as a real feature commit — not one giant commit at the end. This is a strict requirement of the exercise: the GitHub commit history itself is graded, so it must show incremental, logical progress (setup → auth → data layer → features → polish), not a single dump.

Before writing any code, do the following:
1. Read this entire prompt.
2. Propose the exact stage plan you will follow (you can use the stage list below as the default, or refine it) and the commit message you'll use for each stage.
3. Wait for my confirmation on the plan only if something is ambiguous — otherwise proceed automatically through the stages in order.
4. At the end of **every stage**, run `git add -A`, commit with a conventional commit message, and push to the remote before moving to the next stage. Do not batch multiple stages into one commit.

---

## Tech Stack (fixed decisions — do not deviate)

- **Framework:** React Native using **Expo** (managed workflow) with **TypeScript**.
- **Navigation:** React Navigation (bottom tabs for main sections + native stack for detail/flow screens + a drawer or side menu for the Organizer area).
- **Backend / API:** **Firebase**
  - Firebase Authentication (email/password) for user accounts.
  - Cloud Firestore as the database for Users, Events, and Bookings.
  - Firestore acts as the "REST API" layer the app communicates with (via the Firebase SDK) to satisfy the assignment's API + database requirement — document this clearly in the README since it's the modern equivalent of a REST backend.
- **Local storage:** `@react-native-async-storage/async-storage` for session persistence, favourite events, and user preferences (e.g., last-used category filter, theme).
- **Notifications:** `expo-notifications` for local notifications (booking confirmation, booking cancellation, event reminder, event update). Push notifications are not required — local scheduled/triggered notifications are sufficient.
- **State management:** React Context + hooks (AuthContext, EventsContext, BookingsContext) — no need for Redux given the scope.
- **Forms/validation:** `react-hook-form` (or manual validation if you prefer, but must be consistent) with clear inline error messages.
- **Image handling:** `expo-image-picker` for organizers uploading event images; Firebase Storage for hosting images.

Do not swap frameworks or backend approach mid-project. If you hit a blocker with Firebase, tell me before switching to a workaround.

---

## Git / GitHub Workflow (critical — read carefully)

- Remote repository: `<YOUR_GITHUB_REPO_URL>`
- Default branch: `main`
- Initialize the repo, add the remote, and make your **first commit** before writing feature code:
  ```
  git init
  git remote add origin <YOUR_GITHUB_REPO_URL>
  git add -A
  git commit -m "chore: initial project scaffolding"
  git branch -M main
  git push -u origin main
  ```
- Use **Conventional Commits** style: `feat:`, `fix:`, `chore:`, `style:`, `docs:`, `refactor:`.
- One commit (or a small tight group of commits) per stage below — each commit must correspond to a working, testable increment. Do not commit broken code.
- Add a `.gitignore` for Expo/React Native (node_modules, .expo, build artifacts, `.env` files with Firebase keys) in the very first commit — never commit Firebase secrets.
- After every stage's commit, push immediately (`git push origin main`) so progress is visible on GitHub in real time.
- At the very end, make a final commit that adds/updates the `README.md` with setup instructions, architecture overview, and screenshots if possible.

### Staged build plan (use this as your commit roadmap)

| Stage | Scope | Example commit message |
|---|---|---|
| 0 | Expo + TypeScript project init, folder structure, navigation skeleton (tabs: Browse, My Bookings, Profile, Organizer), Firebase project config, `.gitignore`, `.env` setup | `chore: project scaffolding, navigation skeleton, Firebase setup` |
| 1 | Firebase Auth: sign up, log in, log out, protected routes; Profile screen (view/update); input validation | `feat: user authentication and profile management` |
| 2 | Firestore schema/data models for Users, Events, Bookings + a seed script to populate sample events | `feat: Firestore data models and seed data` |
| 3 | Browse Events screen: list/grid view, event cards, search bar, category filter | `feat: browse events with search and category filter` |
| 4 | Event Details screen: full info, image, map/location, availability, "Book Now" CTA | `feat: event details screen` |
| 5 | Booking flow: booking form, validation, confirmation step, write booking to Firestore, confirmation screen | `feat: event booking flow` |
| 6 | My Bookings screen: current vs. past bookings, status badges, cancel booking (with confirmation dialog) | `feat: my bookings screen with cancellation` |
| 7 | Organizer area: add event (form + image upload), view my events, edit event, delete event, view bookings per event | `feat: event organizer management` |
| 8 | Local notifications: booking confirmed, booking cancelled, event reminder, event updated | `feat: local notifications for bookings and events` |
| 9 | Local storage: persist session across app restarts, favourite events (heart icon + Favourites list), saved filter preferences | `feat: local storage for session, favourites, and preferences` |
| 10 | UI/UX polish: consistent theming, cards, dialogs/modals, empty states, loading skeletons, responsive layout across screen sizes | `style: UI polish and responsive layout` |
| 11 | Error handling pass: network/Firebase error states, form edge cases, crash-proofing, toast/snackbar feedback for all actions | `fix: robust error handling and user feedback` |
| 12 | Final: README with setup instructions + architecture notes, code cleanup, remove console logs/dead code | `docs: finalize README and project cleanup` |

Feel free to split any stage into two commits if it's large (e.g., Stage 7 into "add/edit event" and "delete/view bookings"), but never merge stages together.

---

## Functional Requirements

### 1. User Account
- Create account, log in, log out.
- View and update profile (name, email, phone, etc.).
- Validate all inputs (email format, password strength, required fields) with clear error messages.

### 2. Browse Events
- List available events with: name, image, description, date/time, location, category, price, available seats.
- Search events by name/keyword.
- Filter events by category.
- Use a card-based list or grid layout.

### 3. Event Details
- Full event info view.
- Show event location (map view or address, your choice — a simple map pin using `react-native-maps` is a nice touch if time allows, otherwise a formatted address is fine).
- Show live seat availability.
- "Book Now" button leading into the booking flow.

### 4. Event Booking
- Collect necessary booking info (number of seats, contact info, any notes).
- Validate input (e.g., can't book more seats than available).
- Confirm booking, write it to Firestore, decrement available seats.
- Show a booking confirmation screen/dialog.
- Trigger a local "booking confirmed" notification.

### 5. My Bookings
- List current and past bookings with status (confirmed/cancelled/completed).
- Allow cancellation where applicable (e.g., only future events), with a confirmation dialog.
- Trigger a local "booking cancelled" notification on cancel.

### 6. Event Organizer
- A way for a user to act as an organizer (e.g., a role flag or a separate "Organizer" tab/section).
- Add a new event (form with image upload).
- View list of their own events.
- Edit an event.
- Remove an event (with confirmation dialog).
- View bookings made for a specific event.

---

## Advanced UI Requirements

Make sure the app demonstrably includes:
- Tab-based and stack-based navigation (bottom tabs + stack screens for details/flows; a drawer for Organizer tools is a good differentiator).
- List and grid views.
- Card-based layouts for events.
- Scrollable views (event lists, long forms).
- Forms with validation feedback.
- Dialogs/modals (confirmations for booking, cancellation, deletion).
- In-app notifications (toast/snackbar for actions) **and** local push-style notifications (booking/reminder events).
- Responsive layout that adapts reasonably to different phone screen sizes.

Use your own judgment for color scheme, branding, and exact layout — keep it clean, consistent, and mobile-appropriate. Suggest an app icon/color palette in Stage 0 or Stage 10.

---

## Non-Functional Requirements
- Clear, consistent UI across all screens.
- Smooth navigation with no dead ends.
- Input validation everywhere data is entered.
- Visible feedback after every user action (success/error toasts, loading indicators).
- Graceful handling of Firebase/network errors (no unhandled promise rejections, no white-screen crashes).
- App should run cleanly on an Android/iOS emulator via Expo Go or a dev build.

---

## Deliverables
- Complete source code pushed to: `<YOUR_GITHUB_REPO_URL>`
- Commit history that clearly shows feature-by-feature progress per the staged plan above.
- A `README.md` covering: app overview, tech stack, setup/run instructions (including Firebase config steps), and architecture notes.

---

## Questions to resolve before/while building
If anything below is unclear, ask me directly rather than guessing:
1. Should "Organizer" be a separate role selected at signup, or should any logged-in user be able to toggle into an "Organizer" view?
2. Do you want real map integration (`react-native-maps`) for event location, or is a formatted address sufficient?
3. Any specific branding (app name variant, color scheme) I should lock in, or is that fully my call?

Proceed stage by stage, committing and pushing after each, and flag me immediately if a Firebase limitation forces a design change.
