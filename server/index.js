'use strict';

var websockets = require('websockets');
var express = require('express');

var entity = require('./entity.js');
var utils = require('./utils/utils.js');
var websocketHandler = require('./websocketHandler.js');

var UnoGame = entity.UnoGame;
var UnoPlayer = entity.UnoPlayer;



global.game_list = {};
global.player_list = {};

var express_server = express();
// 创建游戏
express_server.get('/uno/game/create', (req, res)=>{
	if(!req.query.player_num || isNaN(req.query.player_num)) {
		res.status(500)
		.send({
			error: '人数不确定'
		});
		return false;
	}

	if(!req.headers.token || !global.player_list[req.headers.token]) {
		res.status(500)
		.send({
			error: 'token错误'
		});
		return false;
	}

	let user = global.player_list[req.headers.token];

	let game = new UnoGame(parseInt(req.query.player_num), user);
	let gameID = game.gameID;
	global.game_list[gameID] = game;

	console.log(`创建游戏 人数${req.query.player_num}人 ${gameID}`);
	res.status(200).send({gameID})
})
// 注册
express_server.get('/uno/game/register', (req, res)=>{
	if(!req.query.player_name) {
		res.status(500)
		.send({
			error: '需要用户名'
		});
		return false;
	}

	let user = new UnoPlayer(req.query.player_name);
	let userID = user.userID;
	global.player_list[userID] = user;

	console.log(`用户登陆 [${req.query.player_name}] ${userID}`);
	res.status(200).send({token: userID});
})



var websocket_server = websockets.createServer({
	server: express_server
})

websocket_server.on('connect', socket=>{
	socket.on('message', message=>{
		websocketHandler(socket, message);
	})
})


websocket_server.listen(8083);
console.log('Uno Server Start ...');
