const ABiz = require('../../../../biz/admin_biz.js');
const pHelper = require('../../../../helper/page_helper.js');
const bizHelper = require('../../../../biz/biz_helper.js');
const chelper = require('../../../../helper/cloud_helper.js');
const validate = require('../../../../helper/validate.js');
const ANewsBiz = require('../../../../biz/admin_news_biz.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!ABiz.isAdmin(this)) return;

		this.setData(await ANewsBiz.initFormData()); // 初始化表单数据
		this.setData({
			isLoad: true
		});

		this._setContentDesc();
	},

	_setContentDesc: function () {
		ABiz.setContentDesc(this);
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

	model: function (e) {
		pHelper.model(this, e);
	},

	/** 
	 * 数据提交
	 */
	bindFormSubmit: async function () {
		if (!ABiz.isAdmin(this)) return;

		let data = this.data;
		// 数据校验  by 类型
		if (data.formType == 0) { // 内部
			if (this.data.formContent.length == 0) {
				return pHelper.showModal('详细内容不能为空');
			}
			data = validate.check(data, ANewsBiz.CHECK_FORM, this);
		} else { // 外部
			data = validate.check(data, ANewsBiz.CHECK_FORM_OUT, this);
		}

		if (!data) return;
		data.cateName = ANewsBiz.getCateName(data.cateId);


		try {
			if (this.data.imgList.length == 0) {
				return pHelper.showModal('请上传封面图');
			}

			// 提取简介
			data.desc = ANewsBiz.getDesc(data.desc, this.data.formContent);

			// 先创建，再上传 
			let result = await chelper.callCloudSumbit('admin/news_insert', data);
			let newsId = result.data.id;

			// 图片 提交处理 
			wx.showLoading({
				title: '提交中...',
				mask: true
			});
			let imgList = this.data.imgList;
			await ANewsBiz.updateNewsPic(newsId, imgList);

			let formContent = this.data.formContent;
			if (formContent && formContent.length > 0) {
				wx.showLoading({
					title: '提交中...',
					mask: true
				});
				await ANewsBiz.updateNewsCotnentPic(newsId, formContent, this);
			}

			let callback = async function () {
				bizHelper.removeCacheList('admin-news');
				bizHelper.removeCacheList('news-list');
				wx.navigateBack();

			}
			pHelper.showSuccToast('添加成功', 2000, callback);

		} catch (err) {
			console.log(err);
		}

	},


	bindImgUploadCmpt: function (e) {
		this.setData({
			imgList: e.detail
		});
	},

	switchModel: function (e) {
		pHelper.switchModel(this, e);
	},

	url: function (e) {
		pHelper.url(e, this);
	}
})