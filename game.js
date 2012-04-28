var _ = require('underscore');

Game = module.exports  = function(){
	this.users = [];
	var self = this;
	return {
		get_users: function(){
			return self.users;
		},
		add_user: function(user){
			self.users = _.union(self.users, [user])
		}
	};
};