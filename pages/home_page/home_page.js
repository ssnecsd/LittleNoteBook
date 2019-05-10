// pages/home_page/home_page.js
var app = getApp();
var serverUrl = 'https://xwnotebook.cn:8000';
var sign_in_times=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //--------------授权登陆微信小程序-------------------------
    show_authorize: 0,//0表示不显示授权登陆页面，1表示显示授权登陆页面
    spinning: 1,//等待窗口0表示不显示，1表示显示
    windowHeight: null,
    windowWidth: null,
    evilHidden: false,
    selectShow: false,
    //------------------新增一篇文章的对话框------------------------------
    show_window: 0,
    //输入框中默认出现的文字
    contentInInput: '',
    //-----------------得到最近的文章--------------------------------------------
    recent_article_list: [],
  },

  /**
   * 初始化数据
   */
  initial_data: function (that) {
    var user_id = app.globalData.user_id
    console.log('initial_data')
    console.log('user_id', user_id)
    //得到最近的文章
    wx.request({
      url: serverUrl + '/get_recent_articles',
      data: {
        'user_id': app.globalData.user_id,
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          recent_article_list: res.data['recent_article_list']
        })
      }
    })
    //得到最近的摘抄

  },
  /**
   * sign_in失败以后的回调函数
   */
  sign_in_fail: function (that) {
    sign_in_times += 1
    console.log("sign_in失败，正在重试")
    console.log("重试次数", sign_in_times)
    this.sign_in()
  },
  /**
     * 向服务器发送请求登录
    */
  sign_in: function () {

    var that = this;
    var width = this.data.windowWidth;
    var height = this.data.windowHeight;
    var style = "width:" + width + "px;height:" + height + "px;"
    that.setData({
      spinning: 1,//显示等待窗口
      promptstyle: style,
      evilHidden: false
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo

              // 登录等到getUserInfo以后
              wx.login({
                success: res => {
                  // 发送 res.code 到后台换取 openId, sessionKey, unionId
                  // 调用服务器的sign_in接口
                  wx.request({
                    url: serverUrl + '/sign_in',
                    data: {
                      'js_code': res.code,
                      'user_nickname': app.globalData.userInfo.nickName,
                      'avatar_url': app.globalData.userInfo.avatarUrl,
                      'gender': app.globalData.userInfo.gender,
                      'country': app.globalData.userInfo.country,
                      'province': app.globalData.userInfo.province,
                      'city': app.globalData.userInfo.city,
                      'language': app.globalData.userInfo.language,
                      'test': 'test'
                    },
                    method: 'get',
                    dataType: 'json',
                    responseType: 'text',
                    success: res => {
                      app.globalData.user_id = res.data.user_id
                      console.log('获取用户数据成功')
                      console.log('用户id为' + app.globalData.user_id);
                      var width = 0;
                      var height = 0;
                      var style = "width:" + width + "px;height:" + height + "px;"
                      that.setData({
                        spinning: 0,//关闭等待窗口
                        promptstyle: style,
                        evilHidden: true
                      })
                      // that.setData({
                      //   spinning: 0//关闭等待窗口
                      // })
                      //初始化数据
                      that.initial_data(that)

                    },
                    fail:res=>{
                      that.sign_in_fail(that)
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
        //请求权限失败
        else {
          //无用户信息的情况下登录
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              // 调用服务器的sign_in接口
              wx.request({
                url: serverUrl + '/sign_in',
                data: {
                  'js_code': res.code,
                  'user_nickname': '',
                  'avatar_url': '',
                  'gender': '',
                  'country': '',
                  'province': '',
                  'city': '',
                  'language': ''
                },
                method: 'get',
                dataType: 'json',
                responseType: 'text',
                success: res => {
                  app.globalData.user_id = res.data.user_id
                  console.log('无用户数据进行登录')
                  console.log('用户id为' + app.globalData.user_id)

                  var width = 0;
                  var height = 0;
                  var style = "width:" + width + "px;height:" + height + "px;"
                  that.setData({
                    spinning: 0,//关闭等待窗口
                    promptstyle: style,
                    evilHidden: true
                  })
                  //初始化数据
                  that.initial_data(that)

                },
                fail: res => {
                  that.sign_in_fail(that)
                }
              })
            }
          })
        }
      }
    })
  },
  /*
  获取用户信息
  */
  getUserInfo: function (e) {
    console.log(e)
    //请求权限成功
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.globalData.userInfo = e.detail.userInfo
    }
    //请求权限失败
    else {

    }
    //用户与服务器登陆
    this.sign_in()
  },
  
  /*
  *  点击增加新的文章
  */
  add_article(e) {
    //将show_window设置为1
    // console.log(e)
    var that = this
    wx.getClipboardData({
      success(res) {
        that.setData({
          contentInInput: res.data
        })
      }
    })
    this.setData({
      show_window: 1,
    });

  },
  /**
   * 点击确定键 
   */
  confirm(e) {
    var that = this
    this.setData({
      show_window: 0,
    });
    var article_url = this.data.contentInInput
    wx.navigateTo({
      url: '../article_detail/article_detail' + '?article_url=' + article_url,
    })
  },
  /**
   * 点击文章到详细文章
   */
  navigateToDetail(e){
    wx.navigateTo({
      url: '../article_detail/article_detail' + '?article_id=' + e.currentTarget.dataset.article_id,
    })
  },
  /**
   * 输入框失去焦点时
   */
  onBlur(e) {
    // console.log(e)
    // console.log(e.detail.value)
    this.setData({
      //保存框中值
      contentInInput: e.detail.value
    })
  },
  /**
  * 用确定键关闭弹出的请求授权微信小程序窗口
  */
  onClose1() {
    this.setData({
      show_authorize: 0,
    })
  },
  /**
  * 右上角关闭弹出的请求授权微信小程序窗口
  */
  onClose2() {
    //用户与服务器登陆
    this.sign_in()
    this.setData({
      show_authorize: 0,
    })
  },
  /**
   * 关闭新增文章对话框
   */
  onClose3() {
    this.setData({
      show_window: 0,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //查看是否有用户信息权限
    var that = this
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            //弹窗请求用户权限
            show_authorize: 1,
          })
        } else {
          this.sign_in()
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    this.initial_data(that)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})