var Game = require('./game')

module.exports = {
    'test Succesfully create a new game instance': function(beforeExit, assert) {
		game = new Game();
		assert.isNotNull(game);
	},
	'test Add users to the game': function(beforeExit, assert) {
		game = new Game();
		assert.eql([], game.get_users())
		game.add_user({'name': 'daniel'})
		assert.eql([{'name': 'daniel'}], game.get_users())
	},
}