// pages/article/article.js
const db =wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("点击了那篇文章的id",options.id)
    // db.collection("articles").get().then(res=>{
    //   console.log("获取的文章内容",res.data)
    // })
    db.collection("articles").doc(options.id).get().then(res=>{
      console.log("获取的文章内容",res.data)
      this.setData({
        content:res.data
      })
    })
  },
  gotohuodong(e){
    console.log("我进入活动了 ")
    wx.navigateTo({
      url: '/projects/A00/meet/index/meet_index?id=1',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})