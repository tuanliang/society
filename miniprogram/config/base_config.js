/**
 * 项目基础配置
 */
module.exports = {
  // 需要在本地调试时访问体验服务器资源则开启,开启后请求时会自动请求到"request_trial"地址
  "trial_test": true,
  // 请求api配置,非必填（如果有自己的业务则可以用）
  "request_develop": "http://api.xxx.com",//本地开发
  "request_trial": "https://api.xxx.com",//测试环境
  "request_release": "https://api.xxx.com",//线上环境
 
 
  // 云开发环境id配置（位置：云开发控制台->环境id，如果只有一个环境，则三个都填一样的）
  "wx_cloud_env_develop": "cloud1-6gne6yf68e8fc781",//本地开发
  "wx_cloud_env_trial": "cloud1-6gne6yf68e8fc781",//测试环境
  "wx_cloud_env_release": "cloud1-6gne6yf68e8fc781",//线上环境
  // 下面的不用填
  "nest_app_id": "不用填",
  "nest_app_key": "不用填"
};