var app = getApp();
var serverUrl = 'http://148.70.115.138:8000'
Page({
  /**
   * 页面的初始数据
   * [
      {
        time: '2018-2-15',
        title: '张三',
        image_url:null,
        article_id:null,
        last_modify:null

      }
    ]
   */
  data: {
    selectShow: false,
    url: '../article_detail/article_detail',
    selectData: [
      { title:'最近',count:10},
      {title:'文学',count:4},
      { title: '娱乐', count: 6 },
      ],//下拉列表的数据
      index:0,
      last:null,
    articles: [
      {
        time: '2018-2-15',
        title: '我长这么大，还没做过飞机，需要自卑吗',
        image_url: "../icon/icon_ren.png",
        article_id: null,
        last_modify: null
      }, {
        time: '2018-2-15',
        title: '中山',
        image_url: "../icon/icon_ren.png",
        article_id: null,
        last_modify: null
      }
    ],
    right: [{
      text: '取消',
      style: 'background-color: #ddd; color: white;font-size:16px',
    },
    {
      text: '删除',
      style: 'background-color: #ff9999; color: white;font-size:16px',
    }],
    //--------------授权登陆微信小程序-------------------------
    show_authorize:0,//0表示不显示授权登陆页面，1表示显示授权登陆页面
    spinning:1//等待窗口0表示不显示，1表示显示
  },
// 处理左滑事件
  onClick(e) {
    console.log('onClick', e.detail);
    // 取消
    if(e.detail.index == 0)
    {

    }
    // 删除
    else if(e.detail.index == 1){
      //获取列表中要删除项的下标
      var index = e.target.dataset.index;
      var articles = this.data.articles;
      //移除列表中下标为index的项
      articles.splice(index, 1);
      //更新列表的状态
      this.setData({
        articles: articles
      });
      wx.request({
        url: 'localhost',
      })
    }
  },
  // 点击下拉显示框
  selectTap() {
    this.setData({ selectShow: !this.data.selectShow});
    
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index: Index,
      selectShow: !this.data.selectShow
    });
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
   * 向服务器发送请求登录
  */
  sign_in: function () {
    
    var that = this
    that.setData({
      spinning:1//显示等待窗口
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
                    method: 'post',
                    dataType: 'json',
                    responseType: 'text',
                    success: res => {
                      app.globalData.user_id = res.data.user_id
                      console.log('获取用户数据成功')
                      console.log('用户id为' + app.globalData.user_id)
                      that.setData({
                        spinning: 0//关闭等待窗口
                      })
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
        else{
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
                  'language': '',
                  'test': 'test'
                },
                method: 'post',
                dataType: 'json',
                responseType: 'text',
                success: res => {
                  app.globalData.user_id = res.data.user_id
                  console.log('无用户数据进行登录')
                  console.log('用户id为' + app.globalData.user_id)
                  that.setData({
                    spinning: 0//关闭等待窗口
                  })
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
    if(e.detail.errMsg=="getUserInfo:ok"){
      app.globalData.userInfo = e.detail.userInfo
    }
    //请求权限失败
    else{

    }
    //用户与服务器登陆
    this.sign_in()
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // wx.request({
    //   url: 'localhost/get_recent_articles',
    //   data:{
    //     "user_id":app.globalData.user_id
    //   },
    //   success:function(res) {
    //     that.setData({articles:res});
    //   }

    // })
    var array = this.data.selectData;
    array.push("编辑分组");
    var last = array.length;
    var that = this;
    this.setData({
      selectData: array,
      last: last-1
    });
    //查看是否有用户信息权限
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']){
          that.setData({
            //弹窗请求用户权限
            show_authorize:1,
          })
        }else{
          this.sign_in()
        }
      }
    })
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
    
  },
  navigateToGroup:function() {
    wx.navigateTo({
      url: '../article_group/article_group_list/article_group_list',
    })
  },
  navigateToSearch:function(){
    wx.navigateTo({
      url:'../articleSearch/articleSearch',
    })
  },
  navigateToDetail:function(){
    var that=this;
    console.log("llls")
    wx.navigateTo({
      url: that.data.url,
    })
  }
})