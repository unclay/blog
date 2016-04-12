'use strict';

const mongoose = require('mongoose');
const co       = require('co');
const thunkify = require('thunkify');

// 提供tag统计随笔数量
let totals = [];

class Totals {
	constructor() {
		
	}
	set(cb) {
		var _this = this;
		co(function *(){
			// 查询所有tag标签
			let tags = yield mongoose.model('Dict').find({
				type: 'tag',
				del_falg: {
					$ne: 1
				}
			}).select('name type').exec();
			let noteCounts = [];
			// 通过tag标签查询对应的随笔数量
			for(let tag of tags ){
				noteCounts.push({
					name: tag.name,
					type: tag.type,
					fid:  tag._id,
					count: yield mongoose.model('Note').find({
						tag: tag._id
					}).count()
				});
			}
			totals = noteCounts;
			cb( null, totals );
		}).catch(cb);
	}
	get() {
		return totals;
	}
	init() {
		var _this = this;
		co(function *(){
			for(let i=0; i<3; i++){
				let totals = yield thunkify(_this.set)();
				if( !!totals && totals.length > 0 ){
					break;
				}
			}
		}).catch(function(err){
			console.error(err);
		});
	}
}
module.exports = new Totals();