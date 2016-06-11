const API = {
	GET: function *(){
		// console.log( typeof this.session.user );
		this.body = this.session.user ;
		// this.body = (!!this.session ? (this.session.user || 'err') : 'err');
	}
}
module.exports = API;