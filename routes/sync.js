'use strict';
var mongoose = require('mongoose');
var url = require('url');
var qs = require('querystring');
var rest = require('restler');

module.exports = function(router){
	// 同步服务器数据进本地v
	router.post('/ace/note', function *(next){
		var note = yield new Promise(function(resolve, reject){
			rest.get('http://api.unclay.com/api/v1/note', {
				query: {
					limit: 100
				}
			}).on('complete', function(data){
				resolve(data);
			});
		});
		for(var i=0; i<note.data.list.length; i++){
			delete note.data.list[i]._id;
			delete note.data.list[i].__v;
			yield mongoose.model('Note').update({
				seo_url: note.data.list[i].seo_url
			}, note.data.list[i], {
				upsert: true
			}).exec();
			// yield mongoose.model('Note').create(note.data.list[i]);
		}

		var tag = yield new Promise(function(resolve, reject){
			rest.get('http://api.unclay.com/api/v1/tag', {
				query: {
					limit: 100
				}
			}).on('complete', function(data){
				resolve(data);
			});
		});
		for(var i=0; i<tag.data.list.length; i++){
			delete tag.data.list[i]._id;
			delete tag.data.list[i].__v;
			yield mongoose.model('Dict').update({
				name: tag.data.list[i].name
			}, tag.data.list[i], {
				upsert: true
			}).exec();
			// yield mongoose.model('Dict').create(tag.data.list[i]);
		}
		this.body = tag;
	});
}