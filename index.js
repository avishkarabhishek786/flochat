const path = require('path');
const http = require('http')
const express = require('express');
const socketIO = require('socket.io')
const _ = require('lodash')
const routes = require('./routes');
let {messageObject, messageLocationObject, isString} = require('./public/js/utils.js')

const port = process.env.PORT || 5001;

const app = express();

const server = http.createServer(app)

const io = socketIO(server)

const middleware = [
    express.static(path.join(__dirname, 'public'))
]

app.use(middleware)

app.use('/', routes);

io.on('connection', (socket)=>{
    console.log(`New user connected`);

    socket.on('disconnect', ()=>{
        console.log(`User was disconnected.`);
    })

    socket.on('join', (params, callback)=>{

        // Check if the room so specified is a string or not
        if (!isString(params.name, params.room)) {
            callback('Please provide your name and room name.')
        }

        let name = _.trim(params.name)
        let room = _.trim(params.room)

        // Join a room
        socket.join(room)

        // Notify the new user 
        socket.emit('newMessage', messageObject("Admin", `Hi ${name}, Welcome to Flochat!`))

        // Notify rest users but the new user
        socket.broadcast.to(room).emit('newMessage', messageObject("Admin", `${name} has joined.`))
        
        // custom callback
        callback()
    })

    socket.on('createMessage', (message, callback)=>{
        io.emit('newMessage', 
        messageObject(message.from, message.msg),
        callback('This is form the server.')
    )})

    // geo location
    socket.on('createLocationMesssage', (coords, callback)=> {
        io.emit('newLocationMessage', messageLocationObject('Admin', coords.latitude, coords.longitude))
        callback("Location cordinates delivered.") // You must pass a function as second arg in socket.emit() if callback is used here
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