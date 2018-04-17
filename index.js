var express = require("express");
var app = express();
var stream= require('stream');
var docker = new (require("dockerode"))();
var server = require("http").createServer(app);
var uuid = require("uuid/v4");
var io = require("socket.io")(server, {
  pingInterval: 15000,
  pingTimeout: 30000
});
var path = require("path");
var fs = require("fs");

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res, next) {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", function(socket) {
  console.log("a user connected");

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  socket.on("run", function(data) {
    // ask client to clean ouput
    socket.emit("output.clean");

    // first temporarily store file
    var id = uuid();
    var dir = "/tmp/" + id;
    var filename = "input.rho";
    fs.mkdir(dir, 0o777, function() {
      fs.writeFile(dir + "/" + filename, data.body, "utf8", function() {
        // run docker
        var image = "rchain/rnode:" + (data.version || "latest");
        var ss = new stream.Writable({
          write(chunk, encoding, callback) {
            console.log('output: ' + chunk.toString('utf8'))
          }
        });
        docker
          .run(image, ["--eval", "/tmp/" + filename], ss, {
            Binds: [dir + ':/tmp']
          })
          .then(function(container) {
            console.log(container.output);
            return container.remove();
          })
          .then(function(data) {
            console.log("container removed");
          })
          .catch(function(err) {
            console.log(err);
          });
      });
    });
  });
});

var port = process.env.PORT || 80;
server.listen(port);
console.log("Server started on port", port);
