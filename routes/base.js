'use strict';
var os = require('os');	
module.exports = function(router){
	// 系统信息
	router.get('/version', function* (next){
		let ip = this.request.ip.match(/(\d{1,3}\.){1,3}\d{1,3}/gi)
		this.body = {
			code: 0,
			data: {
				os: {
					freemem:           os.freemem(),
					hostname:          os.hostname(),
					networkInterfaces: os.networkInterfaces(),
					platform:          os.platform(),
					type:              os.type(),
					cpus:              os.cpus()
				},
				env: {
					PORT:         process.env.PORT || 0,
					DATABASE_URL: process.env.DATABASE_URL || '',
					MONGO_DB_STR: process.env.MONGO_DB_STR || '',
					all: process.env
				},
				node: {
					version: process.version
				},
				client: {
					ip: !!ip ? ip[0] : this.request.ip
				}
			}
		}
	});

	router.get('/ejs.html', function* (){
		yield this.render('ejs', {
			qq: 123
		});
	});
}