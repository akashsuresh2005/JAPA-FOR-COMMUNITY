Japa for Community --- Japa Counter Web App
A devotional, mobile-friendly Japa counter that helps people track
mantra chanting through manual taps or voice recognition. It includes a
traditional 108-bead mala experience, session history, daily goals, and
lifetime chanting statistics.
Features
- Tap-to-count: Increment the count manually with a large,
  easy-to-use counter.
- Voice-assisted counting: Use the browser's Web Speech API to
  listen for supported mantra words such as "Rama" or "Ram" and count
  recognized repetitions.
- Live transcript and microphone status: Show recognized speech
  and indicate when the microphone is listening.
- 108-count mala: Visualize a mala using 108 bead/dot indicators,
  track progress, and play a bell sound when a mala is completed.
- Mantra selector: Choose the mantra you want to chant.
- Session tracking: Save and review previous chanting sessions.
- Statistics: Display session totals, daily progress, and lifetime
  count.
- Daily goals: Set a daily chanting target and monitor progress
  toward it.
- Offline-friendly: Keep the app usable without a backend; store
  user progress locally in the browser.
- Responsive devotional design: Provide a calm, accessible
  interface for mobile, tablet, and desktop.
- Progress persistence: Save counts, goals, and history with
  localStorage.
Technology Stack
- React --- UI components and application state
- Vite --- development server and build tooling
- Tailwind CSS --- responsive styling
- Web Speech API --- speech recognition where supported by the
  browser
- Web Audio API --- bell and feedback sounds
- localStorage --- local persistence without a backend
- Vite PWA / service worker --- installable, offline-friendly app
  support
- Lucide React --- interface icons
- Noto Sans Devanagari --- Devanagari text rendering, where needed
Voice recognition support and behavior depend on the browser and
device. Manual tap counting should remain available as a fallback.

Getting Started
Prerequisites
- Node.js (an active LTS release is recommended)
- npm
- A modern browser
Installation
Clone or open the project directory, then install dependencies:
npm install
Run in development
npm run dev
Open the local URL printed by Vite in your terminal.
Build for production
npm run build
Preview the production build
npm run preview
The exact scripts depend on the project's package.json. If a command
is unavailable, check the scripts listed there.
Voice Counting
1. Select the mantra you want to chant.
2. Allow microphone access when the browser asks for permission.
3. Start voice recognition using the microphone control.
4. Chant clearly and check the live transcript and count.
5. Stop listening when finished.
Voice recognition is not equally supported by every browser. It may
require a secure context such as HTTPS (or localhost during
development). Recognition can mishear words or count a phrase
differently than expected, so review the count and use manual controls
when necessary.
Counting and Mala Progress
- A manual tap adds one repetition.
- The counter displays progress toward the current 108-count mala.
- When the mala reaches 108, the app marks the mala as complete and
  can play a bell sound.
- The session summary records the chanting progress.
- Daily and lifetime statistics are calculated from locally saved
  records.
The app should prevent accidental double counting where possible and
provide clear controls to pause, reset, or end a session.
Data and Privacy
- The app is designed to work without a custom backend or account
  system.
- Session history, goals, and counts are stored in the browser's
  localStorage.
- Clearing browser data or using a different browser/device may remove
  or separate saved progress.
- Voice recognition may rely on browser-provided speech services;
  check the browser's privacy information and permissions before using
  it.
- The app should request microphone access only when the user starts
  voice recognition.
Suggested Project Structure
Your exact structure may differ, but a typical React + Vite
implementation could look like this:
japa-for-community/
├── public/
│   ├── icons/
│   └── sounds/
├── src/
│   ├── components/
│   │   ├── JapaCounter.jsx
│   │   ├── MalaProgress.jsx
│   │   ├── VoiceCounter.jsx
│   │   ├── SessionHistory.jsx
│   │   └── Statistics.jsx
│   ├── hooks/
│   │   └── useSpeechRecognition.js
│   ├── utils/
│   │   └── storage.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
This is an example structure, not a claim that every listed file already
exists in the repository.
Accessibility and UX Notes
- Keep the manual counter usable without a microphone.
- Use readable text, visible focus states, and sufficiently large
  touch targets.
- Provide a clear listening indicator and an obvious way to stop
  recognition.
- Avoid relying on color alone to communicate mala progress or
  microphone status.
- Respect reduced-motion preferences and keep animations subtle.
Future Enhancements
- Optional import/export of session history.
- More mantra choices and configurable voice-recognition keywords.
- Improved multilingual recognition and transcript controls.
- Optional backup or synchronization, only if a backend is introduced
  in the future.
License
Add the license appropriate for your project before distributing it
publicly.
