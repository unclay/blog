'use strict';
const mongoose = require('mongoose');
const co       = require('co');
const tagTotal = require('../../total'); 

const note = {
	GET: function *(){
/*

 */
		let limit = this.query.limit || 10;
		let page  = this.query.page  || 1;
		page = page <= 0 ? 1 : page;
		let tag = this.query.tag;
		let query = {};
		if( !!tag ){
			let tagid = yield mongoose.model('Dict').findOne({
				name: tag,
				type: 'tag'
			}).exec();
			!!tagid && ( query.tag = tagid._id );
		}
		let noteCount = yield mongoose.model('Note').find(query).count().exec();
		let note = yield mongoose.model('Note').find(query).skip( (page-1)*limit ).limit(limit).sort({
			createtime: -1
		}).exec();
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
	} 
}
module.exports = note;