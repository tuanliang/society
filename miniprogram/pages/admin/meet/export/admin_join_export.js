const ABiz = require('../../../../biz/admin_biz.js');
const pHelper = require('../../../../helper/page_helper.js'); 
const chelper = require('../../../../helper/cloud_helper.js');
const timeHelper = require('../../../../helper/time_helper.js');
const fileHelper = require('../../../../helper/file_helper.js'); 

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		title: '',

		url: '',
		time: '',

		startDay: timeHelper.time('Y-M-D'),
		endDay: timeHelper.time('Y-M-D'),
		status: 1
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

		this._loadDetail(1);
	},

	_loadDetail: async function (isDel) {
		if (!ABiz.isAdmin(this)) return;

		let params = {
			isDel
		}
		let options = {
			title: 'bar'
		}
		let data = await chelper.callCloudData('admin/join_data_get', params, options);

		if (!data) return;

		this.setData({
			isLoad: true,
			url: data.url,
			time: data.time
		})

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

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
		await this._loadDetail(1);
		wx.stopPullDownRefresh();
	},

	bindOpenTap:function(e) {
		fileHelper.openDoc('预约名单', this.data.url);
	},

	url: async function (e) {
		pHelper.url(e, this);
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	bindExportTap: async function (e) {
		try {
			let options = {
				title: '数据生成中'
			}

			let params = {
				meetId: this.data.meetId,
				startDay: this.data.startDay,
				endDay: this.data.endDay,
				status: this.data.status
			}

			await chelper.callCloudData('admin/join_data_export', params, options).then(res => {  
				this._loadDetail(0);
				pHelper.showModal('数据文件生成成功(' + res.total + '条记录), 请点击「直接打开」按钮或者复制文件地址下载');

			});
		} catch (err) {
			console.log(err);
			pHelper.showNoneToast('导出失败，请重试');
		}

	},

	bindDelTap: async function (e) {
		try {
			let options = {
				title: '数据删除中'
			}
			await chelper.callCloudData('admin/join_data_del', {}, options).then(res => {
				this.setData({
					url: '',
					time: ''
				});
				pHelper.showSuccToast('删除成功');
			});
		} catch (err) {
			console.log(err);
			pHelper.showNoneToast('删除失败，请重试');
		}

	},


})