let socket = null;

function init() {
  console.log("Background Script Initialized");

  // Initialize WebSocket connection
  socket = new WebSocket("ws://localhost:8080");

  socket.onopen = () => {
    console.log("Connected to server");
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onmessage = (event) => {
    console.log("Message received from server:", event.data);
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background.js:", message);
  console.log("Sender:", sender);

  if (message.action === "command") {
    console.log("Command received:", message.data);

    if (socket && socket.readyState === WebSocket.OPEN) {
      // Send the message data to the backend
      socket.send(JSON.stringify({ event: "message", data: message.data }));
      console.log("Command sent to backend via WebSocket");
    } else {
      console.error("WebSocket is not connected. Cannot send command.");
    }
  }

  return true; // Indicates asynchronous response
});

init();
