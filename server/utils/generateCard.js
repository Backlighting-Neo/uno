'use strict';

function generateCard() {
	var result = [];

	const colors  = ['red', 'green', 'blue', 'yellow'];
	const numbers = [0,1,2,3,4,5,6,7,8,9];
	const functionCards = ['skip', 'draw two', 'reverse'];
	const specialCards = ['wild', 'wild draw four'];

	colors.forEach(color=>{  // 普通牌
		numbers.forEach(number=>{
			let card = {
				type: 'normal',
				color,
				number,
			};

			result.push(card);

			if(number>0) // 0有一张，1-9有两张
				result.push(card);
		})

		functionCards.forEach(fun=>{  // 带颜色的功能牌
			let card = {
				type: 'function',
				fun,
				color
			};

			result = result.concat([card, card]);
		})
	});

	specialCards.forEach(fun=>{  // 黑牌
		let card = {
			type: 'special',
			fun
		};

		result = result.concat([card, card, card, card]);
	})

	return result.sort(()=>(Math.random()-0.5));
}

module.exports = generateCard;