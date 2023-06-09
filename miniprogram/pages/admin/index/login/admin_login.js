const ABiz = require('../../../../biz/admin_biz.js'); 
const pHelper = require('../../../../helper/page_helper.js'); 
const PassportBiz = require('../../../../biz/passport_biz.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		name: '',
		pwd: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		ABiz.clearAdminToken();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	url: function (e) {
		pHelper.url(e, this);
	},

	bindBackTap: function (e) {
		wx.reLaunch({
			url: pHelper.fmtURLByPID('/pages/my/index/my_index'),
		});
	},

	bindLoginTap: async function (e) {
		return PassportBiz.adminLogin(this.data.name, this.data.pwd, this);
	}

})