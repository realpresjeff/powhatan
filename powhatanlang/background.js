chrome.runtime.onMessage.addListener((id, message, sender, sendResponse) => {
  console.log(id);

  if (message.action === "captureSelectedArea") {
    const { startX, startY, width, height } = message;

    // Capture the visible part of the tab
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error capturing the tab:",
          chrome.runtime.lastError.message
        );
        return;
      }

      // Create an image from the captured screenshot
      const image = new Image();
      image.src = dataUrl;

      image.onload = () => {
        // Create a canvas to crop the selected area
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        // Draw only the selected area on the canvas
        ctx.drawImage(
          image,
          startX,
          startY,
          width,
          height,
          0,
          0,
          width,
          height
        );

        // Get the cropped image as a Data URL
        const croppedImageDataUrl = canvas.toDataURL();

        // Send the cropped image to the server
        postImageToServer(croppedImageDataUrl);
      };

      image.onerror = () => {
        console.error("Error loading captured image");
      };
    });
  }
});

chrome.browserAction.onClicked.addListener(() => {
  chrome.windows.create({
    url: "./public/index.html", // This is the URL of the page you want to load in the side panel
    type: "popup", // Use 'popup' for older Chrome versions or 'normal' if 'panel' is not supported
    width: 400,
    height: 800,
  });
});

function postImageToServer(imageDataUrl) {
  fetch("/api/image", {
    method: "POST",
    body: JSON.stringify({ image: imageDataUrl }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Image uploaded successfully:", data);
    })
    .catch((error) => {
      console.error("Error uploading the image:", error);
    });
}
