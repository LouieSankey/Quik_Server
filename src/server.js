const ChatService = require('./chat/chat_service')
const app = require('./app')
const knex = require('knex')
var fs = require('fs');
var https = require('https');

const { PORT, DATABASE_URL } = require('./config')

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
})

app.set('db', db)

var options = {
  key: fs.readFileSync('./file.pem'),
  cert: fs.readFileSync('./file.crt')
};

var server = https.createServer(options, app);
var io = require('socket.io')(server, {
  cors: {
    origin: "https://quik.vercel.app/quik",
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