import React, { useEffect, useState } from "react";
import { Settings, Mic, X } from "lucide-react";
import "./App.css";

// Modal Component
interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => (
  <div className="modal">
    <div className="modal-content">
      <div className="modal-header">
        <h2>{title}</h2>
        <button className="icon-button close-button" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <div className="modal-body">{children}</div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [micPermission, setMicPermission] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const languages = ["English", "Hindi", "Gujarati", "Bengali", "Marathi"];
  // const commands = [
  //   { command: "Open tab", description: "Opens a new tab" },
  //   { command: "Scroll up", description: "Scrolls the page up" },
  // ];

  useEffect(() => {
    const saveMessageToLocalStorage = () => {
      chrome.storage.local.set({ language: selectedLanguage }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error saving language:", chrome.runtime.lastError);
        } else {
          console.log("Language saved:", selectedLanguage);
        }
      });
    };

    saveMessageToLocalStorage();
  }, [selectedLanguage]);

  const requestMicPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission(true);
    } catch {
      alert("Mic permission denied");
    }
  };

  return (
    <div className="app-root">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Voice Commander</h1>
          <div className="header-buttons">
            {/* <button className="icon-button" onClick={() => setShowHelp(true)}>
              <HelpCircle size={22} />
            </button> */}
            <button
              className="icon-button"
              onClick={() => setShowLanguageSelect(true)}
            >
              <Settings size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Modals */}
      {/* {showHelp && (
        <Modal title="Available Commands" onClose={() => setShowHelp(false)}>
          <ul className="commands-list">
            {commands.map((cmd, idx) => (
              <li key={idx}>
                <strong>{cmd.command}</strong>: {cmd.description}
              </li>
            ))}
          </ul>
        </Modal>
      )} */}

      {showLanguageSelect && (
        <Modal
          title="Select Language"
          onClose={() => setShowLanguageSelect(false)}
        >
          <div className="language-grid">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`language-button ${
                  lang === selectedLanguage ? "selected" : ""
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* Main Content */}
      <main className="main-container">
        {!micPermission ? (
          <div className="mic-access">
            <Mic size={40} />
            <p>Enable Microphone Access</p>
            <button className="primary-button" onClick={requestMicPermission}>
              Enable
            </button>
          </div>
        ) : (
          <div className="voice-controls">
            <button
              className={`primary-button ${
                isListening ? "stop-listening" : ""
              }`}
              onClick={() => setIsListening(!isListening)}
            >
              {isListening ? "Stop Listening" : "Start Listening"}
            </button>
            <p className="language-text">
              Selected Language: <strong>{selectedLanguage}</strong>
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
