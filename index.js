const path = require('path');
const http = require('http')
const express = require('express');
const socketIO = require('socket.io')
const _ = require('lodash')
const routes = require('./routes');
const {messageObject, messageLocationObject, isString} = require('./public/js/utils.js')
const {Users} = require('./classes/users')

const port = process.env.PORT || 5001;

const app = express();

const server = http.createServer(app)

const io = socketIO(server)

const users = new Users()

const middleware = [
    express.static(path.join(__dirname, 'public'))
]

app.use(middleware)

app.use('/', routes);

io.on('connection', (socket)=>{

    socket.on('join', (params, callback)=>{

        // Check if the room so specified is a string or not
        if (!isString(params.name, params.room)) {
           return callback('Please provide your name and room name.')
        }

        let name = _.trim(params.name)
        let room = _.trim(params.room)

        // Join a room
        socket.join(room)

        // Remove the user from all the rooms first
        users.removeUser(socket.id)

        // Add the user to the users list
        users.addUser(socket.id, name, room)

        // Update the users list
        io.to(room).emit('updateUsersList', users.getUsersList(params.room))

        // Notify the new user 
        socket.emit('newMessage', messageObject("Admin", `Hi ${name}, Welcome to Flochat!`))

        // Notify rest users but the new user
        socket.broadcast.to(room).emit('newMessage', messageObject("Admin", `${name} has joined.`))
        
        // custom callback
        callback()
    })

    socket.on('disconnect', ()=>{
        let user = users.removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('updateUsersList', users.getUsersList(user.room))
            io.to(user.room).emit('newMessage', messageObject('Admin', `${user.name} has left.`))
        }
    })

    socket.on('createMessage', (message, callback)=>{
        var user = users.getUser(socket.id)

        if (user && isString(message.msg)) {
            io.to(user.room).emit('newMessage', messageObject(user.name, message.msg))            
        }

        callback()
    })

    // geo location
    socket.on('createLocationMesssage', (coords, callback)=> {
        var user = users.getUser(socket.id)

        if (user) {
            io.to(user.room).emit('newLocationMessage', messageLocationObject(user.name, coords.latitude, coords.longitude))    
        }

        callback() // You must pass a function as second arg in socket.emit() if callback is used here
    });

})

app.use((req, res,next)=>{
    res.status(404).send("Page Not Found");
  });
  
app.use((err, req, res, next)=>{
    console.log(err);
    res.status(500).send("Page Broke!");
});

server.listen(port, ()=>{
    console.log("Flochat app running on port "+port);
});