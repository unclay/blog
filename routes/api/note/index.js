'use strict';
const mongoose = require('mongoose');

const note = {
	GET: function *(){
		let limit = this.query.limit || 10;
		let page  = this.query.page  || 1;
		let note = yield mongoose.model('Note').find().skip( (page-1)*limit ).limit(limit).sort({
			createtime: -1
		}).exec();
		this.body = {
			code: 0,
			data: {
				count: note.length,
				page:  page,
				limit: limit,
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