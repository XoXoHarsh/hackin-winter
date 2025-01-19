let socket;
let floatingBox;

const showResponseBox = (message) => {
  floatingBox = document.createElement("div");

  Object.assign(floatingBox.style, {
    position: "fixed",
    bottom: "0",
    left: "0",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    padding: "15px",
    textAlign: "center",
    zIndex: "9999",
    fontFamily: "Arial, sans-serif",
  });

  floatingBox.textContent = message;

  document.body.appendChild(floatingBox);

  return floatingBox;
};

const initializeWebSocket = (url) => {
  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("WebSocket connected");
    updateMessageBox("WebSocket connected");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data && data.status === "success") {
      updateMessageBox(data.data);
    } else {
      updateMessageBox("Error: " + (data.message || "Unknown error"));
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    updateMessageBox("WebSocket error: " + error.message);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
    updateMessageBox("WebSocket connection closed");
  };
};

const updateMessageBox = (newMessage) => {
  if (floatingBox) {
    floatingBox.textContent = newMessage;
  }
};

const sendMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
    console.log("Message sent:", message);
  } else {
    console.warn("WebSocket is not open. Cannot send message:", message);
  }
};

window.onload = () => {
  showResponseBox("Connecting to WebSocket...");

  initializeWebSocket("ws://localhost:8000/ws");
};

export default sendMessage;
export { showResponseBox };
