'use strict';
const fs = require('co-fs');
module.exports = function(router){
	router.get('/*.wcl', function *(next){
		console.log( this.params );
		if( yield fs.exists( `${process.env.PWD}/views/admin/${this.params[0]}.html` ) ){
			yield this.render(`admin/${this.params[0]}`, {
				layout: 'admin/layout'
			});
		} else {
			yield next;
		}
	});
}