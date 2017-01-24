'use strict';

var utils = require('./utils/utils.js');

const GAME_PREPARE = 0;

const init_card_num_per_player = 7;

class UnoGame {

	constructor(player_num, master_player) {
		this.game_id = 'Game ' + global.game_serialno_pool.pop();
	  this.player_num = player_num;  // 玩家人数
	  this.player_list = []; // 玩家列表
	  this.card_in_hand = {}; // 玩家手牌列表
	  this.card_stack = utils.generateCardStack(); // 获得一副洗好的牌
	  this.master_player = master_player.userID; // 房主Token
	  this.game_status = GAME_PREPARE;
	}

	get gameID() {
		return this.game_id;
	}

	// 获取牌堆中目前剩余牌数
	get remainCardNumberInStack() {
		return this.card_stack.length;
	}

	// 从牌堆中取一些牌
	getSomeCardFromStack() {
		return this.card_stack.splice(0, num);
	}

	// 玩家加入游戏
	playerJoin(player) {  
		if(this.player_list.indexOf(player.userID)==-1) {  // 要加入的玩家不在游戏列表中
			this.player_list.push(player.userID);
		}
	}

	// 开局
	startGame() {
		if(this.player_list.length != this.player_num) return false;
		this._assignCardToPlayer();
	}

	// 初始发牌
	_assignCardToPlayer() {
		this.player_list.forEach(player_id=>{
			this.card_in_hand[player_id] = getSomeCardFromStack(init_card_num_per_player);
		})
	}

	// 获得某个玩家手中的手牌
	getPlayerCard(player) {
		return this.card_in_hand[player.userID];
	}
}

class UnoPlayer {

	constructor(username) {
		this.user_id = 'User '+utils.uuid();
		this.user_name = username;
		this.socket = undefined;
		this.score = 0;
	}

	get userID() {
		return this.user_id;
	}

	set socket(socket) {
		this.socket = socket;
	}

	get socket() {
		return this.socket;
	}
}

module.exports = {
	UnoGame,
	UnoPlayer
}