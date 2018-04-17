var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server, {pingInterval: 15000, pingTimeout: 30000});
var path = require("path");

app.use(express.static(__dirname + "/public"));

app.get("/", auth.auth, function(req, res, next) {
  res.sendFile(__dirname + "/public/index.html");
});

var port = process.env.PORT || 4400;
server.listen(port);
console.log("Server started on port", port);
