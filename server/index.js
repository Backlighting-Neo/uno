'use strict';

const readline = require('readline');

var websockets = require('websockets');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var queryParser = require('query-string');

var entity = require('./entity.js');
var utils = require('./utils/utils.js');
// var websocketHandler = require('./websocketHandler.js');
var expressHandler  = require('./expressHandler.js');

var UnoGame = entity.UnoGame;
var UnoPlayer = entity.UnoPlayer;

global.game_list = {};
global.player_list = {};
global.game_serialno_pool = [];

utils.generate_game_serial_no();

var express_server = express();
express_server.use(cors());
express_server.use(bodyParser.json());
expressHandler(express_server);
express_server.listen(8083);

var websocket_server = websockets.createServer()
websocket_server.on('connect', socket=>{
	let params = queryParser.parse(socket._req.url.replace('/','')); // {gameID, userID}

	if(global.player_list[params.userID].socket)
		global.player_list[params.userID].socket.close();

	global.player_list[params.userID].socket = socket;
	console.log(`用户 [${params.userID}] Websocket 已连通`);
})
websocket_server.listen(8084);
console.log(`Uno服务器正在运行在 web=8083, socket=8084 端口上 ...`);


// test case
var playerA = new UnoPlayer('A');
var playerB = new UnoPlayer('B');
var playerC = new UnoPlayer('C');

global.player_list[playerA.userID] = playerA;
global.player_list[playerB.userID] = playerB;
global.player_list[playerC.userID] = playerC;

var game = new UnoGame(3, playerA);
global.game_list[game.gameID] = game;

game.playerJoin(playerA);
game.playerJoin(playerB);
game.playerJoin(playerC);

game.startGame();
