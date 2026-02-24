# Poker Hand Log — Android App

A Texas Hold'em hand logger and AI analysis tool built with React Native + Expo.

---

## Prerequisites

Install these once on your computer:

1. **Node.js** (v18 or later) → https://nodejs.org
2. **Expo CLI** → after Node is installed, run:
   ```
   npm install -g expo-cli
   ```
3. **Expo Go app** on your Android phone → install from the Google Play Store

---

## Setup & Run

1. **Unzip** this folder somewhere on your computer

2. Open a terminal / command prompt inside the `PokerHandLog` folder

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npx expo start
   ```

5. A QR code will appear in the terminal.  
   Open the **Expo Go** app on your Android phone and scan the QR code.  
   The app will load on your phone. ✅

---

## Build a standalone APK (to install without Expo Go)

1. Install EAS CLI:
   ```
   npm install -g eas-cli
   ```

2. Create a free account at https://expo.dev and log in:
   ```
   eas login
   ```

3. Configure the build:
   ```
   eas build:configure
   ```

4. Build the APK:
   ```
   eas build -p android --profile preview
   ```

5. When it finishes, download the `.apk` file from your Expo dashboard and install it on your phone.

---

## Project Structure

```
PokerHandLog/
├── App.js                    ← Root app, screen navigation & state
├── src/
│   ├── theme.js              ← Colors and fonts
│   ├── storage.js            ← AsyncStorage persistence
│   └── screens/
│       ├── HomeScreen.js     ← Hand list (Edit / Analyze / Delete)
│       ├── EditorScreen.js   ← Hand builder with tap keyboard
│       └── AnalysisScreen.js ← AI analysis display
├── app.json                  ← Expo config
└── package.json
```

---

## Features

- **Home screen** — list of all saved hands with EDIT / ANALYZE / DELETE
- **Hand builder** — tap sections for Player, Position, Action, Street, BB/$, Cards
- **Pinned textarea** — always visible while building
- **Persistent storage** — hands survive app restarts
- **AI Analysis** — powered by Claude, focused on exploitative play + GTO
- **Cached analysis** — hands analyzed once; result is saved and reused
