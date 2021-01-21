const ChatService = require('./chat/chat_service')
const app = require('./app')
const knex = require('knex')

const { PORT, DATABASE_URL } = require('./config')

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
  ssl=true
})

app.set('db', db)

//origin here will have to be changed for Heroku, I think
var server = require('http').Server(app);
var io = require('socket.io')(server, {
  cors: {
    origin: "https://quik.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
  }
});

server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})

io.on('connection', function (socket) {

  socket.on('chat message', function (msgInfo) {
    io.emit('chat message ' + msgInfo.room_id, msgInfo);

    const message = {
      'room_id': msgInfo.room_id,
      'username': msgInfo.username,
      'msg': msgInfo.msg
    }
    ChatService.insertMessage(db, message).catch(error => console.log(error))
  });

  socket.on('request', function (params) {
    io.emit('request ' + params.room_id, params);
  });

  socket.on('disconnect', function () {

  });

});