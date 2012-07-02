var _ = require('underscore');

Game = module.exports  = function(){
	this.users = {};
	this.word;
	this.points = {};
	this.time_limit = 60;
	this.status = 'new';
	this.started_time;
	this.admin;
	this.url;
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
			if(admin)
				self.admin = user_id;
		},
		remove_user: function(user_id){
			delete self.users[user_id];
			delete self.points[user_id];
		},
		reset_admin: function(admin_id){
			var userKeys = _.without(_.keys(self.users), admin_id);

			if(_.size(userKeys)){ 
				self.users[userKeys[0]].admin = true;
				self.admin = userKeys[0];
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
		set_started_time: function(){
			self.started_time = new Date().getTime();
		},
		get_time_left: function(){
			var currentTime = new Date().getTime();
			return self.time_limit - (currentTime/1000 - self.started_time/1000);

		},
		get_admin_id: function(){
			return self.admin;
		},
		get_summary: function(){
			return {
				user_count: _.size(self.users),
				status: self.status,
				users_faces: _.map(self.users, function(u){
					return {image_url: u.profile_image_url};
				}),
				url: self.url
			};
		},
		set_url: function(url){
			self.url = url;
		},
		get_url: function(){
			return self.url;
		}
	};
};