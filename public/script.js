const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
 
form.addEventListener('submit', async function (e) {
  e.preventDefault();
 
  const userMessage = input.value.trim();
  if (!userMessage) return;
 
  appendMessage('user', userMessage);
  input.value = '';
 
  // Show a temporary "Thinking..." message and get a reference to the element
  const thinkingMsgElement = appendMessage('bot', 'Thinking...');
 
  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversation: [{ role: 'user', message: userMessage }],
      }),
    });
 
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
 
    const res = await response.json();
    console.log (res);
    
    if (res && res.data) {
      // Update the "Thinking..." message with the actual AI response
      thinkingMsgElement.textContent = res.data;
    } else {
      // Handle cases where the response is ok, but there's no result
      thinkingMsgElement.textContent = 'Sorry, no response received.';
    }
  } catch (error) {
    console.error('Error fetching chat response:', error);
    // Handle network errors or failed requests
    thinkingMsgElement.textContent = 'Failed to get response from server.';
  }
});
 
/**
 * Appends a new message to the chat box.
 * @param {string} sender - The sender of the message ('user' or 'bot').
 * @param {string} text - The content of the message.
 * @returns {HTMLElement} The newly created message element.
 */
function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  // Scroll to the bottom of the chat box to show the latest message
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg; // Return the element to allow for later modification
}
