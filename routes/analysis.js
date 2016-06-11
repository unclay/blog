'use strict';
var mongoose = require('mongoose');
var url = require('url');
var qs = require('querystring');

module.exports = function(router){
	// 收集统计
	router.get('/c.gif', function *(next){
		// console.log( this.request );
		// console.log( this.url,  url.parse(this.url) );
		// console.log( qs.parse( url.parse(this.url).query ) );
		let ip    = this.ip.match(/(\d{1,3}\.){3}\d{1,3}/gi);
		let type  = this.query.t;
		let url   = this.header.referer;
		if( !!type && type >= 0 && !!url ){
			yield mongoose.model('Clog').create({
				ip:         !!ip[0] ? ip[0] : this.ip,
				type:       type,
				url:        url,
				ref:        this.query.ref,
				ua:         this.request.header['user-agent'],
				query:      this.querystring,
				createtime: new Date()
			});
			this.status = 204;
		} else {
			this.status = 404;
		}
	});
}