'use strict';
const body   = require('co-body');
const crypto = require('crypto');
const user   = {
	name: 'wangchenglin',
	pass: 'yK69L1lHGVi4JnYt7qNjWw==',
	showname: 'unclay',
	username: 'wangchenglin'
}
var parse = require('co-body');
const API = {
	POST: function *(next){
		// const body = yield body(this);
		const body = this.cbody;
		// 参数验证
		let errParams = !body.name ? '账号不能为空':
							!body.pass ? '密码不能为空': undefined;

		// 静态用户验证
		if( user.name !== body.name || 
			user.pass !== crypto.createHash('md5').update( body.pass ).digest('base64') ){
			errParams = errParams || '账号或者密码有误';
		}

		// 异常输出
		if( !!errParams ){
			return this.body = {
				code: 1001,
				message: errParams
			}
		}
		// 成功登录，写入session
		this.session.user = user;
		this.cookies.maxAge = 100;
		this.body = {
			code: 0,
			data: {
				name: user.name,
				showname: user.showname,
				username: user.username
			}
		}
	}
}
module.exports = API;