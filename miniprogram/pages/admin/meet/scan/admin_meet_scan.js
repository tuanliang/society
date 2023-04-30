const ABiz = require('../../../../biz/admin_biz.js');
const pHelper = require('../../../../helper/page_helper.js'); 
const chelper = require('../../../../helper/cloud_helper.js'); 


Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: true,
		title: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if (!ABiz.isAdmin(this)) return;

		if (!pHelper.getOptions(this, options, 'meetId')) return;

		if (options && options.title) {
			let title = decodeURIComponent(options.title);
			this.setData({
				title
			});
		}
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

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

	bindScanTap: function (e) {
		let meetId = this.data.meetId;
		wx.scanCode({
			async success(res) {
				console.log(res)
				if (!res ||
					!res.result ||
					!res.result.includes('meet=') ||
					res.result.length != 20) {
					pHelper.showModal('错误的预约码，请重新扫码');
					return;
				}

				let code = res.result.replace('meet=', '');
				let params = {
					meetId,
					code
				};
				let options = {
					title: '预约码核销中'
				}
				await chelper.callCloudSumbit('admin/join_scan', params, options).then(res => {
					pHelper.showModal('核销成功');

				}).catch(err => {
					console.log(err);
				});
			},
			fail(err) {
				if (err && err.errMsg == 'scanCode:fail')
					pHelper.showModal('预约码核销错误，请重新扫码');
			}
		});
	}
})