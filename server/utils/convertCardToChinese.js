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

module.exports = function convertCardToChinese(card) {
	var result = '';

	if(card.color) result += '['+color[card.color]+']';
	else result += '[黑]';
	if(!isNaN(card.number)) result +=  card.number;
	if(card.fun)   result += fun[card.fun];

	return result;
}