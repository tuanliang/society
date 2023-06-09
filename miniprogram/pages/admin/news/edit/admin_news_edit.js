const ABiz = require('../../../../biz/admin_biz.js');
const pHelper = require('../../../../helper/page_helper.js');
const chelper = require('../../../../helper/cloud_helper.js');
const validate = require('../../../../helper/validate.js');
const ANewsBiz = require('../../../../biz/admin_news_biz.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!ABiz.isAdmin(this)) return;
		if (!pHelper.getOptions(this, options)) return;

		this._loadDetail();
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
		await this._loadDetail();
		wx.stopPullDownRefresh();
	},

	model: function (e) {
		pHelper.model(this, e);
	},

	_loadDetail: async function () {
		if (!ABiz.isAdmin(this)) return;

		let id = this.data.id;
		if (!id) return;

		if (!this.data.isLoad) this.setData(await ANewsBiz.initFormData(id)); // 初始化表单数据

		let params = {
			id
		};
		let opt = {
			title: 'bar'
		};
		let news = await chelper.callCloudData('admin/news_detail', params, opt);
		if (!news) {
			this.setData({
				isLoad: null
			})
			return;
		};


		this.setData({
			isLoad: true,

			imgList: news.NEWS_PIC,

			// 表单数据 
			formCateId: news.NEWS_CATE_ID,
			formOrder: news.NEWS_ORDER,

			formType: news.NEWS_TYPE,

			formTitle: news.NEWS_TITLE,
			formContent: news.NEWS_CONTENT,

			formDesc: news.NEWS_DESC,
			formUrl: news.NEWS_URL,
		}, () => {
			this._setContentDesc();
		});
	},

	_setContentDesc: function () {
		ABiz.setContentDesc(this);
	},

	/** 
	 * 数据提交
	 */
	bindFormSubmit: async function () {
		if (!ABiz.isAdmin(this)) return;

		let data = this.data;
		// 数据校验  by 类型
		if (data.formType == 0) { //内部
			if (this.data.formContent.length == 0) {
				return pHelper.showModal('详细内容不能为空');
			}
			data = validate.check(data, ANewsBiz.CHECK_FORM, this);
		} else { //外部
			data = validate.check(data, ANewsBiz.CHECK_FORM_OUT, this);
		}

		if (!data) return;
		data.cateName = ANewsBiz.getCateName(data.cateId);

		try {
			let newsId = this.data.id;
			data.id = newsId;

			if (this.data.imgList.length == 0) {
				return pHelper.showModal('请上传封面图');
			}

			// 提取简介  
			data.desc = ANewsBiz.getDesc(data.desc, this.data.formContent);

			// 先修改，再上传 
			await chelper.callCloudSumbit('admin/news_edit', data);

			// 图片 提交处理 
			wx.showLoading({
				title: '提交中...',
				mask: true
			});
			let imgList = this.data.imgList;
			await ANewsBiz.updateNewsPic(newsId, imgList);

			let formContent = this.data.formContent;
			wx.showLoading({
				title: '提交中...',
				mask: true
			});
			await ANewsBiz.updateNewsCotnentPic(newsId, formContent, this);



			let callback = async () => {

				// 更新列表页面数据
				let node = {
					'NEWS_TITLE': data.title,
					'NEWS_CATE_NAME': data.cateName,
					'NEWS_ORDER': data.order,
					'NEWS_TYPE': data.type
				}
				pHelper.modifyPrevPageListNodeObject(newsId, node);

				wx.navigateBack();

			}
			pHelper.showSuccToast('修改成功', 2000, callback);

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