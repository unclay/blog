(function(win, doc){
	/*
	 * @instance params
	 *   - params 统计实例的参数配置
	 *      - name 统计实例的名字
	 *      - url  统计实例发送统计的url
	 *   - query  实际发送统计的参数
	 *      - common 公共部分参数
	 *         - u     当前地址
	 *         - t     统计的类型（0是pv，1是js异常）
	 *      - pv     统计pv的参数
	 *         - ds    分辨率
	 *         - ref   来源referrer
	 *      - err    统计js异常的参数
	 *         - emsg  错误消息
	 *         - euri  错误的js文件名
	 *         - eline 错误的js文件当前行号
	 *         - ecol  错误的js文件当前列号
	 */
	win._cl  = win._cl || {}
	var name = win._cl.name || 'clog';
	var clog = clog || function(){
		this.params = win._cl || {};
		this.query  = this.query  || {};
		this.query.common = {};
		this.query.pv     = {};
		this.query.err    = {};
	}
	clog.prototype.pv = function() {
		this.query.common.t = 1;
		this.query.pv.ds    = window.screen.width + 'x' + window.screen.height; // 分辨率
		if( !!doc.referrer ) this.query.pv.ref   = encodeURIComponent(doc.referrer); // 来源
		this.send(this.query.pv);
	};
	clog.prototype.send = function(query){
		var commonQuery = [];
		for(var i in this.query.common){
			commonQuery.push( i + '=' + this.query.common[i] );
		}
		for(var i in query){
			commonQuery.push( i + '=' + query[i] );
		}
		new Image().src = this.params.url + '?' + commonQuery.join('&');
	}
	win[name] = new clog();
	win[name].pv();
	delete win._cl;
	window.onerror = function(message, uri, lineNumber, colNumber, errObj){
		// 非同源问题不收集
		if( !message.match(/Script error/gi) ){
			win[name].query.common.t  = 2;
			win[name].query.err.emsg  = message;
			win[name].query.err.euri  = uri;
			win[name].query.err.eline = lineNumber;
			win[name].query.err.ecol  = colNumber;
			win[name].send( win[name].query.err );
		}
	}
}(window, document));