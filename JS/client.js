const socket = io('http://localhost:3000');

// Get DOM elements in respective JS variables
const form = document.getElementById('sendBox');
const messageInput = document.getElementById('messageInput');
const messageContainer = document.querySelector(".messageContainer");
const memberList = document.querySelector(".memberList");

// Audio that will play on receiving messages
var audio = new Audio('JS/audio/ting.mp3');

// Functions which will append event info to the contaner

// Add messages to the container
const appendMessage = (message, boxType, boxPosition) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add(boxType);
    messageElement.classList.add(boxPosition);
    messageContainer.append(messageElement);
    if (boxPosition == 'left') {
        audio.play();
    }
}

// Add members name to the container when they joined the chat
const appendMember = (member, uniqueID) => {
    const memberElement = document.createElement('li');
    memberElement.innerText = member;
    memberElement.setAttribute('id', uniqueID);
    memberList.append(memberElement);
}

const removeMember = (uniqueID) => {
    const memberElement = document.getElementById(uniqueID);
    memberElement.remove();
}

// Ask new user for his/her name and let the server know
const user_name = prompt("Enter your name to join");

if (user_name != '' && user_name != null) {
    socket.emit('new-user-joined', user_name);
    appendMember(`${user_name}`); // You will see your name in member list

    // If a new user joins, receive his/her name from the server and then append the info to the container
    socket.on('user-joined', (user_name, socketID) => {
        appendMessage(`${user_name} joined the chat`, 'notificationBox', 'center');
        appendMember(`${user_name}`, `${socketID}`);  // Others will see your name in member list
        scrollToBottom();
    });

    // If server sends a message, receive it
    socket.on('receive', data => {
        appendMessage(`${data.name}: ${data.message}`, 'messageBox', 'left');
        scrollToBottom();
    });

    // If a user leaves the chat, append the info to the container
    socket.on('leave', (name, socketID) => {
        appendMessage(`${name} left the chat`, 'notificationBox', 'center');
        removeMember(`${socketID}`);
        scrollToBottom();
    });

    // If the form gets submitted, send server the message
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = messageInput.value;
        appendMessage(`You: ${message}`, 'messageBox', 'right');
        socket.emit('send', message);
        messageInput.value = '';
        scrollToBottom();
    });
}

else{
    appendMessage(`Please refresh this page and enter your correct name`, 'notificationBox', 'center');
    scrollToBottom();
}

// Automatically scroll to bottom
function scrollToBottom() {
    messageContainer.scrollTop = messageContainer.scrollHeight
}