import { startSpeechRecognition } from "./recording";

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
