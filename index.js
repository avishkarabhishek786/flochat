const path = require('path');
const http = require('http')
const express = require('express');
const socketIO = require('socket.io')
const routes = require('./routes');
let {messageObject, messageLocationObject} = require('./public/js/utils.js')

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

    socket.emit('newMessage', messageObject("Admin", "Hi there, Welcome to Flochat!"))

    socket.broadcast.emit('newMessage', messageObject("Admin", "New User joined"))

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