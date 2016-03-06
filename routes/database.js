'use strict';
let koamongo = require('koa-mongoose-short');
let Schema   = koamongo.mongoose.Schema;

/*
 * @attr {Number} type 0:pv 1:err
 */
let ClogSchema = new Schema({
	ip:         { type: String, index: true },
	type:       { type: Number, index: true },
	ua:                 String,
	query:              String,
	createtime:         Date,
	del_flag:   { type: Number, default: 0 }
});

let UserSchema   = new Schema({
    name:               String,
    pass:               String,
    email:              String,
    showname:           String,
    avatar:             String,
    role:       { type: Schema.Types.ObjectId, ref: 'Role' },
    power:      { type: Schema.Types.ObjectId, ref: 'Power' },
    createtime: { type: Number, default: parseInt(new Date().getTime()/1000, 10) },
    updatetime: { type: Number, default: parseInt(new Date().getTime()/1000, 10) }
});

let NoteSchema = new Schema({
    title:                   String,
    intro:                   String,
    thumbnail:               String,
    content:                 String,
    author:          { type: Schema.Types.ObjectId, ref: 'User' },
    tag:            [{ type: Schema.Types.ObjectId, ref: 'Dict', index: true }],
    seo_title:               String,
    seo_keywords:            String,
    seo_description:         String,
    seo_url:         { type: String, index: true },
    status:          { type: Number, default: 0 },
    views:                   Number,
    user:           [{ type: Schema.Types.ObjectId, ref: 'User' }],
    serial:          { type: Number, default: 0 },
    istop:           { type: Number, default: 0 },
    createtime:      { type: Number, default: parseInt(new Date().getTime()/1000, 10), index: true },
    updatetime:      { type: Number, default: parseInt(new Date().getTime()/1000, 10) }
});

let DictSchema = new Schema({
    pid:        { type: Schema.Types.ObjectId, ref: 'Dict' },
    name:       { type: String, index: true },
    alias:              String,
    type:       { type: String, index: true },
    desc:               String,
    serial:     { type: Number, default: 0 },
    status:     { type: Number, default: 0 },
    createtime: { type: Number, default: parseInt(new Date().getTime()/1000, 10) },
    updatetime: { type: Number, default: parseInt(new Date().getTime()/1000, 10) }
});

let TotalSchema = new Schema({
    type:          String,
    tagid: { type: Schema.Types.ObjectId, ref: 'Dict' },
    name:          String,
    count:         Number,
    note: [{ type: Schema.Types.ObjectId, ref: 'Note'
    }]
});

let db = {
	clog:  koamongo.db.model('Clog',  ClogSchema),
	user:  koamongo.db.model('User',  UserSchema),
	note:  koamongo.db.model('Note',  NoteSchema),
	dict:  koamongo.db.model('Dict',  DictSchema),
	total: koamongo.db.model('Total', TotalSchema),
}
module.exports = function(){
	return function *(next){
		this.model = this.model || {};
		for(let i in db){
			if( !this.model[i] ) this.model[i] = db[i];
		}
		yield next;
	}
}