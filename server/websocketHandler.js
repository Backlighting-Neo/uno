// 注册玩家到游戏
function registerUserToGame(socket, message) {
	let userid = message.userid;
	let gameid = message.gameid;
	let messageid = message.id;

	if(!userid || !gameid 
		|| !global.game_list[gameid]
		|| !global.player_list[userid]) {

		socket.send(JSON.stringify({
			messageid,
			error: '注册失败'
		}));
		return;
	}

	var player = global.player_list[userid];
	var game   = global.game_list[gameid];

	socket.player = player;
	socket.game = game;

	player.socket = socket;
	game.playerJoin(player);
}

function messageRouter(socket, message) {
	switch(message.type) {
		case 'register': registerUserToGame(socket, message); break;
		case ''
	}
}

module.exports = function(socket) {
	socket.on('message', message=>{
		websocketHandler(socket, message);
	});
	socket.on()
}