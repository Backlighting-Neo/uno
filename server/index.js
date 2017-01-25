'use strict';

const readline = require('readline');

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

// var express_server = express();
// expressHandler(express_server);

// var websocket_server = websockets.createServer({
// 	server: express_server
// })

// websocket_server.on('connect', socket=>{
// 	websocketHandler(socket);
// })


// websocket_server.listen(8083);
// console.log('Uno服务器正在运行 ...');


// test case
var playerA = new UnoPlayer('A');
var playerB = new UnoPlayer('B');
var playerC = new UnoPlayer('C');

var game = new UnoGame(3, playerA);

game.playerJoin(playerA);
game.playerJoin(playerB);
game.playerJoin(playerC);

game.startGame();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askToDiscard() {
	let player = game.currentPlayer;
	console.log('================================================');
	console.log(`玩家 ${player.user_name} 现在的手牌是 ${game.getPlayerCard(player).map(utils.convertCardToChinese).join('  ')}`);
	rl.question(`请玩家 ${player.user_name} 出牌`, (cardString) => {
		if(cardString == '抓牌') {
			game.activeAskToGetACard(player);
		}
		else {
			let card = utils.parseCard(cardString);
			if(card) game.discard(player, card);
		}

		console.log(`玩家 ${player.user_name} 现在的手牌是 ${game.getPlayerCard(player).map(utils.convertCardToChinese).join('  ')}`);
		askToDiscard();
	});
}

askToDiscard();