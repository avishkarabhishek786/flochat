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

module.exports = router
