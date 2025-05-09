let startX, startY, endX, endY;
let selectionBox;

document.addEventListener("mousedown", async (e) => {
  // Create a selection box
  startX = e.pageX;
  startY = e.pageY;

  selectionBox = document.createElement("div");
  selectionBox.style.position = "absolute";
  selectionBox.style.border = "2px dashed red";
  selectionBox.style.zIndex = "10000";
  selectionBox.style.left = `${startX}px`;
  selectionBox.style.top = `${startY}px`;
  document.body.appendChild(selectionBox);

  document.addEventListener("mousemove", resizeSelectionBox);
});

document.addEventListener("mouseup", (e) => {
  document.removeEventListener("mousemove", resizeSelectionBox);

  endX = e.pageX;
  endY = e.pageY;

  // Take the screenshot of the selected area
  const screenshot = chrome.runtime.sendMessage(chrome.runtime.id, {
    action: "captureSelectedArea",
    startX,
    startY,
    width: endX - startX,
    height: endY - startY,
  });

  console.log(screenshot);

  // Remove the selection box
  document.body.removeChild(selectionBox);
});

function resizeSelectionBox(e) {
  selectionBox.style.width = `${e.pageX - startX}px`;
  selectionBox.style.height = `${e.pageY - startY}px`;
}
