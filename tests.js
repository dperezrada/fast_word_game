var assert = require('assert'),
	Game = require('./game');

suite('One new game', function () {
	var game;
	setup(function(){
		game = new Game();
		game.add_user('daniel');
		game.add_user('juan');
		game.set_word('supercachilupi');
	});
    test('Succesfully create a new game instance', function () {
		assert(game);
    });
    test('Add user to the game', function () {	
		assert(['daniel', 'juan'], game.get_users());
    });
    test('Add and get game word', function () {
		assert.equal('supercachilupi', game.get_word());
    });
    test('Check winner with incorrect word', function () {
		assert(!game.check_winner('daniel', 'supercachi'));
    });
    test('Correct word check', function () {
		assert(game.check_winner('daniel', 'supercachilupi'));
    });
    test('If a user wins, another user should not be able to win', function () {
		assert(game.check_winner('daniel', 'supercachilupi'));
		assert(!game.check_winner('juan', 'supercachilupi'));
    });
    test('Winner user should receive a point', function () {
		assert(game.check_winner('daniel', 'supercachilupi'));
		assert.deepEqual({'daniel': 1, 'juan': 0}, game.get_scores());
    });
});