var app = require('express')();
var http = require('http').Server(app);

// Initialize a new instance of socket.io by passing the http (the HTTP server) object
var io = require('socket.io')(http);
var port = process.env.PORT || 5000; // Use the port that Heroku provides or default to 5000  


// app.get('/', function(req, res) {
//   res.sendFile(__dirname + "/index.html")
// })


io.on('connection', function(socket) {
  console.log('a user connected');

  io.emit('message', 'Welcome to the most interesting');



  socket.on('disconnect', function() {
    console.log('a user disconnected');
  });

  socket.on('message', function(msg) {
    console.log('receive a message: ' + msg);
    io.emit('message', msg);
    //io.send(JSON.stringify({ message:'Welcome to the most interesting ' +
              //'chat room on earth!' }));
  });




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