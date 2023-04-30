let behavior = require('../../../../behavior/default_index_bh.js');
let PassortBiz = require('../../../../biz/passport_biz.js');
let skin = require('../../skin/skin.js');

Page({
	behaviors: [behavior],

	onReady: function () {
		PassortBiz.initPage({
			skin,
			that: this,
			isLoadSkin: true,
			tabIndex: -1,
			isModifyNavColor: true
		});
  },

  gotoJiNianri:function(){
    console.log(111);
    wx.navigateToMiniProgram({
      appId: 'wxa054faedf6bd9310',
      path: '/pages/home/index',//跳转目标页面+携带参数
      extraData: {
          a: '123'//携带参数
       },
       envVersion: 'release',
       success(res) {
           // 打开成功
           debugger
       }
   })
  },
  gotoShetuan:function(options){
    console.log("jinlail")
    wx.navigateTo({
      url: '../../../../pages/index/index'
    })
  },
  gotoyouxi:function(options){
    console.log("jinlail")
    wx.navigateTo({
      url: '../../../../pages/lottery/index1/index1'
    })
  },
  gotobot:function(options){
    console.log("jinlail")
    wx.navigateTo({
      url: '../../../../pages/bot/bot'
    })
  }
  
})