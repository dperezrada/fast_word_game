var port = process.env.PORT || 3000;

var app = require('express').createServer(),
	io = require('socket.io').listen(app),
	Game = require('./game'),
	words = require('./words');

app.listen(port);
console.log(port);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

function get_word(){
	return words[Math.floor(Math.random()*words.length)];
}

game = new Game();
game.set_word(get_word());

io.sockets.on('connection', function (socket) {
	socket.on('set_name', function (data) {
		game.add_user(socket.id, data.name);
		socket.emit('welcome', {  word: game.get_word(), users: game.get_users(), points: game.get_scores() });
		socket.broadcast.emit('new_user', {  users: game.get_users(), points: game.get_scores() });
	});
	socket.on('word_typed', function (data) {
		if(game.check_winner(socket.id, data.word)){
			new_word = get_word();
			game.set_word(new_word);
			socket.emit('winner', { user: socket.id, points: game.get_scores(), word: new_word});
			socket.broadcast.emit('user_won', { user: socket.id, points: game.get_scores(), word: new_word});
		}
	});
	socket.on('disconnect', function () {
		game.remove_user(socket.id);
	});
});