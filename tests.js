var assert = require('assert'),
	Game = require('./game');

suite('One new game', function () {
	var game;
	setup(function(){
		game = new Game();
	});
    test('Succesfully create a new game instance', function () {
		assert(game);
    });
    test('Add users to the game', function () {
		assert([], game.get_users());
		game.add_user({'name': 'daniel'});
		assert([{'name': 'daniel'}], game.get_users());
    });
});