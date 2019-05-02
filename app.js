//app.js
var serverUrl = 'http://148.70.115.138:8000'
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 登录等到getUserInfo以后
              wx.login({
                success: res => {
                  // 发送 res.code 到后台换取 openId, sessionKey, unionId
                  // 调用服务器的sign_in接口
                  wx.request({
                    url: serverUrl + '/sign_in',
                    data: {
                      'js_code': res.code,
                      'user_nickname': this.globalData.userInfo.nickName,
                      'avatar_url': this.globalData.userInfo.avatarUrl,
                      'gender': this.globalData.userInfo.gender,
                      'country': this.globalData.userInfo.country,
                      'province': this.globalData.userInfo.province,
                      'city': this.globalData.userInfo.city,
                      'language': this.globalData.userInfo.language,
                      'test': 'test'
                    },
                    method: 'post',
                    dataType: 'json',
                    responseType: 'text',
                    success:res =>{
                      this.globalData.user_id=res.data.user_id
                      console.log('获取用户数据成功')
                      console.log('用户id为'+this.globalData.user_id)
                    }
                  })
                }
              })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    
  },
  
  globalData: {
    userInfo: null,
    user_id:null   //存的是用户id
  },
  
})
