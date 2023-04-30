const setting = require('./setting/setting.js');

require('./libs/Mixins.js');
import { getWxCloudEnv } from './config/request_config';
const themeListeners = []

App({
	onLaunch: function (options) {
    if (options.scene) {
      this.globalData.scene = options.scene;
    }
		if (!wx.cloud) {
			console.error('请使用 2.2.3 或以上的基础库以使用云能力')
		} else {
			wx.cloud.init({
				// env 参数说明：
				//   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
				//   此处请填入环境 ID, 环境 ID 可打开云控制台查看
				//   如不填则使用默认环境（第一个创建的环境）
				// env: 'my-env-id',
				env: setting.CLOUD_ID,
				traceUser: true,
			})
		}

		this.globalData = {};

		// 用于自定义导航栏
		wx.getSystemInfo({
			success: e => {
        this.globalData.sys = e;
				this.globalData.statusBar = e.statusBarHeight;
				let capsule = wx.getMenuButtonBoundingClientRect();
				if (capsule) {
					this.globalData.custom = capsule;
					this.globalData.customBar = capsule.bottom + capsule.top - e.statusBarHeight;
				} else {
					this.globalData.customBar = e.statusBarHeight + 50;
        } 

        if (result.theme) this.globalData.theme = result.theme;
        if (result.model.search("iPhone") != -1) {
          this.globalData.model = "iPhone";
        }
        this.globalData.userInfo = wx.getStorageSync('userInfo');
        this.globalData.launchReady = true;
			}
    });
    const accountInfo = wx.getAccountInfoSync();
    this.globalData.sys.mini = accountInfo.miniProgram;
    console.log(this.globalData.sys)
    // 监听系统主题变化
    wx.onThemeChange((themeResult) => {
      this.themeChanged(themeResult.theme)
    })
    if (options.scene != 1154) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
      })
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已准备好，请重启应用',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(function () {
        // 新版本下载失败
      })
    }
	},


	/*
	onShow: function (options) {
		// 启动，或者从后台进入前台
		//GroupBiz.initGroupShareTicket(options);
	},
	onHide: function () {
		// 小程序从前台进入后台
		//GroupBiz.clearGroupShareTicket();
  }*/
  /**
   * 改变主题
   * @param {*} theme 
   */
  themeChanged(theme) {
    this.globalData.theme = theme
    themeListeners.forEach((listener) => {
      listener(theme)
    })
  },
  /**
   * 监听主题变化
   * @param {*} listener 
   */
  watchThemeChange(listener) {
    if (themeListeners.indexOf(listener) < 0) {
      themeListeners.push(listener)
    }
  },
  /**
   * 取消监听主题变化
   * @param {*} listener 
   */
  unWatchThemeChange(listener) {
    const index = themeListeners.indexOf(listener)
    if (index > -1) {
      themeListeners.splice(index, 1)
    }
  },
  globalData: {
    userInfo: {},
    userInfoNeedReload: false,
    theme: 'light',
    model: "android",
    launchReady: false,
    token: "",
    token_exp: "",
    sys: {},
    scene: 0
  }
})