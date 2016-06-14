/*
 * 通过koa-mount分发api路由
 * 中间件：登录控件
 */
'use strict';
const auth = function *(next){
	if( !this.session.user ){
		this.body = {
			error_code: 900,
			error_message: '用户未登录'
		}
	} else {
		yield next;
	}
}
module.exports = function(router){

	require('./analysis')(router);

	function distribute(path, event){
		if( path === '/login' ){
			if( event.GET ) router.get(path, event.GET);
			if( event.POST ) router.post(path, event.POST);
		} else {
			if( event.GET ) router.get(path, auth, event.GET);
			if( event.POST ) router.post(path, auth, event.POST);
			if( event.PUT ) router.put(path, auth, event.PUT);
			if( event.DELETE ) router.delete(path, auth, event.DELETE);
		}
		
	}
	const note = require('./note');
	const login = require('./login');
	const member = require('./member');
	const tag = require('./tag');
	const doc = require('./doc');
	console.log(doc)
	distribute('/doc',    doc);
	distribute('/*.doc',  doc.ITEM);
	distribute('/login',    login);
	distribute('/note',     note);
	distribute('/note/:id', note.ITEM);
	distribute('/member',   member);
	distribute('/tag',      tag);
	
}