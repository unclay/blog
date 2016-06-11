'use strict';
const domain = {
	product: {
		SOURCE: 'http://source.unclay.com',
		title:  'claypot'
	},
	dev: {
		SOURCE: 'http://source.home.com',
		title:  'claypot'
	}
}
const domainName = process.env.environment || 'dev';
function merge(obj, ext){
	for(let i in ext){
		obj[i] = ext[i];
	}
}
module.exports = function(){
	return function *(next){
		this.state = this.state || {};
		merge(this.state, domain[domainName]);
		yield next;
	}
}