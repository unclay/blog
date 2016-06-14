'use strict';
const mongoose = require('mongoose');
const co       = require('co');
const tagTotal = require('../../total'); 

const note = {
	GET: function *(){
/*
get note
 */
		let limit = this.query.limit || 10;
		let page  = this.query.page  || 1;
		page = page <= 0 ? 1 : page;
		limit = limit - 0;
		let tag = this.query.tag;
		let query = {};
		let note = [];
		let notes = [];
		let noteCount = 0;
		if( !!tag ){
			let tagid = yield mongoose.model('Dict').findOne({
				name: tag,
				type: 'tag'
			}).exec();
			!!tagid && ( query.tag = tagid._id );
			!!tagid && ( queryCount.tag = tagid._id );
		}
		if (!!this.query.keyword) {
			
			query['title'] = new RegExp(this.query.keyword, 'gi');
			noteCount += yield mongoose.model('Note').find(query).count().exec();
			notes['title'] = yield mongoose.model('Note').find(query).skip( (page-1)*limit ).limit(limit).sort({
				createtime: -1
			}).exec();
			if (notes['title'].length < limit) {
				limit = limit - notes['title'].length;
				delete query.title;
				query['intro'] = new RegExp(this.query.keyword, 'gi');
				noteCount += yield mongoose.model('Note').find(query).count().exec();
				notes['intro'] = yield mongoose.model('Note').find(query).skip( (page-1)*limit ).limit(limit).sort({
					createtime: -1
				}).exec();
			}
			if (notes['intro'].length < limit) {
				delete query.title;
				delete query.intro;
				limit = limit - notes['intro'].length;
				query['content'] = new RegExp(this.query.keyword, 'gi');
				noteCount += yield mongoose.model('Note').find(query).count().exec();
				notes['content'] = yield mongoose.model('Note').find(query).skip( (page-1)*limit ).limit(limit).sort({
					createtime: -1
				}).exec();
			}
			for (let i in notes) {
				note = note.concat(notes[i]);
			}
		} else {
			noteCount = yield mongoose.model('Note').find(query).count().exec();
			note = yield mongoose.model('Note').find(query).skip( (page-1)*limit ).limit(limit).sort({
				createtime: -1
			}).exec();
		}
		
		this.body = {
			code: 0,
			data: {
				count: noteCount - 0,
				page:  page - 0,
				limit: limit - 0,
				list:  note
			}
		};
	},
	POST: function *(){
		let body = this.cbody;
		let note = yield mongoose.model('Note').create(body);
		this.body = {
			code: 0,
			data: note
		}
	},
	PUT: function *(){
		let body = this.cbody;
		var url  = body.seo_url;
		delete body.seo_url;
		delete body._id;
		let note = yield mongoose.model('Note').update({
			seo_url: url
		}, body).exec();
		tagTotal.init();
		this.body = {
			code: 0,
			data: note
		}
	},
	ITEM: {
		GET: function *(){
			let id = this.params.id;
			let note = yield mongoose.model('Note').findById(id).exec();
			this.body = {
				code: 0,
				data: note
			};
		}
	},
	TEST: require('./test')
}
module.exports = note;