var _ = require('underscore');

Game = module.exports  = function(){
	this.users = {};
	this.word;
	this.points = {};
	this.time_limit = 60;
	this.status = 'new';
	this.started_time;
	var self = this;
	return {
		get_users: function(){
			return self.users;
		},
		add_user: function(user_id, name, screen_name, profile_image_url, admin){
			self.users[user_id] = {
				name: name,
				screen_name: screen_name,
				profile_image_url: profile_image_url,
				admin: admin
			}
			self.points[user_id] = 0;
			console.log(self.users);
		},
		remove_user: function(user_id){
			delete self.users[user_id];
			delete self.points[user_id];
		},
		reset_admin: function(){
			if(_.size(self.users)){ 
				self.users[_.keys(self.users)[0]].admin = true;
			}
		},
		set_word: function(word){
			self.word = word;
		},
		get_word: function(){
			return self.word;
		},
		check_winner: function(user_id, word){
			if(typeof(self.users[user_id]) != "undefined"){
				if(word && word === self.word){
					self.word = null;
					self.points[user_id]++;
					return true
				}
			}
			return false;
		},
		get_scores: function(){
			return self.points;
		},
		get_status: function(){
			return self.status;
		},
		set_status: function(status){
			self.status = status;
		},
		set_time_limit: function(time){
			self.time_limit = time;
		},
		get_time_left: function(){
			var currentTime = new Date().getTime();
			return self.time_limit - (currentTime - self.started_time);

		}
	};
};