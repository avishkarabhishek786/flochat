var moment = require('moment')

let messageObject = (from, text)=>{
  return {
    from,
    text,
    //createdAt: moment().format('MMMM Do YYYY, h:mm:ss')
    createdAt: moment().format('h:mm a')
  }
}

let messageLocationObject = (from, lat, long)=>{
  return {
    from,
    map: `https://www.google.co.in/maps/place/${lat},${long}`,
    createdAt: moment().format('h:mm a')
    //createdAt: moment().format('MMMM Do YYYY, h:mm:ss')
  }
}

var isString = (str)=>{
    return typeof str === 'string' && str.trim().length > 0;
}
  

module.exports = {messageObject, messageLocationObject, isString}
