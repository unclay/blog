module.exports = {
	router: function(router){
		require('./analysis')(router);
		require('./base')(router);
		require('./restful')(router);
		require('./sync')(router);
	}
}