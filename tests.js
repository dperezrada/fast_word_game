var Game = require('./game')

module.exports = {
    'test Succesfully create a new game instance': function(beforeExit, assert) {
		game = new Game();
		assert.isNotNull(game);
	},
}