'use strict';

var utils = require('./utils/utils.js');

const GAME_PREPARE = 0;

const GAME_DIRECTION_NORAML = 0;
const GAME_DIRECTION_REVERSE = 1;

const init_card_num_per_player = 7;

class UnoGame {

	constructor(player_num, master_player) {
		// this.game_id = 'Game ' + global.game_serialno_pool.pop();
		this.game_id = '123';
	  this.player_num = player_num;  // 玩家人数
	  this.player_list = []; // 玩家列表
	  this.card_in_hand = {}; // 玩家手牌列表
	  this.card_stack = utils.generateCardStack(); // 获得一副洗好的牌
	  this.master_player = master_player.userID; // 房主Token

	  this.game_direction = GAME_DIRECTION_NORAML;  // 游戏出牌方向

	  this.game_status = GAME_PREPARE;

	  this.last_card = undefined;

	  this.next_discard_player = master_player;

	  this._index = 0; // 出牌序次

	  this.card_has_been_discarded = [];  // 已打出的牌

	  this.game_discard_log = []; // 游戏出牌日志

	  console.log(`创建游戏成功 人数${this.player_num}人 ${this.game_id}`);
	}

	get gameID() {
		return this.game_id;
	}

	// 获取牌堆中目前剩余牌数
	get remainCardNumberInStack() {
		return this.card_stack.length;
	}

	_log(str) {
		console.log(`[${this.gameID}] ${str}`);
	}

	// 从牌堆中取一些牌
	getSomeCardFromStack(num) {
		this._log(`牌堆剩余 ${this.remainCardNumberInStack-num}张`);
		return this.card_stack.splice(0, num);
	}

	// 玩家加入游戏
	playerJoin(player) {
		if(this.player_list.indexOf(player)==-1) {  // 要加入的玩家不在游戏列表中
			this._log(`玩家 ${player.user_name} 加入游戏`);
			this.player_list.push(player);
		}
	}

	// 开局
	startGame() {
		this._log('开局');
		if(this.player_list.length != this.player_num) return false;
		this._assignCardToPlayer();
	}

	// 初始发牌
	_assignCardToPlayer() {
		this._log('发牌');
		this.player_list.forEach(player=>{
			this.card_in_hand[player.userID] = [];
			this.assignCardToPlayer(player, init_card_num_per_player);
		});
	}

	assignCardToPlayer(player, num=1) {
		let cards = this.getSomeCardFromStack(num);
		this._log(`玩家 ${player.user_name} 抓到了 ${cards.map(utils.convertCardToChinese).join('  ')}`);
		this.card_in_hand[player.userID] = this._sortSomeCards(this.card_in_hand[player.userID].concat(cards));
		return cards;
	}

	// 获得某个玩家手中的手牌
	getPlayerCard(player) {
		return this.card_in_hand[player.userID];
	}

	_scoreACard(card) {
		var color = {
			red: 100,
			green: 200,
			blue: 300,
			yellow: 400
		};

		let result = 0;
		if(card.type == 'normal') result = color[card.color]+card.number;
		if(card.type == 'function')
			if(card.fun == 'draw two') result = color[card.color]+13;
			else if(card.fun == 'skip') result = color[card.color]+12;
			else result = color[card.color]+11;
		if(card.type == 'special')
			if(card.fun == 'wild draw four') result = 600;
			else result = 500;
		return result;
	}


	_sortSomeCards(cards) {
		return cards.sort((card1, card2)=>(this._scoreACard(card2)-this._scoreACard(card1)))
	}

	_addIndex(delta) {
		if(this.game_direction == GAME_DIRECTION_NORAML)
			this._index += delta;
		else
			this._index += this.player_num - delta;
	}

	discard(player, card) {
		let cardString = utils.convertCardToChinese(card);
		let cardInHand = this.getPlayerCard(player);
		let cardPosition = cardInHand.map(utils.convertCardToChinese).indexOf(cardString);
		if(cardPosition == -1) {
			console.error('手里没有这张牌');
			return;
		}
		if(!this._checkCardCanDiscard(card)) {
			console.error('不符合游戏规则');
			return;
		}

		this.card_in_hand[player.userID].splice(cardPosition, 1); // 打出的牌删掉
		card.random = Math.random(); // 用于前端的随机数
		this.card_has_been_discarded.push(card);  // 向牌海中放入这张牌

		switch (card.type) {
			case 'normal': // 打出普通牌
				this.last_card = card;
				this._addIndex(1);
				break;
			case 'function':  // 打出功能牌
				this.last_card = card;
				switch (card.fun) {
					case 'skip': // 跳过牌
						this._addIndex(2);
						break;
					case 'draw two':
						this._addIndex(1);
						this.assignCardToPlayer(this.currentPlayer, 2);
						this._addIndex(1);
						break;
					case 'reverse': // 翻转牌
						if(this.game_direction == GAME_DIRECTION_NORAML)
							this.game_direction = GAME_DIRECTION_REVERSE;
						else
							this.game_direction = GAME_DIRECTION_NORAML;
						this._addIndex(1);
						break;
				}
				break;
			case 'special': // 打出黑牌
				this.last_card = card;
				switch (card.fun) {
					case 'wild':
						this._addIndex(1);
						break;
					case 'wild draw four':
						this._addIndex(1);
						this.assignCardToPlayer(this.currentPlayer, 4);
						this._addIndex(1);
						break;
				}
				break;
		}
	}

	_checkCardCanDiscard(card) {
		return (!this.last_card)  // 如果是第一张牌，则任何牌均可出
			|| (card.type == 'special')  // 黑牌在任何情况下都可以出
			|| (card.color == this.last_card.color) // 颜色相同
			|| (card.color == this.last_card.changeColor)  // 和刚刚换的颜色相同
			|| (card.number == this.last_card.number) // 数字相同
			|| (card.fun == this.last_card.fun); // 功能相同
	}

	activeAskToGetACard(player) {
		let cards = this.assignCardToPlayer(player);
		this._addIndex(1);
		return cards;
	}

	broadcaseStatus(cmdPlayer) {
		this.player_list.forEach(player=>{
			if(player.userID !== cmdPlayer.userID && player.socket) {
				player.socket.send(JSON.stringify({
					status: this.getStatus(player)
				}));
			}
		})
	}

	get currentPlayer() {
		return this.player_list[this._index % this.player_num];
	}

	getStatus(player) {
		return({
			player: this.player_list.map((_player, _index)=>({
				name: _player.userName,
				cards_num: this.card_in_hand[_player.userID].length,
				index: _index
			})),
			playerIndex: this.player_list.indexOf(player),
			card_in_hand: this.card_in_hand[player.userID],
			card_in_stack: this.remainCardNumberInStack,
			last_card: this.last_card,
			card_has_been_discarded: this.card_has_been_discarded.slice(-4, this.card_has_been_discarded.length),
			direction: this.game_direction,
			index: this._index % this.player_num
		})

	}
}

class UnoPlayer {

	constructor(username) {
		// this.user_id = 'User '+utils.uuid();
		this.user_id = username;
		this.user_name = username;
		this.socket = undefined;
		this.score = 0;
	}

	get userID() {
		return this.user_id;
	}

	get userName() {
		return this.user_name;
	}
}

module.exports = {
	UnoGame,
	UnoPlayer
}