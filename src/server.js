const ChatService = require('./chat/chat_service')
const app = require('./app')
const knex = require('knex')
var https = require('https');
var fs = require('fs');



const { PORT, DATABASE_URL } = require('./config')

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
})

app.set('db', db)

// var server = https.createServer({
//   key: fs.readFileSync('../key.pem'),
//   cert: fs.readFileSync('../cert.pem'),
//   // ca: fs.readFileSync(/*full path to your intermediate cert*/),
//   requestCert: true,
//   rejectUnauthorized: false
// },app);

var server = require('http').Server(app);

var io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});



app.listen(PORT, () => {
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