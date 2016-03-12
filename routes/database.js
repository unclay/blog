'use strict';
let mongoose = require('mongoose');
let Schema   = mongoose.Schema;

/*
 * @attr {Number} type 0:pv 1:err
 */
let ClogSchema = new Schema({
	ip:         { type: String, index: true },
	type:       { type: Number, index: true },
    url:        { type: String, index: true },
    ref:        { type: String, index: true },
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

// let db = {
// 	clog:  mongoose.model('Clog',  ClogSchema),
// 	user:  mongoose.model('User',  UserSchema),
// 	note:  mongoose.model('Note',  NoteSchema),
// 	dict:  mongoose.model('Dict',  DictSchema),
// 	total: mongoose.model('Total', TotalSchema),
// }
module.exports = function(options){
    options = options || {};
    mongoose.connect(options.url, options.err || function(err){
        if(!!err) console.error(err);
    });
    mongoose.model('Clog',  ClogSchema);
    mongoose.model('User',  UserSchema);
    mongoose.model('Note',  NoteSchema);
    mongoose.model('Dict',  DictSchema);
    mongoose.model('Total', TotalSchema);

	// return function *(next){
	// 	this.model = this.model || {};
	// 	for(let i in db){
	// 		if( !this.model[i] ) this.model[i] = db[i];
	// 	}
	// 	yield next;
	// }
}