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

  binftoyuyue: function (e) {
    let meetId = pHelper.dataset(e, 'id');
    let title = encodeURIComponent(pHelper.dataset(e, 'title'));
    wx.navigateTo({
      url: '../record/admin_record_list?meetId=' + meetId + '&title=' + title,
    });
  },
  binftoexecl: function (e) {
    let meetId = pHelper.dataset(e, 'id');
    let title = encodeURIComponent(pHelper.dataset(e, 'title'));
    wx.navigateTo({
      url: '../export/admin_join_export?meetId=' + meetId + '&title=' + title,
    });
  },
	bindRecordSelectTap: async function (e) {
		let itemList = ['预约名单', '导出名单Excel文件'];
		let meetId = pHelper.dataset(e, 'id');
		let title = encodeURIComponent(pHelper.dataset(e, 'title'));

		wx.showActionSheet({
			itemList,
			success: async res => {
				switch (res.tapIndex) {
					case 0: { //预约名单 
						wx.navigateTo({
							url: '../record/admin_record_list?meetId=' + meetId + '&title=' + title,
						});
						break;
					}
					case 1: { //导出 
						wx.navigateTo({
							url: '../export/admin_join_export?meetId=' + meetId + '&title=' + title,
						});
						break;
					}				
				}
			},
			fail: function (res) {}
		})
	},

	bindMoreSelectTap: async function (e) {
		let itemList = ['预览'];
		let meetId = pHelper.dataset(e, 'id');
		
    wx.navigateTo({
      url: pHelper.fmtURLByPID('/pages/meet/detail/meet_detail?id=' + meetId),
    });
				
	},



	_setSort: async function (meetId, sort, that) {
		if (!ABiz.isAdmin(this)) return;
		if (!meetId) return;

		let params = {
			meetId,
			sort
		}

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