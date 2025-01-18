const showMessageBox = (message) => {
  // Create the floating box element
  const floatingBox = document.createElement("div");

  // Set styles for the floating box
  Object.assign(floatingBox.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    padding: "15px",
    textAlign: "center",
    zIndex: "9999",
    fontFamily: "Arial, sans-serif",
  });

  // Set the message text
  floatingBox.textContent = message;

  // Add the box to the page
  document.body.appendChild(floatingBox);

  return floatingBox;
};

const startSpeechRecognition = () => {
  // Check if browser supports speech recognition
  if (!("webkitSpeechRecognition" in window)) {
    showMessageBox("Speech recognition is not supported in this browser.");
    return;
  }

  // Create speech recognition instance
  const recognition = new webkitSpeechRecognition();

  // Configure recognition settings
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  let messageBox = showMessageBox("Listening... ");

  // Handle recognition results
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

    // Update message box with transcripts
    messageBox.textContent =
      finalTranscript || interimTranscript || "Listening...";
  };

  // Handle errors
  recognition.onerror = (event) => {
    messageBox.textContent = "Error occurred in recognition: " + event.error;
  };

  // Stop recognition when clicking anywhere on the page
  document.addEventListener(
    "click",
    () => {
      recognition.stop();
      messageBox.textContent =
        "Speech recognition stopped. Refresh page to start again.";
    },
    { once: true }
  );

  // Start recognition
  recognition.start();
};

const init = async () => {
  console.log("Content Script Loaded");
  startSpeechRecognition();
};

// Run initialization when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
