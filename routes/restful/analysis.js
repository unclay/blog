'use strict';
let moment = require('moment');
let mongo = require('mongoose');
let isPc = function(u){
	return !u.match(/AppleWebKit.*Mobile.*/) && !u.match(/AppleWebKit/);
}
module.exports = function(router){
	let cache = {
		analysis: {}
	};
	function isExpire(){
		for(var i in cache.analysis){
			if( !cache.analysis[i].expire ){
				delete cache.analysis[i];
			} else if( cache.analysis[i].expire < moment().format('X') ) {
				delete cache.analysis[i];
			}
		}
	}
	router.get('/api/analysis', function *(next){
		let start   = this.query.start;
		let end     = this.query.end;
		let url     = this.query.url;
		let type    = parseInt(this.query.type || 1, 10);
		let atype = url || 'all';
		isExpire();
		if( !!cache.analysis[atype] && cache.analysis[atype].expire > moment().format('X') && this.query.debug !== 'true' ){
			this.body = {
				error_code: 0,
				data: cache.analysis[atype].content
			};
		} else {
			
			let find = {
				type:     type,
				del_flag: 0,
				ua: {
					$exists: true
				}
			}
			if( !!url ){
				find.url = url;
				find.url = new RegExp('.*' + url + '.*', 'gi');
			}
			let result  = yield mongo.model('Clog').find(find).exec();
			// this.pg.db.client.query_(`SELECT * FROM analysis WHERE (date BETWEEN ${this.query.start} AND ${this.query.end}) AND type = 0 AND del_flag = '0'`);
			let dataObj = {
				pv: {},
				os: {},
				manufacturers: {},
				viewport: {}
			};
			const os = {
				android: function(u){ return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; },
				ios:     function(u){ return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); },
				other:   function(u){ return true; }
			}
			const manufacturers = {
				'金立':       /F\d{3}/ig,      // 金立
				'奇酷':       /8681-M02/ig,    // 奇酷
				Letv:        /Letv|X600/ig,        // 乐视
				MI:          /HM|RedMi|Mi|2014\d{3}/ig, // 小米
				Huawei:      /huawei|honor|G7-TL00|H60-L\d{2}|Che1-CL20/ig,
				Meizu:       /m[12]\snote|m1\smetal|MX\d|M\d{3}|MZ/ig, // 魅族
				OPPO:        /oppo|[RX]\d{3}[a-zA-Z0-9]|N1T/ig, // 完全没有正则可以匹配到，超级不完整的数据
				iPhone:      /iPhone/ig,
				iPod:        /ipod/ig,
				iPad:        /ipad/ig,
				SAMSUNG:     /GT-|SM-|SCH-/ig,
				Vivo:        /vivo/ig, 
				Google:      /nexus/ig, 
				Nokia:       /Nokia/ig,
				One:         /one/ig,  // 一加
				Asus:        /asus/ig, // 华硕
				HTC:         /htc/ig,  // HTC
				LG:          /LG/ig,   // LG
				Sony:        /LT\d{2}|S39h|L36h/ig, // 索尼 
				Lenovo:      /lenovo|IdeaTabA5000-E/ig,
				Meitu:       /meitu/ig, // 美图
				ZTE:         /zte/ig,   // 中兴
				ChangHong:   /ChangHong/ig, // 长虹
				CoolPad:     /Coolpad/ig,   // 酷派
				'K-Touch':   /K-Touch/ig,   // 天语
				TCL:         /TCL/ig,       // TCL
				pc:          /AppleWebKit.*Mobile.*/ig, // 移动端，必须取反
				Other:       /.*/ig
			}
			for(let item of result){
				// pv
				let dateYMD = moment(item.createtime).format('YYYY-MM-DD');
				dataObj.pv[ dateYMD ] = dataObj.pv[ dateYMD ] || 0;
				dataObj.pv[ dateYMD ]++;
				// manufacturers
				for(let mf in manufacturers){
					let regResult = new RegExp(manufacturers[mf]).test(item.ua);
					if( mf === 'pc' ){
						if( !regResult ){
							dataObj.manufacturers['pc'] = dataObj.manufacturers['pc'] || 0;
							dataObj.manufacturers['pc']++;
							break;
						}
					} else if( regResult ) {
						if( mf === 'Other' ){
							// console.log( item.ua );
						}
						dataObj.manufacturers[mf] = dataObj.manufacturers[mf] || 0;
						dataObj.manufacturers[mf]++;
						break;
					}
				}
				// os
				for(let i in os){
					dataObj.os[i] = dataObj.os[i] || 0;
					if( !!item.ua && os[i](item.ua) ){
						dataObj.os[i]++;
						break;
					}
				}
				// // viewport
				// let vp = item.ua.replace(/like Mac OS X(;)?|U;|Linux;|Android[ |\/]\d\.\d(\.\d;)?|en-us|zh-cn(;)?|Mobile;|Touch;|ARM;|Browser\/AppleWebKit\d{3}\.\d{2}|Trident\/\d\.\d;|Release\/\d{2}\.\d{2}\.\d{4} |Windows Phone \d\.\d| rv:\d{2}\.\d;|IEMobile\/\d{2}\.\d;|Configuration\/CLDC-\d\.\d|Profile\/MIDP-\d\.\d/gi, '')
				// 				.replace(/(^ )|; ;/gi, '')
				// 				.match(/\([^\)]*\)/i);
				// if( !!vp ){
				// 	// windows pc太多，排除掉
				// 	if( !vp[0].match(/Windows NT 6.1;/gi) ){
				// 		vp = vp[0].replace(/[\(\)]/g, '');
				// 		dataObj.viewport[vp] = dataObj.viewport[vp] || 0;
				// 		dataObj.viewport[vp]++;
				// 	}
				// }
				
				// .match(/\([^\)]*\)/i)

			}

			let body = {}
			// 数据重构成数组
			for(let i in dataObj){
				for(let j in dataObj[i]){
					body[i] = body[i] || [];
					body[i].push({
						name:  j,
						value: dataObj[i][j]
					});
				}
			}
			if( !!body.pv && body.pv.length >= 2 ){
				body.pv = body.pv.sort(function(a, b){
					return new Date(a.name) - new Date(b.name);
				});
			}
			

			// 缓存数据，数据库连接慢（暂定一个小时）
			cache.analysis[atype] = {
				expire: parseInt(moment().format('X'), 10) + 60*60,
				content: body
			}

			this.body = {
				error_code: 0,
				data: body
			};
		}
	});
}