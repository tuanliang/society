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

		//设置搜索菜单
		await this._getSearchMenu();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () {},

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

	url: async function (e) {
		pHelper.url(e, this);
	},


	bindCommListCmpt: function (e) {
		pHelper.commListListener(this, e);
	},

	bindDelTap: async function (e) {
		if (!ABiz.isAdmin(this)) return;
		let id = pHelper.dataset(e, 'id');

		let params = {
			id
		}

		let callback = async () => {
			try {
				let opts = {
					title: '删除中'
				}
				await chelper.callCloudSumbit('admin/user_del', params, opts).then(res => {
					
					pHelper.delListNode(id, this.data.dataList.list, 'USER_MINI_OPENID');
					this.data.dataList.total--;
					this.setData({
						dataList: this.data.dataList
					});
					pHelper.showSuccToast('删除成功');
				});
			} catch (e) {
				console.log(e);
			}
		}
		pHelper.showConfirm('确认删除？删除不可恢复', callback);

	},

	bindStatusTap: async function (e) {
		if (!ABiz.isAdmin(this)) return;
		let id = pHelper.dataset(e, 'id');
		let status = pHelper.dataset(e, 'status');

		let params = {
			id,
			status
		}
		try {
			await chelper.callCloudSumbit('admin/user_status', params).then(res => {
				pHelper.modifyListNode(id, this.data.dataList.list, 'USER_STATUS', status, 'USER_MINI_OPENID');
				this.setData({
					dataList: this.data.dataList
				});
				pHelper.showSuccToast('设置成功');
			});
		} catch (e) {
			console.log(e);
		}
	},

	_getSearchMenu: async function () {

		let sortItems = [];
		let sortMenus = [{
				label: '全部',
				type: '',
				value: ''
			}, {
				label: '正常',
				type: 'status',
				value: 1
			}, 
			{
				label: '注册时间正序',
				type: 'sort',
				value: 'newasc'
			},
			{
				label: '注册时间倒序',
				type: 'sort',
				value: 'newdesc'
			},

		]
		this.setData({
			sortItems,
			sortMenus
		})


	}

})