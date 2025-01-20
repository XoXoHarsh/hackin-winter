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

const initializeWebSocket = (data1) => {
  socket = new WebSocket(data1.url);

  socket.onopen = () => {
    console.log("WebSocket connected");
    updateMessageBox("WebSocket connected");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("data.............", data);

    let lang_key = "";

    chrome.storage.local.get(["language"], (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error retrieving language:", chrome.runtime.lastError);
      } else {
        lang_key = (result?.language || "english").toLowerCase();
        console.log("lang Key............", lang_key);
        if (data && data.status === "success") {
          if (data.type === "translation") {
            data1.flag = false;
            if (lang_key === "english") {
              updateMessageBox(data.data.english);
            } else {
              updateMessageBox(data.data.hindi);
            }
          } else if (data.type === "command") {
            console.log("Command received:", data.data);
          }
        } else {
          updateMessageBox("Error: " + (data.message || "Unknown error"));
        }
        data1.flag = false;
      }
    });
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

const sendMessage = (message, html) => {
  chrome.storage.local.get(["language"], (result) => {
    if (chrome.runtime.lastError) {
      console.error("Error retrieving language:", chrome.runtime.lastError);
    } else {
      console.log("result................", result);
      const lang = result.language || "default_language";
      console.log("Retrieved saved language:", lang);

      if (socket && socket.readyState === WebSocket.OPEN) {
        const messageToSend = JSON.stringify({
          text: message,
          language: lang,
          html,
        });
        socket.send(messageToSend);
        const messag = JSON.parse(messageToSend);
        console.log("Message sent:", messag.text, messag.language);
      } else {
        console.warn("WebSocket is not open. Cannot send message:", message);
      }
    }
  });
};

export default sendMessage;
export { showResponseBox, initializeWebSocket };
