'use strict';

module.exports = {
	generateCardStack: require('./generateCard.js'), // 获得一副乱序的牌
	convertCardToChinese: require('./convertCardToChinese.js'), // 将牌转换为中文

	uuid() {
		const template = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		let date = new Date().getTime();
    return	template.replace(/[xy]/g, function(c) {
      const r = (date + Math.random()*16)%16 | 0;
      date = Math.floor(date / 16);
      return (c === 'x' ? r : (r&0x3|0x8)).toString(16);
    });
	},

	serial() {
		let temp = Math.random()*1e5;
		if(temp<1e4) temp+=1e4;
		temp = temp.toFixed(0);
		return temp;
	},

	getScoreFromCardsArray(cardsArray) {
		return cardsArray.reduce((accumulator, card)=>{
			let score = 0;
			if(card.type == 'normal') score = card.number;
			else if(card.type == 'function') score = 20;
			else if(card.type == 'special') score = 40;
			return accumulator+score;
		})
	},

	generate_game_serial_no() {
		let temp = [];
		for(let i=1; i<1e3; i++) {
			let no = this.serial();
			if(temp.indexOf(no)===-1) temp.push(no);
		}
		console.log(`生成了${temp.length}个游戏代码`);
		global.game_serialno_pool = temp;
	}

}