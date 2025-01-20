import React, { useEffect, useState } from "react";
import { Settings, X } from "lucide-react";
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
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const languages = ["English", "Hindi", "Gujarati", "Bengali", "Marathi"];
  const commands = [
    {
      command: "Select your language from settings",
      description: "You can choose the language you prefer to interact in.",
    },
    {
      command: "Speak in your natural language",
      description: "The application will understand and respond accordingly.",
    },
    {
      command: "Following tasks can be performed",
      description:
        "Explore various commands like opening tabs, scrolling, and more.",
    },
  ];

  const setLanguageToLocalStorage = (lang: string) => {
    chrome.storage.local.set({ ["language"]: lang }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving language:", chrome.runtime.lastError);
      } else {
        setSelectedLanguage(lang);
      }
    });
  };

  const getLanguagefromLocalStorage = () => {
    chrome.storage.local.get(["language"], (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error retrieving language:", chrome.runtime.lastError);
      } else {
        setSelectedLanguage(result?.language || "English");
      }
    });
  };

  useEffect(() => {
    getLanguagefromLocalStorage();
  }, []);

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Voice Commander</h1>
          <div className="header-buttons">
            <button
              className="icon-button"
              onClick={() => setShowLanguageSelect(true)}
            >
              <Settings size={22} />
            </button>
          </div>
        </div>
      </header>

      {showLanguageSelect && (
        <Modal
          title="Select Language"
          onClose={() => setShowLanguageSelect(false)}
        >
          <div className="language-grid">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguageToLocalStorage(lang)}
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

      <main className="main-container">
        <div className="voice-controls">
          <p className="language-text">
            <span className="label">Selected Language:</span>{" "}
            <strong className="highlight">{selectedLanguage}</strong>
          </p>
        </div>
        <div className="commands-container">
          <h3 className="commands-header">Instructions</h3>
          <ul className="commands-list">
            {commands.map((cmd, idx) => (
              <li key={idx} className="command-item">
                <span className="command-title">{cmd.command} :</span>
                <br />
                <br />
                <span className="command-description">{cmd.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default App;
