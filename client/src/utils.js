'use strict';

import 'whatwg-fetch';

var color = {
	red: '红',
	green: '绿',
	blue: '蓝',
	yellow: '黄'
};

var fun = {
	'skip': '跳过',
	'draw two': '+2',
	'reverse': '翻转',
	'wild': '换色',
	'wild draw four': '+4'
}

module.exports = {

	server: 'http://'+location.hostname+':8083',
	webscoketServer: 'ws://'+location.hostname+':8084',

	convertCardToChinese(card) {
		var result = '';

		if(card.color) result += '['+color[card.color]+']';
		if(!isNaN(card.number)) result +=  card.number;
		if(card.fun)   result += fun[card.fun];

		return result;
	},

	convertColorToChinese(c) {
		return color[c];
	},

	checkCardCanDiscard(card, last_card) {
		return (!last_card)  // 如果是第一张牌，则任何牌均可出
			|| (card.type == 'special')  // 黑牌在任何情况下都可以出
			|| (card.color && card.color == last_card.color) // 颜色相同
			|| (last_card.changeColor && card.color == last_card.changeColor)  // 和刚刚换的颜色相同
			|| (card.number && card.number == last_card.number) // 数字相同
			|| (card.fun && card.fun == last_card.fun); // 功能相同
	},

	ajax(url, option) {
		if(url.indexOf('http')===-1) url = this.server+url;

		if(!option) option={};
		if(!option.headers) option.headers = {};

		option.headers["content-type"] = 'application/json';
		if(window.localStorage.uno_userToken)
			option.headers.token = window.localStorage.uno_userToken;
		if(window.localStorage.gameID)
			option.headers.game  = window.localStorage.gameID;

		if(option.body && option.body.constructor != String) option.body = JSON.stringify(option.body);

		return new Promise((resolve, reject)=>{
			fetch(url, option)
			.then(res=>{
				if(res.status === 200)
					resolve(res.json());
				else {
					reject(res.message);
				}
			}, error=>{
				reject(error);
			})
		})
	}

}