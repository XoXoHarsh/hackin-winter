console.log("Background Script Loaded");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background.js:", message);

  // Perform actions based on the message content
  if (message && message.message) {
    console.log("Speech result:", message.message);

    // Example: Send a response back to the sender
    sendResponse({
      status: "Message received",
      receivedMessage: message.message,
    });
  }

  // Return `true` if the response will be sent asynchronously
  return true;
});
