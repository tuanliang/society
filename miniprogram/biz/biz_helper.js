const cacheHelper = require('../helper/cache_helper.js');
const setting = require('../setting/setting.js');  
  

function isCacheList(key) {
	key = key.toUpperCase();
	if (setting.CACHE_IS_LIST)
		return cacheHelper.get(key + '_LIST');
	else
		return false;
}

function removeCacheList(key) {
	key = key.toUpperCase();
	if (setting.CACHE_IS_LIST)
		cacheHelper.remove(key + '_LIST');
}

function setCacheList(key, time = setting.CACHE_LIST_TIME) {
	key = key.toUpperCase();
	if (setting.CACHE_IS_LIST)
		cacheHelper.set(key + '_LIST', 'TRUE', time);
}


module.exports = {
	isCacheList,
	removeCacheList,
	setCacheList, 
}