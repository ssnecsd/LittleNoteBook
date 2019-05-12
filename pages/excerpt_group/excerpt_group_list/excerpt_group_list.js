//全局变量用来确定点击事件点击的哪一个按钮
var y = 0
var serverUrl = 'http://148.70.115.138:8000'
var app = getApp()
Page({

  /**
   * 页面的初始数据1
   */
  data: {
    //--------------------测试用数据----------------------
    excerpt_group_list: [
      
    ],
    //---------------------滑动组件绑定数据----------------------
    right: [{
      text: '重命名',
      style: 'background-color: #0000AA; color: white;font-size:16px',
    },
    {
      text: '删除',
      style: 'background-color: #CD2626; color: white;font-size:16px',
    }],
    //---------------------测试用颜色-----------------------------------
    color: ["ccffcc", "ef7a82", "ffcccc", "ffffcc", "99ffcc",
      "99ffee", "66ffcc", "3f9", "3fc", "c9e", "FFFAF0"],
    //---------------------弹出修改和新建的窗口--------------------------------
    //0是不弹出，1是弹出
    show_window: 0,
    //修改还是新建
    tpye: '',
    //输入框中默认出现的文字
    contentInInput: '',
    //名字过长警告框
    show_long_name: 0,
    //删除成功提示框
    show_success_delete: 0,
    //删除失败提示框
    show_fail_delete: 0,
    //-----------------------颜色选择器-----------------------------------------------
    cur: 0,
    scroll: 0,
    //------------------------------------------------------------------------------
  },

  /*
  *  点击增加新的分类
  */
  add_group(e) {
    //将show_window设置为1
    console.log(e)
    this.setData({
      show_window: 1,
      type: '新建分类',
      contentInInput: '一个好名字',
    });

  },

  /**
   * 右滑出现的两个按钮
   */

  onClick(e) {
    console.log('onClick', e);
    //定位点击的是哪一个，y是excerpt_group_list数组的角标
    y = e.target.dataset.y
    //定位点击的是重命名还是删除,0重命名，1删除
    var index = e.detail.index
    if (index == 0) {
      this.setData({
        type: '重命名',
        show_window: 1,
        contentInInput: this.data.excerpt_group_list[y].group_name,
      })
    }
    if (index == 1) {
      //删除失败
      if (this.data.excerpt_group_list[y].article_count > 0) {
        this.setData({
          show_fail_delete: 1,
        })
      }
      //删除成功
      else {
        this.data.excerpt_group_list.splice(y, 1)
        this.setData({
          show_success_delete: 1,
          excerpt_group_list: this.data.excerpt_group_list,
        })
        //向服务器发送通知
        wx.request({
          url: serverUrl + '/delete_excerpt_group',
          data: {
            'user_id': app.globalData.user_id,
            'group_name': group_name,
          },
          success: function (res) {
            console.log(res.data)
          }
        })
      }
    }
  },


  /**
   * 输入框失去焦点时
   */
  onBlur(e) {
    console.log(e)
    console.log(e.detail.value)
    this.setData({
      //保存框中值
      contentInInput: e.detail.value
    })
  },
  /**
   * 点击取消键
   */
  cancle(e) {
    this.setData({
      show_window: 0,
    })
  },
  /**
   * 点击确定键
   */
  confirm(e) {
    //检查组名长度
    if (this.data.contentInInput.length > 10) {
      this.setData({
        show_long_name: 1,
      })
      return
    }
    else {
      this.setData({
        show_long_name: 0,
      })
    }
    //重命名
    if (this.data.type == '重命名') {
      var old_group_name = this.data.excerpt_group_list[y].group_name
      var new_group_name = this.data.contentInInput
      var group_color = this.data.color[this.data.cur]
      this.data.excerpt_group_list[y].group_name = this.data.contentInInput
      this.data.excerpt_group_list[y].group_color = this.data.color[this.data.cur]
      console.log(y)
      console.log(this.data.excerpt_group_list)
      this.setData({
        excerpt_group_list: this.data.excerpt_group_list,
        show_window: 0,
      })
    }
    //向服务器发送通知
    wx.request({
      url: serverUrl + '/reset_excerpt_group',
      data: {
        'user_id': app.globalData.user_id,
        'new_group_name': new_group_name,
        'group_color': group_color,
        'old_group_name': old_group_name
      },
      success: function (res) {
        console.log(res.data)
      }
    })
    //新建分类
    if (this.data.type == '新建分类') {
      var newitem = [{
        'group_name': this.data.contentInInput,
        'group_color': this.data.color[this.data.cur],//颜色待定
        'article_count': 0
      }]
      this.data.excerpt_group_list = this.data.excerpt_group_list.concat(newitem)
      this.setData({
        excerpt_group_list: this.data.excerpt_group_list,
        show_window: 0,
      })
    }
    //向服务器发送更改内容
    wx.request({
      url: serverUrl + '/new_excerpt_group',
      data: {
        'user_id': app.globalData.user_id,
        'group_name': newitem[0].group_name,
        'group_color': newitem[0].group_color
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  },
  /**
   * 关闭弹出的新建分类和重命名窗口
   */
  onClose1() {
    this.setData({
      show_window: 0,
    }
    )
  },
  /**
   * 关闭弹出的名字过长窗口
   */
  onClose2() {
    this.setData({
      show_long_name: 0,
    }
    )
  },
  /**
   * 关闭删除失败窗口
   */
  onClose3() {
    this.setData({
      show_fail_delete: 0,
    }
    )
  },
  /**
   * 关闭删除成功窗口
   */
  onClose4() {
    this.setData({
      show_success_delete: 0,
    }
    )
  },
  /*颜色选择器*/
  choose: function (e) {
    var that = this;
    var index = e.target.dataset.index;
    //console.log(index)
    that.setData({ cur: index })
  },
  prevTap: function () {
    var that = this;
    var scroll = 0;
    const query = wx.createSelectorQuery();
    query.select('#colorset').fields({
      scrollOffset: true,
    }, function (res) {
      res.scrollLeft
    }).exec(function (e) {
      scroll = e[0].scrollLeft;
      console.log(that.data.scroll)
      if (scroll > 60) {
        scroll -= 60;
      } else {
        scroll = 0;
      }
      that.setData({ scroll: scroll });
    })
  },
  nextTap: function () {
    var that = this;
    var scroll = 0;
    const query = wx.createSelectorQuery();
    query.select('#colorset').fields({
      scrollOffset: true,
    }, function (res) {
      res.scrollLeft
    }).exec(function (e) {
      scroll = e[0].scrollLeft;
      console.log(that.data.scroll)
      if (scroll + 60 < 300) {
        scroll += 60;
      } else {
        scroll = 331;
      }
      that.setData({ scroll: scroll });
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //   request获取list里面是一个字典{
    //   group_name：分组名称（string），
    //   group_color：分组颜色（string），
    //   article_count：分类中文章数量（int）
    // }
    //初始化页面数据
    var that = this
    if (app.globalData.user_id != null) {
      wx.request({
        url: serverUrl + '/initial_ excerpt _group_list',
        data: {
          'user_id': app.globalData.user_id
        },
        success: function (res) {
          console.log(res.data)
          that.setData({
            excerpt_group_list: res.data.excerpt_group_list
          })
        }
      })
    } else {
      //处理user_id获取异常的错误
    }
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

  }
})