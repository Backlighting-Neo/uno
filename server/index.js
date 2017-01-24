'use strict';

var websockets = require('websockets');
var express = require('express');

var entity = require('./entity.js');
var utils = require('./utils/utils.js');
var websocketHandler = require('./websocketHandler.js');
var expressHandler  = require('./expressHandler.js');

var UnoGame = entity.UnoGame;
var UnoPlayer = entity.UnoPlayer;



global.game_list = {};
global.player_list = {};
global.game_serialno_pool = [];

utils.generate_game_serial_no();

var express_server = express();
expressHandler(express_server);

var websocket_server = websockets.createServer({
	server: express_server
})

websocket_server.on('connect', socket=>{
	websocketHandler(socket);
})


websocket_server.listen(8083);
console.log('Uno服务器正在运行 ...');
