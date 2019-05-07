//app.js
var serverUrl = 'http://148.70.115.138:8000'
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  
  globalData: {
    userInfo: null,
    user_id:null   //存的是用户id
  },
  
})
