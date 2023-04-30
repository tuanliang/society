const ABiz = require('../../../../biz/admin_biz.js');
const AdminMeetBiz = require('../../../../biz/admin_meet_biz.js');
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

	bindScanTap: function (e) {
		let meetId = pHelper.dataset(e, 'id');
		let title = encodeURIComponent(pHelper.dataset(e, 'title'));
		wx.navigateTo({
			url: '../scan/admin_meet_scan?meetId=' + meetId + '&title=' + title,
		});
	},

	bindMoreSelectTap: async function (e) {
		let itemList = ['预览'];
		let meetId = pHelper.dataset(e, 'id');
		
    wx.navigateTo({
      url: pHelper.fmtURLByPID('/pages/meet/detail/meet_detail?id=' + meetId),
    });
				
	},
  bindqiyong:function (e) {
    let meetId = pHelper.dataset(e, 'id');
    this._setStatus(meetId, 1, this);
  },
  bindtingzhi:function (e) {
    let meetId = pHelper.dataset(e, 'id');
    this._setStatus(meetId, 9, this);
  },
  bindzhiding:function (e) {
    let meetId = pHelper.dataset(e, 'id');
    this._setSort(meetId, 0, this);
  },  
  bindquxiaozhiding:function (e) {
    let meetId = pHelper.dataset(e, 'id');
    this._setSort(meetId, 9999, this);
	},

  bindStatusSelectTap3: async function (e) {
		let itemList = [ '删除'];
		let meetId = pHelper.dataset(e, 'id');
		
		await this._del(meetId, this);


	},

	_setSort: async function (meetId, sort, that) {
		if (!ABiz.isAdmin(this)) return;
		if (!meetId) return;

		let params = {
			meetId,
			sort
		}
		let callback = async function () {
		try {
			await chelper.callCloudSumbit('admin/meet_sort', params).then(res => {
				pHelper.modifyListNode(meetId, that.data.dataList.list, 'MEET_ORDER', sort);
				that.setData({
					dataList: that.data.dataList
				});
				pHelper.showSuccToast('设置成功');
			});
		} catch (e) {
			console.log(e);
    }
  }
    pHelper.showConfirm('确认修改置顶状态？',callback);
	},

	_del: async function (meetId, that) {
		if (!ABiz.isAdmin(this)) return;
		if (!meetId) return;

		let params = {
			meetId
		}

		let callback = async function () {
			try {
				let opts = {
					title: '删除中'
				}
				await chelper.callCloudSumbit('admin/meet_del', params, opts).then(res => {
					pHelper.delListNode(meetId, that.data.dataList.list, '_id');
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

	_setStatus: async function (meetId, status, that) {
		if (!ABiz.isAdmin(this)) return;
		if (!meetId) return;

		let params = {
			meetId,
			status
    }
    let callback = async function () {
		try {
			await chelper.callCloudSumbit('admin/meet_status', params).then(res => {
				pHelper.modifyListNode(meetId, that.data.dataList.list, 'MEET_STATUS', status, '_id');
				that.setData({
					dataList: that.data.dataList
				});
				pHelper.showSuccToast('设置成功');
			});
		} catch (e) {
			console.log(e);
    }
  }
  pHelper.showConfirm('确认修改预约状态', callback);
	},

	_getSearchMenu: async function () {
		let arr = await AdminMeetBiz.getTypeList();

		let sortItems = [];
		let sortMenus = [{
				label: '全部',
				type: '',
				value: ''
			}, {
				label: '使用中',
				type: 'status',
				value: 1
			},
			{
				label: '已停止',
				type: 'status',
				value: 9
			},
			{
				label: '已关闭',
				type: 'status',
				value: 10
			},

		];
		sortMenus = sortMenus.concat(arr);
		this.setData({
			sortItems,
			sortMenus
		})


	}

})