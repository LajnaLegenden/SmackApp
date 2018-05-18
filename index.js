const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const path = require('path');

var users = [];
var connectedUsers = [];

server.listen(process.env.PORT || 80);
console.log('Server started...')

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/sendSmack', function(req,res){
    res.sendFile(__dirname + '/send.html');
});

app.get('/getSmacked', function(req,res){
    res.sendFile(__dirname + '/getSmacked.html');
}); 

io.sockets.on('connection', function (socket) {
    connectedUsers.push(socket);
    console.log(`Connected: ${connectedUsers.length} clients`);

    socket.on('disconnect', function (data) {
        connectedUsers.splice(connectedUsers.indexOf(socket), 1);
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        console.log(`Connected: ${connectedUsers.length} clients`);

    });

    socket.on('send message', function (data) {
        io.sockets.emit('new message', {
            msg: data,
            user: socket.username
        });
    });

    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames(){
        for(i=0; i<users.length; i++){
            console.log(users[i]);
        }
        io.sockets.emit('get users', {data: users});
    }

});