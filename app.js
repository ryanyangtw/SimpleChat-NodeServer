var app = require('express')();
var http = require('http').Server(app);
var request = require('request');

// Initialize a new instance of socket.io by passing the http (the HTTP server) object
var io = require('socket.io')(http);
var port = process.env.PORT || 5000; // Use the port that Heroku provides or default to 5000  


// app.get('/', function(req, res) {
//   res.sendFile(__dirname + "/index.html")
// })


io.on('connection', function(socket) {
  console.log('a user connected');


  // io.emit = io.sockets.emit 會emit訊息給所有連上的socket
  //io.emit('message', 'Welcome to the most interesting');
  //socket.emit('message', 'Welcome to the most interesting')


  socket.on('disconnect', function() {
    console.log('a user disconnected');
  });

  /*
  socket.on('message', function(msg) {
    console.log('receive a message: ' + msg);
    io.emit('message', msg);
    //io.send(JSON.stringify({ message:'Welcome to the most interesting ' +
              //'chat room on earth!' }));
  });
  */


  socket.on('join_room', function(senderId, room_number) {
    socket.join(room_number);

    socket.senderId = senderId;

    console.log('a user join room number ' + room_number);

    socket.room = room_number;
    //io.sockets.in(room_number).emit('room_message', "100000", "Welcome come to room number: " + room_number)
    socket.emit('room_message', "100000", 'Welcome to room number ' + room_number);
    socket.broadcast.in(room_number).emit('room_message', "100000", "Somebody join this room. Room number: " + room_number);
    //io.sockets.in(room_number).broadcast.emit('room_message', "100000", "Somebody join this room. Room number: " + room_number);
  });

  socket.on('room_message', function(senderId, message) {
    
    var room_number = socket.room;
    console.log('receive a message: ' + message);
    console.log('room_number: ' + room_number);

    //var baseUrl = 'http://localhost:3000/api/v1';
    var baseUrl = 'https://simple-chat-rails-server.herokuapp.com/api/v1';
    var path = baseUrl + '/users/' + senderId + "/rooms/" + room_number + "/messages";

    request.post(path, {form: {content: message}}, function(error, response, body) {
      
      if(!error && response.statusCode == 201) {
        console.log("success to create message")
        io.in(room_number).emit('room_message', senderId, message);


        // Notification User
        var rooms = io.sockets.adapter.rooms[room_number];
        var roomMembers = [];
        if (rooms) {
          for (var id in rooms) {
            roomMembers.push(io.sockets.adapter.nsp.connected[id].senderId);
            console.log("fuck room");
            console.log(roomMembers);
            //console.log(s.senderId);
          }
        }


        path = baseUrl + '/rooms/' + room_number + '/notification'
        request.post(path, {form: {user_ids: roomMembers.toString()}}, function(error, response, body) {
      
          if(!error && response.statusCode == 201) {
            console.log("success to notification message")
            //io.in(room_number).emit('room_message', senderId, message);

          } else {
            console.log("error" + error)

          }
        });

      } else {
        console.log("error" + error)

      }
      //console.log(httpResponse);
      //console.log(body);

    });

    //var clients = io.sockets.clients('room_number'); 
    //console.log("clients" + clients );








    
    //socket.room = room_number
  });



  //socket.on()




  // socket.on('fuck', function(msg) {
  //   console.log("str:" + str);
  //   console.log("num: " + num);
  //   console.log("whatever: " + whatever);

  //   socket.emit('message', "YO", 3);
  // });

});


http.listen(port, function(){
  console.log('listening on *:' + port)
});