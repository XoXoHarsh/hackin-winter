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
cd HACKIN-WINTER
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
```
Build the frontend to create the `dist` folder:

   ```bash
    npm run build
   ```
2. Add the Extension to the Browser

1. Open your browser and navigate to the extensions page:
   - For Chrome: `chrome://extensions`
   - For Brave: `brave://extensions`
2. Enable **Developer Mode** (usually found in the top right corner).
3. Click on **Load Unpacked**.
4. Select the `dist` folder generated in the frontend directory.
5. The extension is now added and ready to use.

   
2. Backend development:

```bash
cd backend
python index.py
```

## Architecture

![System Architecture 2](https://github.com/user-attachments/assets/56d3e372-5ea7-4f9f-941e-1c09249b4d95)

## Acknowledgments

- AI4Bharat for the translation models
- Google Gemini for natural language processing
- Chrome Extensions API documentation
