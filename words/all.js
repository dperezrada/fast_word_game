var countries = require('./countries'),
	basketball = require('./basketball_players'),
	tennis = require('./tennis_players'),
	rockers = require('./rockers'),
	animals = require('./animals');
	cartoons = require('./cartoons');

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
	},
	'Rock bands': {
		'total': rockers.length,
		'words': rockers
	},
	'Animals': {
		'total': animals.length,
		'words': animals
	},
	'Cartoons': {
		'total': cartoons.length,
		'words': cartoons
	}
}
