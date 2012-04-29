var io = require('socket.io').listen(8080),
	Game = require('./game'),
	words = require('./words');

function get_word(){
	return words[Math.floor(Math.random()*words.length)];
}

game = new Game();
game.set_word(get_word());

io.sockets.on('connection', function (socket) {
	socket.on('set_name', function (data) {
		game.add_user(socket.id, data.name);
		socket.emit('new_user', {  word: game.get_word(), users: game.get_users() });
	});
	socket.on('word_typed', function (data) {
		if(game.check_winner(socket.id, data.word)){
			socket.emit('winner', { user: socket.id, points: game.get_scores(), word: get_word()});
		}
	});
});