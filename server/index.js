'use strict';

var websockets = require('websockets');
var express = require('express');

var entity = require('./entity.js');
var utils = require('./utils/utils.js');
var config = require('./config.js');
var expressHandler  = require('./expressHandler.js');
var websocketHandler = require('./websocketHandler.js');

var UnoGame = entity.UnoGame;
var UnoPlayer = entity.UnoPlayer;

global.config = config;
global.game_list = {};
global.player_list = {};
global.game_serialno_pool = [];

utils.generate_game_serial_no();

var express_server = express();
expressHandler(express_server);
express_server.listen(config.expressPort);

var websocket_server = websockets.createServer();
websocketHandler(websocket_server);
websocket_server.listen(config.websocketPort);

console.log(`Uno服务器正在运行在 web=${config.expressPort}, socket=${config.websocketPort} 端口上 ...`);


// test case
var playerA = new UnoPlayer('A');
var playerB = new UnoPlayer('B');
var playerC = new UnoPlayer('C');

console.log(playerA.userID);

global.player_list[playerA.userID] = playerA;
global.player_list[playerB.userID] = playerB;
global.player_list[playerC.userID] = playerC;

var game = new UnoGame(playerA);
global.game_list[game.gameID] = game;

game.playerJoin(playerA);
game.playerJoin(playerB);
game.playerJoin(playerC);

game.startGame();
