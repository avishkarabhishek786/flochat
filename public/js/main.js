window.$ = window.jQuery = require('jquery');    
var bootstrap = require('bootstrap');

var socket = io();
//var socket = io.connect('http://localhost:5001');

socket.on('connect', ()=>{
    console.log(`Connected to server`);
});

socket.on('disconnect', ()=>{
    console.log(`Disconnected from server`);
});

socket.on('newMessage', (msg)=>{
    var li = $('<li></li>');
    li.text(`${msg.from}: ${msg.msg}`);
    $("#chat-ul").append(li);
});

$(document).on('click', '#btn-chat', function(e) {

    e.preventDefault();
    var textbox = $('#text-msg');
    var text = textbox.val();
    
    socket.emit('createMessage', {
        from: 'ChatUser',
        msg: text
    }, function(res) {
        console.log("Response from server: ", res);
        textbox.val('');
    });
});

