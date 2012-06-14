var port = process.env.PORT || 3000;
var domain = process.env.GAME_DOMAIN || 'localhost:3000';
var express = require('express');
var app = express.createServer(),
	io = require('socket.io').listen(app),
	Game = require('./game'),
	ejs = require('ejs'),
	words = require('./words');
var _ = require('underscore');
var OAuth= require('oauth').OAuth;

var get_oauth = function(redirect_url){
	if(!redirect_url){
		redirect_url = "http://"+domain+"/twitter_auth";
	}
	return new OAuth(
		"https://api.twitter.com/oauth/request_token",
		"https://api.twitter.com/oauth/access_token",
		"gdnucitVctOr0bQwy8khsQ",
		"A9QsknaR8OoyN7IACDejRUcmTK6APmPrtbXjaFiCeY",
		"1.0",
		redirect_url,
		"HMAC-SHA1"
	);
};

process.on('uncaughtException', function (err) {
	console.log(err);
});

app.configure(function(){
	app.use(express.static(__dirname + '/public'));
	app.use(express.cookieParser());
	app.use(express.session({secret: 'codingdojo'}));
	app.set('view engine', 'ejs');
	app.set('view options', {
	    layout: false
	});	
})
app.listen(port);
console.log(port);

app.get('/', function (req, res) {
	if (req.session.auth_data) {
  		res.render('index',{auth_data: req.session.auth_data});
  	} else {
		authorize(req,res);	
  	}
});

app.get('/game/:game_id', function (req, res) {
	if (req.session.auth_data) {
  		res.render('game',{auth_data: req.session.auth_data});
  	} else {
		authorize(req,res);
  	}
});

function authorize(req, res){
	var oa = get_oauth('http://'+domain+'/twitter_auth?redirect='+req.headers.host+req.url);
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
}

app.get('/twitter_auth', function(req, res, next){
	var oa = get_oauth(req.query.redirect);
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
					res.redirect('http://'+req.query.redirect);
				});
			}
		}
		);
	} else
		next(new Error("Not authorized"))
});

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
	socket.on('start_game', function (data){
		if(game.get_users()[socket.id].admin){
			game.set_time_limit(data.time);
			game.set_started_time();
			game.set_status('started');
			socket.broadcast.emit('start_game', { });
			socket.emit('start_game', { });
		}
		setInterval(function(){
					socket.broadcast.emit('update_time', {  time: game.get_time_left() });
					socket.emit('update_time', {  time: game.get_time_left() });
		}, 1000);
		// setear tiempo
		// iniciar juego
	});
	socket.on('set_name', function (data) {
		if(game.get_status() == 'new'){
			var admin = (_.size(game.get_users()) === 0);
			game.add_user(socket.id, data.name, data.screen_name, data.profile_image_url, admin);
			socket.emit('welcome', {  word: game.get_word(), users: game.get_users(), points: game.get_scores(), admin: admin });
			socket.broadcast.to(joined_game).emit('new_user', {  users: game.get_users(), points: game.get_scores() });
		}else{
			socket.emit('game_started', { game_started: 'already started' });
		}
	});
	socket.on('word_typed', function (data) {
		if(game.get_status() == 'started'){
			if(game.check_winner(socket.id, data.word)){
				new_word = get_word();
				game.set_word(new_word);
				socket.emit('winner', { user: socket.id, points: game.get_scores(), word: new_word});
				socket.broadcast.to(joined_game).emit('user_won', { user: socket.id, points: game.get_scores(), word: new_word});
			}
		}
	});
	socket.on('disconnect', function () {
		if(game){
			var adminDisconnected = false;

			// If the disconnected user is the admin, we should pick another admin
			if(game.get_users()[socket.id].admin){
				game.reset_admin(socket.id);
				adminDisconnected = true;
			}
			game.remove_user(socket.id);
			socket.broadcast.emit('new_user', {  users: game.get_users(), points: game.get_scores() });

			if(adminDisconnected)
				socket.broadcast.emit('new_admin', {  admin_id: game.get_admin_id(), game_status: game.get_status() });
		}
	});
});
