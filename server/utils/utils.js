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

	getScoreFromCardsArray(cardsArray) {
		return cardsArray.reduce((accumulator, card)=>{
			let score = 0;
			if(card.type == 'normal') score = card.number;
			else if(card.type == 'function') score = 20;
			else if(card.type == 'special') score = 40;
			return accumulator+score;
		})
	}

}