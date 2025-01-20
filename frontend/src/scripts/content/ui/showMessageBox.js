export const showMessageBox = (message) => {
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
    height: "50px",
    fontSize: "2rem",
  });

  // Set the message text
  floatingBox.textContent = message;

  // Add the box to the page
  document.body.appendChild(floatingBox);

  return floatingBox;
};
