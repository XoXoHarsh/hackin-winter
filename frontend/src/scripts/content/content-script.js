import { startSpeechRecognition } from "./recording";
import {
  showResponseBox,
  initializeWebSocket,
} from "../background/response-script";

globalData = {
  url: "ws://localhost:8000/ws",
  flag: false,
};

const init = async () => {
  console.log("Content Script Loaded");
  startSpeechRecognition(globalData);
  showResponseBox("Connecting to WebSocket...");
  initializeWebSocket(globalData);
};

// Run initialization when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
