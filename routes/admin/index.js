const fs = require('co-fs');
// 登录中间件
const auth = function *(next){
	if( !this.session.user ){
		this.redirect('/admin/login.wcl');
	} else {
		yield next;
	}
}
module.exports = function(router){

	// 登录页面
	router.get('/login.wcl', function *(next){
		if( !!this.session.user ){
			this.redirect('/admin/index.wcl');
		} else if( yield fs.exists( `${process.env.PWD}/views/admin/login.html` ) ){
			yield this.render('admin/login', {
				layout: 'admin/login'
			});
		}
	});

	// 退出登录，并跳转到登录页
	router.get('/logout.wcl', function *(next){
		this.session = null;
		this.redirect('/admin/login.wcl');
	});

	// 后台页面输出
	router.get('/:page.wcl', auth, function *(next){
		// 读取存在的页面
		if( yield fs.exists( `${process.env.PWD}/views/admin/${this.params.page}.html` ) ){
			yield this.render(`admin/${this.params.page}`, {
				layout: 'admin/layout'
			});
		}
	});

	require('./page')(router);

}