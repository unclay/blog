'use strict';
const mongoose = require('mongoose');

const API = {
	GET: function *(){
/*
# （标签列表）
## GET接口
### 接口描述
	获取所有标签的信息
### 参数
	null
### 正确返回
 */
		let tag = yield mongoose.model('Dict').find({
			type: 'tag',
			del_flag: {
				$ne: 1
			}
		}).exec();
		this.body = {
			code: 0,
			data: {
				count: tag.length,
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