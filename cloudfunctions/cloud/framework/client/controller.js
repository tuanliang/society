 class Controller {

 	constructor(route, openId, event) {
 		this._route = route; // 路由
 		this._openId = openId; //用户身份
		this._event = event; // 所有参数   
		this._request = event.params; //数据参数

 	}
 }

 module.exports = Controller;