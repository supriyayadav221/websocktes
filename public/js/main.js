const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const {username, room}= Qs.parse(location.search,{
    ignoreQueryPrefix:true
});


const socket = io();
socket.emit('joinRoom',{username,room});
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);
  chatMessages.scrollTop=chatMessages.scrollHeight;

 });

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let msg = e.target.elements.msg.value;

  msg = msg.trim();


  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});


function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
  <p class="text">${message.text}</p>`

  document.querySelector('.chat-messages').appendChild(div);
}



document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});