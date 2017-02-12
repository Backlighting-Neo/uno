var cors = require('cors');
var bodyParser = require('body-parser');
var logger = require('express_logger');

var entity = require('./entity.js');

var UnoGame = entity.UnoGame;
var UnoPlayer = entity.UnoPlayer;

module.exports = function(express_server) {
	express_server.use(cors());
	express_server.use(bodyParser.json());
	express_server.use(logger('detailed'));
	
	express_server.all('*', (req, res, next)=>{
		if(req.headers.game) {
			let gameID = req.headers.game;
			if(!global.game_list[gameID]) {
				res.status(500)
				.send({
					error: 'no game'
				});
				return;
			}
		}
		if(req.headers.token) {
			let token  = req.headers.token;
			if(!global.player_list[token]) {
				res.status(401)
				.send({
					error: 'no player'
				});
				return;
			}
		}
		next();
	})

	// 创建游戏
	express_server.get('/uno/game/create', (req, res)=>{
		if(!req.headers.token || !global.player_list[req.headers.token]) {
			res.status(500)
			.send({
				error: 'token错误'
			});
			return false;
		}

		let user = global.player_list[req.headers.token];

		let game = new UnoGame(user);
		let gameID = game.gameID;
		global.game_list[gameID] = game;

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

	// 查询某个游戏房间状态
	express_server.get('/uno/game/exist_room', (req, res)=>{
		let game = global.game_list[req.query.game_id];
		res.status(200).send({
			exist: !!game,
			num: game?game.player_list.length:-1,
			status: game?game.game_status:-1 // 0准备 1游戏中
		})
	})

	// 检验Token
	express_server.get('/uno/game/exist_token', (req, res)=>{
		res.status(200).send({exist: !!global.player_list[req.headers.token]})
	})

	express_server.get('/uno/game/start', (req, res)=>{
		var gameID = req.headers.game;
		var token  = req.headers.token;

		var game = global.game_list[gameID];
		var player = global.player_list[token];

		game.startGame(player);

		res.status(200)
		.send({
			action: {
				type: 'start'
			},
			status: game.getStatus(player)
		})
	})

	// 开局
	express_server.get('/uno/game/status', (req, res)=>{
		var gameID = req.headers.game;
		var token  = req.headers.token;

		var game = global.game_list[gameID];
		var player = global.player_list[token];

		if(!game) {
			res.send({
				error: '没有对应的游戏房间'
			})
			return;			
		}

		res.status(200)
		.send({
			status: game.getStatus(player)
		})
	})

	express_server.get('/uno/game/request_a_card', (req, res)=>{
		var gameID = req.headers.game;
		var token  = req.headers.token;

		var game = global.game_list[gameID];
		var player = global.player_list[token];

		let cards = [].concat(game.activeAskToGetACard(player));

		game.broadcaseStatus(player);
		
		res.status(200)
		.send({
			cards,
			status: game.getStatus(player)
		});
	})

	express_server.post('/uno/game/discard', (req, res)=>{
		var gameID = req.headers.game;
		var token  = req.headers.token;

		var game = global.game_list[gameID];
		var player = global.player_list[token];

		let card = req.body.card;

		game.discard(player, card);

		game.broadcaseStatus(player);

		res.status(200)
		.send({
			status: game.getStatus(player)
		});
	})
}