const socket = io();
let username = '';

document.getElementById('username-form').addEventListener('submit', (e) => {
  e.preventDefault();
  username = document.getElementById('username-input').value.trim();
  if (username) {
    document.getElementById('login').style.display = 'none';
    document.getElementById('chat').style.display = 'block';
  }
});

document.getElementById('send-button').addEventListener('click', () => {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('chat message', { username, message });  // Send username and message to server
    messageInput.value = '';  // Clear input field
  }
});

socket.on('chat message', (data) => {
  const messageList = document.getElementById('message-list');
  const messageElement = document.createElement('li');
  messageElement.className = `message ${data.username === username ? 'sent' : 'received'}`;

  // Display username and message with proper spacing
  messageElement.innerHTML = `<strong>${data.username}</strong>: ${data.message}`;
  messageList.appendChild(messageElement);

  // Scroll to the bottom of the message list
  messageList.scrollTop = messageList.scrollHeight;
});
