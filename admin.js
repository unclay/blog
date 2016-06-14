'use strict';
const koa         = require('koa');
const router      = require('koa-router');
const logger      = require('koa-logger');
const session     = require('koa-session');
const body        = require('co-body');

	const api = koa();
	const apiRouter = router();
	apiRouter.post('*', function *(next){
		this.cbody = yield body(this);
		yield next;
	});
	apiRouter.put('*', function *(next){
		this.cbody = yield body(this);
		yield next;
	});
	apiRouter.delete('*', function *(next){
		this.cbody = yield body(this);
		yield next;
	});
	require('./routes/api')(apiRouter);
	api.keys = ['blog'];
	api.use(require('./config/domain')());
	api.use(session(api));
	api.use(apiRouter.routes());
	api.use(logger());

	const admin = koa();
	const adminRouter = router();
	require('./routes/admin')(adminRouter);
	admin.keys = ['blog'];
	admin.use(session(admin));
	admin.use(require('./config/domain')());
	admin.use(adminRouter.routes());
	admin.use(logger());


module.exports = {
	admin: admin,
	api: api
};