/*
 *********************************************************************************
 *                     Copyright (C) 2016 wystan
 *
 *       filename: iochat.js
 *    description: 
 *        created: 2016-12-27 13:37:15
 *         author: wystan
 *
 *********************************************************************************
 */

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var clients = {};

function main() {
    server.listen(8000);

    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/index.html');
    });
    app.get('/libs/:file', function (req, res) {
        res.sendFile(__dirname + '/libs/' + req.params["file"]);
    });

    io.on('connection', function (socket) {

        function refreshClients() {
            var users = [];
            for (var v in clients) {
                users.push(v);
            }

            io.emit("users", users);
        }

        socket.on("disconnect", function (data) {
            if (socket.nick) {
                console.log("delete " + socket.nick);
                delete clients[socket.nick];
                delete socket.nick;
            }
        });
        socket.on("login", function (data, cb) {
            if (socket.nick) {
                cb(false);
                console.log("already login by " + socket.nick);
                return;
            }
            if (!(data in clients)) {
                clients[data] = socket;
                socket.nick = data;
                refreshClients();
            }
            cb(true);
        });

        socket.on("message", function (data) {
            io.emit("message", data);
        });

        socket.on("message_to", function (data, cb) {
            if (data.user in clients) {
                cb(true);
                clients[data.user].emit("message", data.message);
            } else {
                cb(false);
            }
        });
    });

}

main();

/************************************* END **************************************/
