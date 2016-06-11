module.exports = {
	router: function(router){
		require('./analysis')(router);
		require('./base')(router);
		// require('./api')(router);
		require('./sync')(router);
		require('./page')(router);
		require('./init')();
		// require('./admin')(router);

	}
}