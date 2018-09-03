var socket = io();
//var socket = io.connect('http://localhost:5001');

socket.on('connect', ()=>{
    console.log(`Connected to server`);
});

socket.on('newUser', (data)=>{
    console.log(`New user`, data)
})

socket.on('disconnect', ()=>{
    console.log(`Disconnected from server`);
});

