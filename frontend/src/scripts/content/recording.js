import { showMessageBox } from "./ui/showMessageBox";
import sendMessage from "../background/response-script";

export const startSpeechRecognition = () => {
  if (!("webkitSpeechRecognition" in window)) {
    showMessageBox("Speech recognition is not supported in this browser.");
    return;
  }

  const recognition = new webkitSpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  let messageBox = showMessageBox("Listening... ");

  let restartTimeout = null;

  const resetRestartTimeout = (message) => {
    clearTimeout(restartTimeout);
    restartTimeout = setTimeout(() => {
      recognition.stop();
      if (message && message.trim() !== "") {
        chrome.runtime.sendMessage({ message });

        messageBox.textContent = "Processing...";

        sendMessage(message);

        setTimeout(() => {
          recognition.start();
        }, 1000);
      } else {
        messageBox.textContent = "No speech detected. Listening...";
        recognition.start();
      }
    }, 2000);
  };

  recognition.onresult = (event) => {
    let finalTranscript = "";
    let interimTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    const message = finalTranscript || interimTranscript || "Listening...";
    messageBox.textContent = message;

    resetRestartTimeout(message);
  };

  recognition.onerror = (event) => {
    messageBox.textContent = "Error occurred in recognition: " + event.error;
  };

  recognition.onend = () => {
    // if (messageBox.textContent.includes("No speech detected")) {
    //   recognition.start();
    // }
  };

  // Start recognition and initialize the timeout
  recognition.start();
  resetRestartTimeout();
};
