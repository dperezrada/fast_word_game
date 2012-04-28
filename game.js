var _ = require('underscore');

Game = module.exports  = function(){
	this.users = [];
	this.word;
	var self = this;
	return {
		get_users: function(){
			return self.users;
		},
		add_user: function(user){
			self.users = _.union(self.users, [user])
		},
		set_word: function(word){
			self.word = word;
		},
		get_word: function(){
			return self.word;
		}
	};
};