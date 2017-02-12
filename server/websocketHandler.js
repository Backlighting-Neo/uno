var queryParser = require('query-string');

module.exports = function(websocket_server) {
	websocket_server.on('connect', socket=>{
		let params = queryParser.parse(socket._req.url.replace('/','')); // {gameID, userID}

		var player = global.player_list[params.userID];
		var game   = global.game_list[params.gameID];

		if(!player || !game) {
			socket.close();
			return;
		}

		if(player.socket) player.socket.close();

		global.player_list[params.userID].socket = socket;

		game.playerJoin(player);
		console.log(`用户[${params.userID}] 加入 游戏[${params.gameID}] Websocket 已连通`);

		socket.on('close', ()=>{
			game.playerSeparate(player);
			console.log(`用户[${params.userName}] 游戏[${params.gameID}] Websocket 已断线`);
			player.socket = undefined;
		})
	});
}