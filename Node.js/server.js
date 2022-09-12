// Node server which will handle socket io connections

const { createServer } = require("http");
const httpServer = createServer();

const users = [];

const io = require("socket.io")(httpServer,
    {
        cors: {
            origin: "*"
        }
    });

io.on('connection', socket => {
    // If any new user joins, let the other users connected to the server know about it
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', users[socket.id], socket.id);
    });

    // If someone sends a message, broadcast it to other people
    socket.on('send', message => {
        socket.broadcast.emit('receive', { name: users[socket.id], message: message })
    });

    // If someone leaves the chat, let others know about it
    socket.on('disconnect', message => {
        socket.broadcast.emit('leave', users[socket.id], socket.id);
        delete users[socket.id];
    });

});

httpServer.listen(3000);



