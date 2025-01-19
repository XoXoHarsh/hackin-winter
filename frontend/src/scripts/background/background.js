console.log("Background Script Loaded");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background.js:", message);
  console.log("Sender:", sender);

  if (message && message.message) {
    console.log("Speech result:", message.message);

    // Save the message to local storage
    chrome.storage.local.set({ savedMessage: message.message }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving message:", chrome.runtime.lastError);
        sendResponse({
          status: "Error saving message",
          error: chrome.runtime.lastError.message,
        });
      } else {
        console.log("Message saved to local storage:", message.message);
        // Retrieve the saved message to confirm it's saved
        chrome.storage.local.get(["savedMessage"], (result) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Error retrieving message:",
              chrome.runtime.lastError
            );
          } else {
            console.log("Retrieved saved message:", result.savedMessage);
          }
        });

        // Send a success response back to the sender
        sendResponse({
          status: "Message saved successfully",
          savedMessage: message.message,
        });
      }
    });
  } else {
    // Send an error response if no message is provided
    sendResponse({
      status: "Error",
      message: "No valid message provided",
    });
  }

  // Return `true` to allow asynchronous response
  return true;
});
