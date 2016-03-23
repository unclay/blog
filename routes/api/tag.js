'use strict';
const mongoose = require('mongoose');

const API = {
	GET: function *(){
		let page  = parseInt(this.query.page || 1, 10);
		let limit = parseInt(this.query.limit || 10, 10);
		let tag = yield mongoose.model('Dict').find({
			type: 'tag',
			del_flag: {
				$ne: 1
			}
		}).skip( (page-1)*limit ).limit(limit).exec();
		this.body = {
			code: 0,
			data: {
				count: tag.length,
				page: page,
				limit: limit,
				list: tag
			}
		};
	},
	POST: function *(){
		let body = this.cbody;
		body.type = 'tag';
		let tag  = yield mongoose.model('Dict').create(body);
		this.body = {
			code: 0,
			data: tag
		}
	},
	DELETE: function *(){
		let body = this.cbody;
		let tag  = yield mongoose.model('Dict').update({
			_id: body._id
		}, {
			del_flag: 1
		}).exec();
		this.body = {
			code: 0,
			data: tag
		}
	}
}
module.exports = API;