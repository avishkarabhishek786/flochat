const path = require('path');
const http = require('http')
const express = require('express');
const socketIO = require('socket.io')
const routes = require('./routes');

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

    socket.emit('newUser', {
        from: "Admin",
        text: "Welcome to FLOChat"
    })

    socket.broadcast.emit('newUser', {
        from: "Admin",
        text: "New User joined"
    })

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