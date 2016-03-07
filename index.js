'use strict';
const koa         = require('koa');
const router      = require('koa-router')();
const os          = require('os');
// const koamongo    = require('koa-mongoose-short');
const ejs         = require('koa-ejs');
const path        = require('path');
const staticCache = require('koa-static-cache');
const logger      = require('koa-logger');

const app = koa();

const G_port  = process.env.LPORT || 18080;
const G_dburl = process.env.DBURL || 'mongodb://677346266c905ea767c02679b7cdf5d3:2d2c3e4c5a1f18d0d0fd889e9f3d4744@mongo.duapp.com:8908/rUJPFTguPXKJLMCCexyy';

// custom routing entries
require('./routes').router(router);

app.use(logger());
ejs(app, {
	root:    path.join(`${__dirname}/views`),
	layout:  'layout/index',
	viewEXT: 'html',
	cache:   false,
	debug:   false
});

// app.use(domain());

// app.use(require('./libs/koa-mongoose')());

// app.use(require('./libs/db')());
// app.use(koamongo.connect({
// 	url: G_dburl
// }));

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