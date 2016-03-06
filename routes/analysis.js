'use strict';
var db = 

module.exports = function(router){
	// 收集统计
	router.get('/c.gif', function *(next){
		let ip    = this.ip.match(/(\d{1,3}\.){3}\d{1,3}/gi);
		let type  = this.query.t || '';
		let ua    = this.request.header['user-agent'];
		let query = this.url.replace('/c.gif?', '');
		let date  = new Date();
		if( !!type && type >= 0 ){
			yield this.model.clog.create({
				ip:         !!ip[0] ? ip[0] : this.ip,
				type:       type,
				ua:         ua,
				query:      query,
				createtime: date
			});
			this.status = 204;
		} else {
			this.status = 404;
		}
	});
}