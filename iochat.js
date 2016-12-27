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

function main() {
    server.listen(8000);

    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/index.html');
    });

    io.on('connection', function (socket) {
        console.log("new connection");
        socket.on("disconnect", function (data) {
            console.log("disconnect");
        });
        socket.on("login", function (data) {
            console.log("login : " + data);
        });
    });

}

main();

/************************************* END **************************************/
