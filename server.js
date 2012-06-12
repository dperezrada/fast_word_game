var port = process.env.PORT || 3000;
var express = require('express');
var app = express.createServer(),
	io = require('socket.io').listen(app),
	Game = require('./game'),
	ejs = require('ejs'),
	words = require('./words');
var OAuth= require('oauth').OAuth;
var oa = new OAuth(
	"https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
	"gdnucitVctOr0bQwy8khsQ",
	"A9QsknaR8OoyN7IACDejRUcmTK6APmPrtbXjaFiCeY",
	"1.0",
	"http://localhost:3000/twitter_auth",
	"HMAC-SHA1"
);

app.use(express.cookieParser());
app.use(express.session({secret: 'codingdojo'}));
app.set('view engine', 'ejs');
app.set('view options', {
    layout: false
});
app.listen(port);
console.log(port);

app.get('/game/*', function (req, res) {
	// TODO: FIX this, if it's not validated it work
	if (req.session.oauth) {
  		//res.sendfile(__dirname + '/index.html');
  		res.render('index',{auth_data: req.session.auth_data});
  	} else {
  		res.redirect('/auth/twitter');
  	}
});

app.get('/auth/twitter', function(req, res){
	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
		if (error) {
			console.log(error);
			res.send("Problem ocurred")
		}
		else {
			req.session.oauth = {};
			req.session.oauth.token = oauth_token;
			req.session.oauth.token_secret = oauth_token_secret;
			res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
	}
	});
});

app.get('/twitter_auth', function(req, res, next){
	if (req.session.oauth) {
		req.session.oauth.verifier = req.query.oauth_verifier;
		var oauth = req.session.oauth;

		oa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier, 
		function(error, oauth_access_token, oauth_access_token_secret, results){
			if (error){
				console.log(error);
				res.send("Not authorized");
			} else {
				req.session.oauth.access_token = oauth_access_token;
				req.session.oauth.access_token_secret = oauth_access_token_secret;
				oa.get("https://api.twitter.com/1/account/verify_credentials.json", req.session.oauth.access_token, req.session.oauth.access_token_secret, function(error, data) {
					data = JSON.parse(data);
					req.session.auth_data = {
						screen_name: data['screen_name'],
						id: data['id'],
						name: data['name'],
						profile_image_url: data['profile_image_url']
					}
					res.redirect('/');
				});
			}
		}
		);
	} else
		next(new Error("Not authorized"))
});

/*app.get('/setup_user',function(req, res, next){
	if (req.session.oauth) {
			console.log(req.session.oauth);

	} else {
		next(new Error("You should not be here"));
	}
});*/

function get_word(){
	return words[Math.floor(Math.random()*words.length)];
}

games = {};

io.on('connection', function (socket) {
	var game;
	var joined_game = null;
	socket.on('join_game', function(game_to_join) {
		joined_game = game_to_join;
		socket.join(joined_game);
		game = games[joined_game];
		if(!game) {
			game = new Game();
			game.set_word(get_word());
			games[joined_game] = game;
		}
		socket.emit('game_connected', 'OK');
	});
	socket.on('set_name', function (data) {
		game.add_user(socket.id, data.name, data.screen_name, data.profile_image_url);
		socket.emit('welcome', {  word: game.get_word(), users: game.get_users(), points: game.get_scores() });
		socket.broadcast.to(joined_game).emit('new_user', {  users: game.get_users(), points: game.get_scores() });
	});
	socket.on('word_typed', function (data) {
		if(game.check_winner(socket.id, data.word)){
			new_word = get_word();
			game.set_word(new_word);
			socket.emit('winner', { user: socket.id, points: game.get_scores(), word: new_word});
			socket.broadcast.to(joined_game).emit('user_won', { user: socket.id, points: game.get_scores(), word: new_word});
		}
	});
	socket.on('disconnect', function () {
		if(game){
			game.remove_user(socket.id);
		}
	});
});
