'use strict';
var marked = require('marked');
var mongoose = require('mongoose');
var total = require('./total');

module.exports = function(router){
	
	// 首页
	router.get('/', function *(next){
		yield this.render('index');
	});

	// 历史
	router.get('/course', function *(next){
		yield this.render('course');
	});

	router.get('/note', function *(next){
		let tag    = total.get();
		let note   = yield mongoose.model('Note').find().sort({
			createtime: 'desc'
		}).limit(10);
		let count  = note.length;
		let result = {};
		for(let item of note){
			let year = new Date(item.createtime*1000).getFullYear();
			result[year] = result[year] || [];
			result[year].push( item );
		}
		note = [];
		for(let i in result){
			note.push({
				year: i,
				list: result[i]
			});
		}
		note = note.sort(function(a, b){
			return a.year < b.year
		});
		yield this.render('note', {
			note:    note,
			tag:     tag,
			tagname: '随笔'
		});
	});

	router.get('/note/tag/:tag', function *(next){
		let tag    = total.get();
		let tagid  = yield mongoose.model('Dict').findOne({
			type: 'tag',
			name: this.params.tag
		}).select('_id');
		let note   = yield mongoose.model('Note').find({
			tag: tagid._id
		}).sort({
			createtime: 'desc'
		});
		let count  = note.length;
		let result = {};
		for(let item of note){
			let year = new Date(item.createtime*1000).getFullYear();
			result[year] = result[year] || [];
			result[year].push( item );
		}
		note = [];
		for(let i in result){
			note.push({
				year: i,
				list: result[i]
			});
		}
		note = note.sort(function(a, b){
			return a.year < b.year
		});
		yield this.render('note', {
			note: note,
			tag:     tag,
			tagname: this.params.tag
		});
	});

	router.get('/note/:note', function *(next){
		let tag    = total.get();
		var note   = yield mongoose.model('Note').findOne({
				seo_url: this.params.note
			}).populate('tag', '-_id name');
		note.content = marked(note.content || '');
		yield this.render('note_item', {
			tag: tag,
			note: note
		});
	});
}