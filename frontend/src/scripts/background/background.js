let isProcessing = false;

console.log("Background Script Loaded");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message Recieved");
  //   switch (message.action) {
  //     case "PROCESS_AUDIO":
  //       processAudio(message.audio);
  //       break;
  //     case "RECORDING_STARTED":
  //       updateExtensionIcon(true);
  //       break;
  //     case "RECORDING_ERROR":
  //       handleRecordingError(message.error);
  //       break;
  //   }
  //   return true;
});
