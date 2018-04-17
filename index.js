var express = require("express");
var app = express();
var stream = require("stream");
const { StringDecoder } = require("string_decoder");
var docker = new (require("dockerode"))();
var server = require("http").createServer(app);
var uuid = require("uuid/v4");
var io = require("socket.io")(server, {
  pingInterval: 15000,
  pingTimeout: 30000
});
var path = require("path");
var fs = require("fs");

class StringWritable extends stream.Writable {
  constructor(cb) {
    super();
    this.cb = cb;
    const state = this._writableState;
    this._decoder = new StringDecoder(state.defaultEncoding);
    this.data = "";
  }
  _write(chunk, encoding, callback) {
    if (encoding === "buffer") {
      chunk = this._decoder.write(chunk);
    }
    this.cb(chunk);
    this.data += chunk;
    callback();
  }
  _final(callback) {
    var chunk = this._decoder.end();
    this.cb(chunk);
    this.data += chunk;
    callback();
  }
}

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
        var ss = new StringWritable(chunk => {
          socket.emit("output.append", chunk);
        });
        docker
          .run(image, ["--eval", "/tmp/" + filename], ss, {
            Binds: [dir + ":/tmp"]
          })
          .then(function(container) {
            socket.emit("output.done");
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
