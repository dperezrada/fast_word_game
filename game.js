var _ = require('underscore');

Game = module.exports  = function(){
	this.users = [];
	this.word;
	this.points = {};
	var self = this;
	return {
		get_users: function(){
			return self.users;
		},
		add_user: function(user_id){
			self.users = _.union(self.users, [user_id])
			self.points[user_id] = 0;
		},
		set_word: function(word){
			self.word = word;
		},
		get_word: function(){
			return self.word;
		},
		check_winner: function(user_id, word){
			if(word && word === self.word){
				self.word = null;
				self.points[user_id]++;
				return true
			}else{
				return false;
			}
		},
		get_scores: function(){
			return self.points;
		}
	};
};