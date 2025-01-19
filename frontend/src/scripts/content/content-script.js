import { startSpeechRecognition } from "./recording";
import { showResponseBox } from "../background/response-script";

const init = async () => {
  console.log("Content Script Loaded");
  startSpeechRecognition();
  showResponseBox();
};

// Run initialization when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
