

const BaseAdminService = require('./base_admin_service.js');

const dataUtil = require('../../../framework/utils/data_util.js');
const util = require('../../../framework/utils/util.js');
const cloudUtil = require('../../../framework/cloud/cloud_util.js');

const NewsModel = require('../../model/news_model.js');

class AdminNewsService extends BaseAdminService { 

	/**添加资讯 */
	async insertNews(adminId, {
		title,
		cateId, //分类
		cateName,
		order,
		type = 0, //类型 
		desc = '',
		url = '', //外部链接

	}) {


		// 重复性判断
		let where = {
			NEWS_TITLE: title,
		}
		if (await NewsModel.count(where))
			this.AppError('该标题已经存在');

		// 赋值 
		let data = {};
		data.NEWS_TYPE = type;
		data.NEWS_TITLE = title;
		data.NEWS_CATE_ID = cateId;
		data.NEWS_CATE_NAME = cateName;
		data.NEWS_ORDER = order;
		data.NEWS_DESC = dataUtil.fmtText(desc, 100);

		if (type == 0) {
			// 内部文章  
			data.NEWS_URL = '';
		} else {
			// 外部链接  
			data.NEWS_URL = url;
		}


		data.NEWS_ADMIN_ID = adminId;

		let id = await NewsModel.insert(data);


		return {
			id
		};
	}

	/**删除资讯数据 */
	async delNews(id) {
		let where = {
			_id: id
		}

		// 取出图片数据
		let news = await NewsModel.getOne(where, 'NEWS_PIC,NEWS_CATE_ID');
		if (!news) return;

		await NewsModel.del(where);

		// 异步删除图片  
		cloudUtil.deleteFiles(news.NEWS_PIC);

	}

	/**获取资讯信息 */
	async getNewsDetail(id) {
		let fields = '*';

		let where = {
			_id: id
		}
		let news = await NewsModel.getOne(where, fields);
		if (!news) return null;

		return news;
	}

	/**
	 * 更新富文本详细的内容及图片信息
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updateNewsContent({
		newsId,
		content // 富文本数组
	}) {

		// 获取数据库里的图片数据
		let news = await NewsModel.getOne(newsId, 'NEWS_CONTENT');

		// 处理 新旧文件
		content = await cloudUtil.handlerCloudFilesByRichEditor(news.NEWS_CONTENT, content);

		//更新数据库
		let data = {
			NEWS_CONTENT: content
		};
		await NewsModel.edit(newsId, data);

	}

	/**
	 * 更新资讯图片信息
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updateNewsPic({
		newsId,
		imgList // 图片数组
	}) {

		// 获取数据库里的图片数据
		let news = await NewsModel.getOne(newsId, 'NEWS_PIC');

		// 处理 新旧文件
		let picList = await cloudUtil.handlerCloudFiles(news.NEWS_PIC, imgList);

		//更新数据库
		let data = {
			NEWS_PIC: picList
		};
		await NewsModel.edit(newsId, data);

	}


	/**更新资讯数据 */
	async editNews({
		id,
		title,
		cateId, //分类
		cateName,
		order,
		type = 0, //类型 
		desc = '',
		url = '', //外部链接
	}) {

		// 重复性判断
		let where = {
			NEWS_TITLE: title,
			_id: ['<>', id]
		}
		if (await NewsModel.count(where))
			this.AppError('该标题已经存在');

		// 赋值 
		let data = {};
		data.NEWS_TYPE = type;
		data.NEWS_TITLE = title;
		data.NEWS_CATE_ID = cateId;
		data.NEWS_CATE_NAME = cateName;
		data.NEWS_ORDER = order;
		data.NEWS_DESC = dataUtil.fmtText(desc, 100);

		if (type == 0) {
			// 内部文章 
			data.NEWS_URL = '';
		} else {
			// 外部链接  
			data.NEWS_URL = url;
		}


		await NewsModel.edit(id, data);
	}

	/**取得资讯分页列表 */
	async getNewsList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'NEWS_ORDER': 'asc',
			'NEWS_ADD_TIME': 'desc'
		};
		let fields = 'NEWS_TYPE,NEWS_URL,NEWS_TITLE,NEWS_DESC,NEWS_CATE_ID,NEWS_EDIT_TIME,NEWS_ADD_TIME,NEWS_ORDER,NEWS_STATUS,NEWS_CATE_NAME,NEWS_HOME';

		let where = {};

		if (util.isDefined(search) && search) {
			where.or = [{
				NEWS_TITLE: ['like', search]
			}, ];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'cateId':
					// 按类型
					where.NEWS_CATE_ID = sortVal;
					break;
				case 'status':
					// 按类型
					where.NEWS_STATUS = Number(sortVal);
					break;
				case 'home':
					// 按类型
					where.NEWS_HOME = Number(sortVal);
					break;
				case 'sort':
					// 排序
					if (sortVal == 'view') {
						orderBy = {
							'NEWS_VIEW_CNT': 'desc',
							'NEWS_ADD_TIME': 'desc'
						};
					}
					if (sortVal == 'new') {
						orderBy = {
							'NEWS_ADD_TIME': 'desc'
						};
					}
					break;
			}
		}

		return await NewsModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	/**修改资讯状态 */
	async statusNews(id, status) {
		let data = {
			NEWS_STATUS: status
		}
		let where = {
			_id: id,
		}
		return await NewsModel.edit(where, data);
	}

	/**资讯置顶排序设定 */
	async sortNews(id, sort) {
		sort = Number(sort)
		let data = {
			NEWS_HOME: sort
		}
		await NewsModel.edit(id, data);
	}
}

module.exports = AdminNewsService;