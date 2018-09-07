const express = require('express');
const router = express.Router();

var path = require('path')

router.get('/', (req, res)=>{
    res.render('index.ejs', {
        data: {},
        errors: {},
        title: "Flochat | Home"
    })
})

router.get('/chat-room', (req, res)=>{
    res.render('chat.ejs', {
        data: {},
        errors: {},
        title: "Flochat | Home"
    })
})

module.exports = router
