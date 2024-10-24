>>> mkdir chatbox-project
>>> cd chatbox-project
>>> npm init -y
//---------------------------------------------------------------


>>> npm install express socket.io
//----------------------------------------------------------------------

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
    res.send('<button id="contactUs">Contact Us</button><div id="chatbox"></div>');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('message', (message) => {
        io.emit('message', message);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
//-----------------------------------------------------------------------------------


<!DOCTYPE html>
<html>
<head>
    <title>Chatbox</title>
    <script src="/socket.io/socket.io.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const contactUsButton = document.getElementById('contactUs');
            const chatbox = document.getElementById('chatbox');
            const socket = io();

            contactUsButton.addEventListener('click', () => {
                chatbox.style.display = 'block';
            });

            chatbox.innerHTML = '<input type="text" id="messageInput" placeholder="Type your message here"><button id="sendMessage">Send</button>';
            const sendMessageButton = document.getElementById('sendMessage');
            const messageInput = document.getElementById('messageInput');

            sendMessageButton.addEventListener('click', () => {
                const message = messageInput.value;
                socket.emit('message', message);
                messageInput.value = '';
            });

            socket.on('message', (message) => {
                const messageElement = document.createElement('div');
                messageElement.textContent = message;
                chatbox.appendChild(messageElement);
            });
        });
    </script>
</head>
<body>
    <div id="app"></div>
</body>
</html>


//--------------------------------------------------------------------------------------------------------------
>>> node server.js
