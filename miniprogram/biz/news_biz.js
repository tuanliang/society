const BaseBiz = require('./base_biz.js'); ;

class NewsBiz extends BaseBiz {  

	/** 搜索菜单设置 */
	static async getSearchMenu() {
		let sortMenus = [{
			label: '全部',
			type: '',
			value: ''
		}];
		let sortMenusAfter = [{
			label: '最新',
			type: 'sort',
			value: 'new'
		}, ];
		let sortItems = [];

		sortMenus = sortMenus.concat(sortMenusAfter);

		return {
			sortItems,
			sortMenus
		} 
	}
}

module.exports = NewsBiz;