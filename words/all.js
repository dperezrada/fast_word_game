var countries = require('./countries'),
	basketball = require('./basketball_players'),
	tennis = require('./tennis_players');

module.exports = {
	'Countries': {
		'total': countries.length,
		'words': countries
	},
	'Basketball players': {
		'total': basketball.length,
		'words': basketball
	},
	'Tennis players': {
		'total': tennis.length,
		'words': tennis
	}
}
