'use strict';
let moment = require('moment');
let isPc = function(u){
	return !u.match(/AppleWebKit.*Mobile.*/) && !u.match(/AppleWebKit/);
}
module.exports = function(router){
	let cache = {};
	router.get('/api/analysis', function *(next){
		if( !!cache.analysis && cache.analysis.expire > moment().format('X') && this.query.debug !== 'true' ){
			this.body = {
				error_code: 0,
				data: cache.analysis.content
			};
		} else {
			let start   = this.query.start;
			let end     = this.query.end;
			let result  = yield this.model.clog.find({
				createtime: {
					$gte: new Date(start*1000),
					$lte: new Date(end*1000)
				},
				type:     0,
				del_flag: 0
			}).exec();
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
				// pc:      /windows|Macintosh/ig, // pc
				iPhone:  /iphone/ig,
				iPod:    /ipod/ig,
				iPad:    /ipad/ig,
				SAMSUNG: /GT-|SM-|SCH-/ig,
				MI:      /HM|RedMi|Mi/ig, // 小米
				Huawei:  /huawei|honor/ig,
				vivo:    /vivo/ig, 
				Google:  /nexus/ig, 
				Nokia:   /Nokia/ig,
				oppo:    /oppo/ig, // 完全没有正则可以匹配到，超级不完整的数据
				one:     /one/ig,  // 一加
				asus:    /asus/ig, // 华硕
				htc:     /htc/ig,  // 
				lenovo:  /lenovo/ig,
				meitu:   /meitu/ig, // 美图
				zte:     /zte/ig,   // 中兴
				//other:   /.*/ig
			}
			for(let item of result){
				// pv
				let dateYMD = moment(item.date).format('YYYY-MM-DD');
				dataObj.pv[ dateYMD ] = dataObj.pv[ dateYMD ] || 0;
				dataObj.pv[ dateYMD ]++;
				// manufacturers
				for(let mf in manufacturers){
					if( new RegExp(manufacturers[mf]).test(item.ua) ){
						dataObj.manufacturers[mf] = dataObj.manufacturers[mf] || 0;
						dataObj.manufacturers[mf]++;
						break;
					}
				}
				// os
				for(let i in os){
					dataObj.os[i] = dataObj.os[i] || 0;
					if( os[i](item.ua) ){
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
			cache.analysis = {
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