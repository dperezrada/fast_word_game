var io = require('socket.io').listen(8080),
	Game = require('./game');

game = new Game();
game.set_word('supercachilupi');

io.sockets.on('connection', function (socket) {
	game.add_user(socket.id);
	socket.emit('welcome', { word: game.get_word(), users: game.get_users() });
	socket.on('word_typed', function (data) {
		if(game.check_winner(socket.id, data.word)){
			socket.emit('winner', { user: socket.id, points: game.get_scores() });
		}
	});
});