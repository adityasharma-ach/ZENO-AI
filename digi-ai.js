const API_KEY = "AIzaSyA9KH3gtGnYYODGrHqzxJh1NZ0WZhWN9Og";
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

let typingIndicator;

// Format Gemini's Markdown-like response
function formatGeminiResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>');            // Italic
}

// Append user's message
function appendUserMessage(text) {
  const msg = document.createElement("div");
  msg.className = "message user-message";
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Show typing animation
function showTyping() {
  typingIndicator = document.createElement("div");
  typingIndicator.classList.add("message", "typing-indicator");

  // Add 3 animated dots
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div");
    dot.classList.add("typing-dot");
    typingIndicator.appendChild(dot);
  }

  chatBox.appendChild(typingIndicator);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTyping() {
  if (typingIndicator) {
    chatBox.removeChild(typingIndicator);
    typingIndicator = null;
  }
}

// Add bot (ZenoAI) response
function addBotMessage(messageText) {
  const message = document.createElement("div");
  message.className = "message bot-message";

  message.innerHTML = `
    <div class="bot-label">🤖 ZenoAI</div>
    <div class="bot-text">${formatGeminiResponse(messageText)}</div>
  `;

  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message to Gemini API
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendUserMessage(message);
  userInput.value = "";

  showTyping();

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: message }] }],
        }),
      }
    );

    const data = await response.json();
    hideTyping();

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "❌ Sorry, I couldn't understand that.";
    addBotMessage(reply);
  } catch (error) {
    hideTyping();
    addBotMessage("⚠️ There was an error. Please try again.");
    console.error("API error:", error);
  }
}

// Send on Enter key
userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});


document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'F12' || (e.ctrlKey && e.key === 'u')) {
    e.preventDefault();
  }
});


// ------------------------------------
 // Create the popup overlay
const popupOverlay = document.createElement("div");
popupOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    visibility: hidden;
    opacity: 0;
    z-index: 9999;
    transition: opacity 0.3s, visibility 0.3s;
`;

// Create the popup container
const popup = document.createElement("div");
popup.style.cssText = `
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    text-align: center;
    position: relative;
    width: 90%;
    max-width: 400px;
    padding: 15px;
    transform: scale(0);
    animation: scaleUp 0.5s ease-in-out forwards;
`;

// Create the image element
const img = document.createElement("img");
img.src = "/assets/image/post/zenoai.png"; // Replace with your advertisement image URL
img.alt = "Advertisement";
img.style.cssText = `
    width: 100%;
    border-radius: 5px;
`;

// Create the close button
const closeBtn = document.createElement("button");
closeBtn.innerHTML = "&times;";
closeBtn.style.cssText = `
    position: absolute;
    top: 5px;
    right: 5px;
    background: red;
    color: white;
    border: none;
    border-radius: 10px;
    
    
    font-size: 30px;
    cursor: pointer;
    
    transition: background 0.3s ease;
`;

// Add hover effect to the close button
closeBtn.addEventListener("mouseenter", () => {
  closeBtn.style.background = "darkred"; // Change background on hover
});
closeBtn.addEventListener("mouseleave", () => {
  closeBtn.style.background = "red"; // Revert background when not hovering
});

// Append the elements
popup.appendChild(closeBtn);
popup.appendChild(img);
popupOverlay.appendChild(popup);
document.body.appendChild(popupOverlay);

// Function to disable scrolling
const disableScroll = () => {
  document.body.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        overflow: hidden;
        width: 100%;
        height: 100%;
    `;
};

// Function to enable scrolling
const enableScroll = () => {
  document.body.style.cssText = ""; // Reset styles to default
};

// Function to hide the popup
const hidePopup = () => {
  popupOverlay.style.visibility = "hidden";
  popupOverlay.style.opacity = "0";
  enableScroll(); // Enable scrolling when the popup is closed
};

// Show the popup after a delay (10 seconds)
setTimeout(() => {
  popupOverlay.style.visibility = "visible";
  popupOverlay.style.opacity = "1";
  disableScroll(); // Disable scrolling when the popup appears

  // Set a timer to automatically close the popup after 8 seconds
  setTimeout(() => {
    hidePopup();
  }, 10000); // Close after 8 seconds
}, 100); // Show after 10 seconds

// Close the popup when the close button is clicked
closeBtn.addEventListener("click", () => {
  hidePopup();
});

// Optional: Close the popup if the overlay is clicked
popupOverlay.addEventListener("click", (event) => {
  if (event.target === popupOverlay) {
    hidePopup();
  }
});

// Add animations via JavaScript
const style = document.createElement("style");
style.innerHTML = `
    @keyframes scaleUp {
        from {
            transform: scale(0.8); /* Start smaller */
        }
        to {
            transform: scale(1); /* Scale to full size */
        }
    }
`;
document.head.appendChild(style);