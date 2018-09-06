window.$ = window.jQuery = require('jquery');    
var bootstrap = require('bootstrap');

var socket = io();
//var socket = io.connect('http://localhost:5001');

function scrollToBottom() {
    var messages = $('#chat-ul');
    var newMessage = messages.children('li:last');
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessagesHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
  
    if(clientHeight + scrollTop + newMessagesHeight + lastMessageHeight >= scrollHeight) {
      messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', ()=>{
    console.log(`Connected to server`);
});

socket.on('disconnect', ()=>{
    console.log(`Disconnected from server`);
});

socket.on('newMessage', (msg)=>{
    console.log(msg);
    var li = $('<li></li>');
    li.text(`${msg.from} ${msg.createdAt}: ${msg.text}`);
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

socket.on('newLocationMessage', function(pos) {
    console.log("newLocationMessage", pos);
    $('#chat-ul').append(`<li>${pos.from} ${pos.createdAt}: <a href="${pos.map}" target="_blank">Google location</li>`);
   //scrollToBottom();
  });

$(document).on('click', '#geo-btn', function() {
    if (!navigator.geolocation){
      alert("Geolocation is not supported by your browser");
      return;
    }
    var btn = $(this);
    btn.attr('disabled', 'disabled').text('Sending...');
    navigator.geolocation.getCurrentPosition(function(position) {
      btn.removeAttr('disabled').text('Send location');
      var latitude  = position.coords.latitude;
      var longitude = position.coords.longitude;
  
      socket.emit('createLocationMesssage', {
        latitude,
        longitude
      }, function(res) {  // You must add this function if callback is specified in socket.on()
        console.log("Response from server: ", res);
      });
  
    }, function(e) {
      alert("Unable to fetch location.");
      btn.removeAttr('disabled').text('Send location');
    });
  
  });

