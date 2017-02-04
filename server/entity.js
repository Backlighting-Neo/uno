'use strict';

var utils = require('./utils/utils.js');

const GAME_PREPARE = 0;
const GAME_PLAYING = 1;

const GAME_DIRECTION_NORAML = 0;
const GAME_DIRECTION_REVERSE = 1;

const init_card_num_per_player = 7;

class UnoGame {

	constructor(master_player) {
		this.game_id = global.game_serialno_pool.pop()+'';
	  // this.player_num = player_num;  // 玩家人数
	  this.player_list = []; // 玩家列表
	  this.card_in_hand = {}; // 玩家手牌列表
	  this.card_stack = utils.generateCardStack(); // 获得一副洗好的牌
	  this.master_player = master_player; // 房主Token

	  this.game_direction = GAME_DIRECTION_NORAML;  // 游戏出牌方向

	  this.game_status = GAME_PREPARE;

	  this.game_chain = {};
	  this.active_player_num = 0;
	  this.last_card = undefined;
	  this.next_discard_player = master_player;
	  this._index = 0; // 出牌序次
	  this.card_has_been_discarded = [];  // 已打出的牌

	  this.game_discard_log = []; // 游戏出牌日志

	  console.log(`创建游戏成功 ${this.game_id}`);
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
			this.broadcaseStatus();
		}
	}

	// 玩家离开游戏
	playerSeparate(player) {
		let position = this.player_list.indexOf(player);

		if(player == this.master_player) { // 如果是房主退出，则更换房主
			this.master_player = this.player_list[(position+1)%this.player_list.length];

		} 
		this.player_list.splice(position, 1);
	}

	// 开局
	startGame(player) {
		this._log('开局');

		if(this.player_list.length<3) return false;
		this.player_num = this.player_list.length;
		this.active_player_num = this.player_num;

		this.player_list.forEach((player, index)=>{
			this.game_chain[player.userID] = {
				index,
				pre: this.player_list[(index+this.player_num-1)%this.player_num].userID,
				next: this.player_list[(index+1)%this.player_num].userID
			};
		});

		this._assignCardToPlayer();
		this.game_status = GAME_PLAYING;
		
		this.broadcaseStatus(player, {
			type: 'start'
		});
	}

	// 初始发牌
	_assignCardToPlayer() {
		this._log('发牌');
		this.player_list.forEach(player=>{
			this.card_in_hand[player.userID] = [];
			this.assignCardToPlayer(player, init_card_num_per_player);
		});
	}

	// 给player玩家发num张牌
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
		return cards.sort((card1, card2)=>(this._scoreACard(card2) - this._scoreACard(card1)));
	}

	// 把出牌顺序向后顺延一位
	_addIndex() {
		let currentPlayer = this.currentPlayer;
		if(this.game_direction == GAME_DIRECTION_NORAML) {
			let nextPlayerUserID = this.game_chain[currentPlayer.userID].next;
			this._index = this.game_chain[nextPlayerUserID].index;
		}
		else {
			let perPlayerUserID = this.game_chain[currentPlayer.userID].pre;
			this._index = this.game_chain[perPlayerUserID].index;
		}
	}

	// 玩家player要求出一张card手牌
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
				this._addIndex();
				break;
			case 'function':  // 打出功能牌
				this.last_card = card;
				switch (card.fun) {
					case 'skip': // 跳过牌
						this._addIndex();
						this._addIndex();
						break;
					case 'draw two':
						this._addIndex();
						this.assignCardToPlayer(this.currentPlayer, 2);
						this._addIndex();
						break;
					case 'reverse': // 翻转牌
						if(this.game_direction == GAME_DIRECTION_NORAML)
							this.game_direction = GAME_DIRECTION_REVERSE;
						else
							this.game_direction = GAME_DIRECTION_NORAML;
						this._addIndex();
						break;
				}
				break;
			case 'special': // 打出黑牌
				this.last_card = card;
				switch (card.fun) {
					case 'wild':
						this._addIndex();
						break;
					case 'wild draw four':
						this._addIndex();
						this.assignCardToPlayer(this.currentPlayer, 4);
						this._addIndex();
						break;
				}
				break;
		}

		this._log(`玩家 [${player.userName}] 打出一张 ${cardString}`);

		if(this.card_in_hand[player.userID].length === 1) { // UNO
			this._log(`玩家 [${player.userName}] UNO`);
		}

		if(this.card_in_hand[player.userID].length === 0) { // 玩家全部打完
			let preUserID = this.game_chain[player.userID].pre;
			let nextUserID = this.game_chain[player.userID].next;
			delete this.game_chain[player.userID];
			this.game_chain[preUserID].next = nextUserID;
			this.game_chain[nextUserID].pre = preUserID;
			this.active_player_num -= 1;
		}

	}

	// 检查某张卡牌当前是否可打出
	_checkCardCanDiscard(card) {
		return (!last_card)  // 如果是第一张牌，则任何牌均可出
			|| (card.type == 'special')  // 黑牌在任何情况下都可以出
			|| (card.color && card.color == last_card.color) // 颜色相同
			|| (last_card.changeColor && card.color == last_card.changeColor)  // 和刚刚换的颜色相同
			|| (card.color && card.number == last_card.number) // 数字相同
			|| (card.fun && card.fun == last_card.fun); // 功能相同
	}

	// 玩家player要求抓一张牌
	activeAskToGetACard(player) {
		let cards = this.assignCardToPlayer(player);
		this._addIndex();
		return cards;
	}

	// 通过Websocket广播游戏状态
	broadcaseStatus(cmdPlayer, action) {
		this.player_list.forEach(player=>{
			if((!cmdPlayer || player.userID !== cmdPlayer.userID) && player.socket) {
				player.socket.send(JSON.stringify({
					action,
					status: this.getStatus(player)
				}));
			}
		})
	}

	// 当前轮到的出牌玩家
	get currentPlayer() {
		return this.player_list[this._index % this.player_num];
	}

	// 获得某一位玩家当前的游戏状态
	getStatus(player) {
		return({
			player: this.player_list.map((_player, _index)=>({
				name: _player.userName,
				cards_num: (this.card_in_hand[_player.userID] || []).length,
				index: _index
			})),
			masterPlayerIndex: this.player_list.indexOf(this.master_player),
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
		this.user_id = 'User:'+utils.uuid();
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