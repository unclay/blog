'use strict';
const koa         = require('koa');
const mount       = require('koa-mount');
const router      = require('koa-router')();
const os          = require('os');
// const koamongo    = require('koa-mongoose-short');
const ejs         = require('koa-ejs');
const path        = require('path');
const staticCache = require('koa-static-cache');
const logger      = require('koa-logger');
const session     = require('koa-session');
const body        = require('co-body');

const app = koa();

const G_port  = process.env.LPORT || 18080;
const G_dburl = process.env.DBURL || 'mongodb://blog:123456@127.0.0.1:27017/blog';


var distribute = require('./admin');
app.use(mount('/admin', distribute.admin ));
app.use(mount('/api',   distribute.api ));
// custom routing entries
require('./routes').router(router);

app.use(logger());
app.keys = ['blog'];
app.use(session(app));
ejs(app, {
	root:    path.join(`${__dirname}/views`),
	layout:  'layout/index',
	viewEXT: 'html',
	cache:   false,
	debug:   false
});
app.use(require('./config/domain')());

// app.use(domain());

// app.use(require('./libs/koa-mongoose')());

// app.use(require('./libs/db')());
// app.use(koamongo.connect({
// 	url: G_dburl
// }));
console.log( G_dburl );
require('./routes/database')({
	url: G_dburl
});

app.use(router.routes());

app.use(staticCache(path.join(`${__dirname}/public`), {
	maxAge: 365 * 24 * 60 * 60
}));

app.use(function* (next) {
	// this.model('user').findOne(function(err, doc){
	// 	console.log(2213, err, doc);
	// });
	this.render('index');
});
app.listen(G_port, function(){
	console.log(`listen to ${G_port}`);
});