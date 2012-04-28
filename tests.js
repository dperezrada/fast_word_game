var assert = require('assert'),
	Game = require('./game');

suite('One new game', function () {
	var game;
	setup(function(){
		game = new Game();
		game.add_user({'id': 'daniel'});
		game.add_user({'id': 'juan'});
		game.set_word('supercachilupi');
	});
    test('Succesfully create a new game instance', function () {
		assert(game);
    });
    test('Add user to the game', function () {	
		assert([{'id': 'daniel'}, {'id': 'juan'}], game.get_users());
    });
    test('Add and get game word', function () {
		assert.equal('supercachilupi', game.get_word());
    });
});