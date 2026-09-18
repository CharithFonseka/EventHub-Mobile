# EventHub 🎟️

EventHub is a modern, cross-platform mobile application built for discovering and booking events. Built with React Native, Expo, and Firebase, it features role-based access, real-time seat tracking, a beautiful UI, and local notifications.

## Features

- **Authentication:** Secure email/password login and registration using Firebase Auth.
- **Roles:** Seamlessly switch between finding events (Attendee) and managing your own events (Organizer).
- **Discover:** Browse upcoming events, filter by category (Music, Tech, Sports, etc.), and view live seat availability.
- **Book:** Atomic, real-time booking transactions ensure you never double-book a seat.
- **My Tickets:** View and cancel past bookings with a beautiful mock QR-code ticket UI.
- **Organize:** Create new events with a multi-step form and upload cover photos directly to Firebase Storage.
- **Notifications:** Receive immediate local push notifications when you book a ticket or publish an event.
- **Polish:** Custom theme, dark-mode inspired color palette, toast notifications for UX feedback, and robust error handling.

## Tech Stack

- **Framework:** React Native (Expo Managed Workflow)
- **Language:** TypeScript
- **Navigation:** React Navigation (Bottom Tabs + Native Stack)
- **Backend & Database:** Firebase (Auth, Cloud Firestore, Storage)
- **Notifications:** `expo-notifications`
- **UI Feedback:** `react-native-toast-message`
- **Media:** `expo-image-picker`

## Architecture Notes

- **Context API:** Global state is managed lightly via React Context (`AuthContext`, `EventsContext`, `BookingsContext`) to avoid Redux boilerplate for a straightforward data flow.
- **Firestore as REST:** We treat Firestore collections (`users`, `events`, `bookings`) as our API layer. Complex operations (like booking a seat) use Firestore Transactions to ensure atomicity and data integrity.
- **Security:** In a production environment, Firebase Security Rules would lock down collections based on `auth.uid`.

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- Expo CLI (`npm install -g expo-cli`)
- A Firebase Project (with Auth, Firestore, and Storage enabled)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone <your-repo-url>
cd EventHub-Mobile
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your Firebase configuration:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Running the App
Start the Expo development server:
```bash
npx expo start
```
- **iOS:** Press `i` to open in iOS Simulator (requires Xcode on macOS).
- **Android:** Press `a` to open in Android Emulator (requires Android Studio).
- **Physical Device:** Download the **Expo Go** app on your phone and scan the QR code.

---
*Built as a comprehensive React Native showcase.*
