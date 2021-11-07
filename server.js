const express= require('express');
const http=require('http');
const socketio=require('socket.io');
const path=require('path');
const app = express();
const server = http.createServer(app);
const io=socketio(server);
const formatMessage=require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
  } = require('./utils/users');
app.use(express.static(path.join(__dirname,'public')))
const PORT = 3000 || process.env.PORT;

const appName="Chats"
io.on('connection',socket =>{
    socket.on('joinRoom',({username,room})=>{

        const user = userJoin(socket.id, username, room);

    socket.join(user.room);

        socket.to(user.room).emit('message',formatMessage(appName,'Welcome to Chat app WebSocket implementation'))
        socket.broadcast.to(user.room).emit('message',formatMessage(appName,` ${username} has joined the chat`));
    })


    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
    
        io.to(user.room).emit('message', formatMessage(user.username, msg));
      });
    
  

    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit(
              'message',
              formatMessage(appName, `${user.username} has left the chat`)
            );
      
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
              });}
    });
});




server.listen(PORT,() => {
    console.log(`running on ${PORT}`);
});


