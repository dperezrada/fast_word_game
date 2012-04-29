var assert = require('assert'),
	Game = require('./game');

suite('One new game', function () {
	var game;
	setup(function(){
		game = new Game();
		game.add_user(1,'daniel', 'danielguajardok', 'http://imagen.com');
		game.add_user(2, 'juan', 'juandoc', 'http://imagen.com/2');
		game.set_word('supercachilupi');
	});
    test('Succesfully create a new game instance', function () {
		assert(game);
    });
    test('Add user to the game', function () {	
		assert.deepEqual({'1': {'name':'daniel','screen_name':'danielguajardok','profile_image_url':'http://imagen.com'}, '2': {'name':'juan','screen_name':'juandoc','profile_image_url':'http://imagen.com/2'}}, game.get_users());
    });
    test('Add and get game word', function () {
		assert.equal('supercachilupi', game.get_word());
    });
    test('Check winner with incorrect word', function () {
		assert.ok(!game.check_winner(1, 'supercachi'));
    });
    test('Correct word check', function () {
		assert.ok(game.check_winner(1, 'supercachilupi'));
    });
    test('Check correct word invalid user ', function () {
		assert.ok(!game.check_winner(4, 'supercachilupi'));
    });
    test('If a user wins, another user should not be able to win', function () {
		assert.ok(game.check_winner(1, 'supercachilupi'));
		assert.ok(!game.check_winner(2, 'supercachilupi'));
    });
    test('Winner user should receive a point', function () {
		assert.ok(game.check_winner(1, 'supercachilupi'));
		assert.deepEqual({'1': 1, '2': 0}, game.get_scores());
    });
    test('Remove user from game', function () {
		game.remove_user('1');
		assert.deepEqual({'2': {'name':'juan','screen_name':'juandoc','profile_image_url':'http://imagen.com/2'}}, game.get_users());
		assert.deepEqual({'2': 0}, game.get_scores());
    });
});