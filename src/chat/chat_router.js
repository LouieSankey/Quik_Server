const express = require('express')
const ChatService = require('./chat_service')
const chatRouter = express.Router()

chatRouter
  .route('/room_id/:room_id')
  .all((req, res, next) => {
    ChatService.getMessages(
      req.app.get('db'),
      req.params.room_id
    )
      .then(messages => {
        if (!messages) {
          return res.status(404).json({
            error: { message: `messages don't exist` }
          })
        }
        res.messages = messages 
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
   res.json(res.messages)
})
//insert into db happens through socket.io in server.js 

module.exports = chatRouter
