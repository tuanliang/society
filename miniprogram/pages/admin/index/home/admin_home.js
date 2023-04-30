const ABiz = require('../../../../biz/admin_biz.js');
const pHelper = require('../../../../helper/page_helper.js');
const chelper = require('../../../../helper/cloud_helper.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!ABiz.isAdmin(this)) return;


		this._loadDetail();
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
		await this._loadDetail();
		wx.stopPullDownRefresh();
	},

	_loadDetail: async function () {

		let admin = ABiz.getAdminToken();
		this.setData({
			isLoad: true,
			admin
		});

		try {
			let opts = {
				title: 'bar'
			}
			let res = await chelper.callCloudData('admin/home', {}, opts);
			this.setData({

				data: res
			});

		} catch (err) {
			console.log(err);
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

	url: function (e) {
		pHelper.url(e, this);
	},

	bindExitTap: function (e) {

		let callback = function () {
			ABiz.clearAdminToken();
			wx.reLaunch({
				url: pHelper.fmtURLByPID('/pages/my/index/my_index'),
			});
		}
		pHelper.showConfirm('您确认退出?', callback);
	},

	bindSettingTap: function (e) {
		let itemList = ['清除数据缓存'];
		wx.showActionSheet({
			itemList,
			success: async res => {
				switch (res.tapIndex) {
					case 0: { //清除缓存
						await this._clearCache();
						break;
					}
				}
			},
			fail: function (res) {}
		})
	},

	_clearCache: async function () {
		try {
			let opts = {
				title: '数据缓存清除中'
			}
			await chelper.callCloudSumbit('admin/clear_cache', {}, opts).then(res => {
				pHelper.showSuccToast('清除成功');
			});
		} catch (err) {
			console.error(err);
		}
	}

})