import apiKey from "./APIKey";

document.addEventListener("DOMContentLoaded", function () {
  // Get the current tab's URL using the chrome.tabs API
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentUrl = tabs[0].url;
    const currentUrlElement = document.getElementById("currentUrl");

    if (currentUrlElement) {
      currentUrlElement.textContent = currentUrl;
      currentUrlElement.href = currentUrl; // Make it a clickable link
    }
  });
});


document.addEventListener('DOMContentLoaded', function () {
    // Get the current tab's URL using the chrome.tabs API
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentUrl = tabs[0].url;
        const currentUrlElement = document.getElementById('currentUrl');

        if (currentUrlElement) {
            currentUrlElement.textContent = currentUrl;
            currentUrlElement.href = currentUrl; // Make it a clickable link

            // Add a click event listener to the "Generate" button
            document.getElementById("apiButton").addEventListener("click", function () {
                makeApiRequest(currentUrl); // Pass the current URL to the makeApiRequest function
            });
        }

        const downloadButtons = document.querySelectorAll(".downloadButton");
        downloadButtons.forEach((button, index) => {
            button.addEventListener("click", function () {
                downloadImage(index);
            });
        });
    });
});

// Function to make the API request
function makeApiRequest(currentUrl) {
    const loadingOverlay = document.getElementById("loadingOverlay");
     loadingOverlay.style.display = "block"; // Show the loading overlay
    // Define the API endpoint and request payload
    const apiUrl = "https://api.gooey.ai/v2/art-qr-code/";
    const requestData = {
        use_url_shortener: true,
        qr_code_data: currentUrl, // Use the current URL as qr_code_data
        text_prompt: "An analogue film still of an astronaut in a space suit walking on the busy streets of Mumbai, golden light on the astronaut, 4k\n"
    };

    // Send the API request
    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        // Update the QR code image and download link
        const qrCodeImage1 = document.getElementById("qrCodeImage1");
        const downloadLink1 = document.querySelector(".divClass a");
        qrCodeImage1.src = data.output.output_images[0]; // Update with the first image URL
        downloadLink1.href = data.output.output_images[0]; // Update with the first image URL

        // If you have multiple images, you can update other image elements here
        // Example for the second image:
        const qrCodeImage2 = document.getElementById("qrCodeImage2");
        const downloadLink2 = document.querySelectorAll(".divClass a")[1];
        qrCodeImage2.src = data.output.output_images[1]; // Update with the second image URL
        downloadLink2.href = data.output.output_images[1]; // Update with the second image URL

        loadingOverlay.style.display = "none";
    })
    .catch(error => {
        console.error("Error:", error);
        loadingOverlay.style.display = "none";
    });
}

function handleImageLoad(imageElement) {
  imageElement.onload = function () {
    // Hide the loading overlay once the image is loaded
    const loadingOverlay = document.getElementById("loadingOverlay");
    loadingOverlay.style.display = "none";
  };
}

// Call handleImageLoad for each image element
handleImageLoad(document.getElementById("qrCodeImage1"));
handleImageLoad(document.getElementById("qrCodeImage2"));
// Add more image elements as needed

function downloadImage(index) {
    const imageElement = document.getElementById(`qrCodeImage${index + 1}`);
    const imageUrl = imageElement.src;

    // Create an invisible anchor element for downloading
    const anchor = document.createElement('a');
    anchor.style.display = 'none';
    anchor.href = imageUrl;
    anchor.download = `image${index + 1}.png`; // Set the filename for the download

    // Append the anchor to the body and trigger the download
    document.body.appendChild(anchor);
    anchor.click();

    // Clean up by removing the anchor element
    document.body.removeChild(anchor);
}