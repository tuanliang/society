const BaseBiz = require('./base_biz.js');
const setting = require('../setting/setting.js');
const pHelper = require('../helper/page_helper.js');

class MeetBiz extends BaseBiz {

	static async subscribeMessageMeet(callback) {
		callback && await callback();
	}

	static addMeetPhoneCalendar(title, startTime, endTime, alarmOffset = 3600) {
		wx.addPhoneCalendar({
			title,
			startTime,
			endTime,
			//	description: "这是日程内容", 
			alarm: 'true',
			alarmOffset, //提前时间，秒
			success: () => {
				pHelper.showSuccToast('添加成功');
			},
			fail: (res) => {
				if (res && res.errMsg && res.errMsg.includes('refuesed')) {
					pHelper.showModal('请在手机的"设置›微信" 选项中，允许微信访问你的日历', '日历权限未开启')
				}
			},
			complete: (res) => {
				console.log(res)
			}

		})
	}

}

module.exports = MeetBiz;