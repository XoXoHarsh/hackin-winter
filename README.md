# Bol Hind - Voice Controlled Browser Extension

A Chrome extension that enables hands-free browsing using natural voice commands in Indian languages. Powered by AI4Bharat's translation models and Google's Gemini for command interpretation.

## Features

- Voice-controlled browser navigation in multiple Indian languages
- Real-time audio capture and processing
- Automatic language translation using AI4Bharat models
- Natural language command interpretation using Gemini AI
- Browser automation based on voice commands
- Supports multiple Indian languages
- Real-time response using WebSocket connection

## Tech Stack

- Frontend:

  - React + Vite
  - TypeScript
  - Chrome Extensions API
  - Web Audio API for voice capture
  - WebSocket client for real-time communication

- Backend:
  - FastAPI
  - WebSocket server
  - AI4Bharat Translation Models:
    - indictrans2-indic-en-1B (Indic to English)
    - indictrans2-en-indic-1B (English to Indic)
  - Google Gemini API for command interpretation

## Installation

1. Clone the repository:

```bash
git clone https://github.com/XoXoHarsh/HACKIN-WINTER.git
cd bol-hind
```

2. Install frontend dependencies:

```bash
cd frontend
npm install
```

3. Install backend dependencies:

```bash
cd backend
pip install -r requirements.txt
```

4. Load the extension in Chrome:

- Open Chrome and go to chrome://extensions/
- Enable Developer Mode
- Click "Load unpacked"
- Select the dist folder from the frontend directory

## Usage

1. Click the Bol Hind extension icon in Chrome
2. Select your preferred language from the dropdown
3. Click the microphone icon to start voice input
4. Speak your command in your chosen language
5. The extension will:

   - Capture your voice input
   - Translate it to English
   - Interpret the command using Gemini
   - Execute the appropriate browser action

## Development Setup

1. Frontend development:

```bash
cd frontend
npm run dev
```

2. Backend development:

```bash
python index.py
```

## Architecture

1. Voice Capture: Uses Web Audio API to capture voice input from the user's microphone

2. Translation Pipeline:

- Audio capture → Text (Speech-to-Text)
- Indic language → English (AI4Bharat Translation)
- Command interpretation (Gemini AI)
- Browser automation execution

3. Real-time Communication:

- WebSocket connection between frontend and backend
- Instant command execution feedback

## Acknowledgments

- AI4Bharat for the translation models
- Google Gemini for natural language processing
- Chrome Extensions API documentation
