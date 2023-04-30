const ANewsBiz = require('../../../../biz/admin_news_biz.js');
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

	bindSortTap: async function (e) {
		if (!ABiz.isAdmin(this)) return;

		let id = e.currentTarget.dataset.id;
		let sort = e.currentTarget.dataset.sort;
		if (!id || !sort) return;

		let params = {
			id,
			sort
		}

		try {
			await chelper.callCloudSumbit('admin/news_sort', params).then(res => {
				pHelper.modifyListNode(id, this.data.dataList.list, 'NEWS_HOME', sort);
				this.setData({
					dataList: this.data.dataList
				});
			});
		} catch (e) {
			console.log(e);
		}
	},

	_del: async function (id, that) {
		if (!ABiz.isAdmin(this)) return;
		if (!id) return;

		let params = {
			id
		}

		let callback = async () => {
			try {
				let opts = {
					title: '删除中'
				}
				await chelper.callCloudSumbit('admin/news_del', params, opts).then(res => {
					pHelper.delListNode(id, that.data.dataList.list, '_id');
					that.data.dataList.total--;
					that.setData({
						dataList: that.data.dataList
					});
					pHelper.showSuccToast('删除成功');
				});
			} catch (e) {
				console.log(e);
			}
		}
		pHelper.showConfirm('确认删除？删除不可恢复', callback);

	},

	bindReviewTap: function (e) {
		let id = pHelper.dataset(e, 'id');
		wx.navigateTo({
			url: pHelper.fmtURLByPID('/pages/news/detail/news_detail?id=' + id),
		});
	},
  binddelete:function (e) {
    if (!ABiz.isAdmin(this)) return;
    let id = pHelper.dataset(e, 'id');
    this._del(id, this);
  },
  bindqiyong:function (e) {
    if (!ABiz.isAdmin(this)) return;
    let id = pHelper.dataset(e, 'id');
    this._setStatus(id, 1, this);
  },  
  bindtingyong:function (e) {
    if (!ABiz.isAdmin(this)) return;
    let id = pHelper.dataset(e, 'id');
    this._setStatus(id, 0, this);
  },

	_setStatus: async function (id, status, that) {
		status = Number(status);
		let params = {
			id,
			status
		}
    let callback = async () => {
		try {
			await chelper.callCloudSumbit('admin/news_status', params).then(res => {
				pHelper.modifyListNode(id, that.data.dataList.list, 'NEWS_STATUS', status, '_id');
				that.setData({
					dataList: that.data.dataList
				});
				pHelper.showSuccToast('设置成功');
			});
		} catch (e) {
			console.log(e);
    }
  }
  pHelper.showConfirm('是否修改启用、停用状态', callback);
	},

	_getSearchMenu: async function () {
		let arr = await ANewsBiz.getCateList();

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
				label: '停用',
				type: 'status',
				value: 0
			},
			{
				label: '首页推荐',
				type: 'home',
				value: 0
			}
		]
		sortMenus = sortMenus.concat(arr);
		this.setData({
			sortItems,
			sortMenus
		})


	}

})