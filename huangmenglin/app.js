
App({
  globalData:{
    userInfo:null,
    navHeight:null,
    user_id:null
  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    var that = this;
    // 获取手机系统信息
    wx.getSystemInfo({
      success: function(res) {
        //导航高度=手机状态栏+导航高度
        that.globalData.navHeight = res.statusBarHeight + 46;
      }, 
      fail(err) {
        console.log(err);
      }
    })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
