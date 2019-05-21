import { $wuxToptips } from '../../dist/index'
var app = getApp();
var user_id;
var serverUrl = app.globalData.serverUrl;

Page({
  data: {
    selectShow: false,
    url: '../excerpt_share/excerpt_share?excerpt_content=',
    excerpt_group_list: [
    ],//下拉列表的数据
    index: 0,
    last: null,
    excerpt_list: [
    ],
    right: [{
      text: '分享',
      style: 'background-color: #8EE5EE; color: white;font-size:16px',
    },
    {
      text: '删除',
      style: 'background-color: #ff9999; color: white;font-size:16px',
    }],

  },
  // 处理左滑事件
  onClick(e) {
    console.log('onClick', e.detail);
    // 取消
    if (e.detail.index == 0) {
      var index = e.target.dataset.index;
      var id = this.data.excerpt_list[index].excerpt_id;
      var excerpt = this.data.excerpt_list[index].excerpt_content;
      var title = this.data.excerpt_list[index].title;
      var that = this;
      wx.navigateTo({
        url: that.data.url + excerpt + '&title=' + title,
      })
    }
    // 删除
    else if (e.detail.index == 1) {
      user_id = app.globalData.user_id;
      //获取列表中要删除项的下标
      var index = e.target.dataset.index;
      var excerpt_list = this.data.excerpt_list;
      console.log(excerpt_list)
      wx.request({
        url: serverUrl + '/delete_excerpt',
        data: {
          user_id: app.globalData.user_id,
          excerpt_id: excerpt_list[index].excerpt_id,
          article_id: excerpt_list[index].article_id
        },
        success: function (res) {
          console.log(res.data.excerpt_list);
          console.log('XXXX', res.data.state_code == 1);
          if (res.data.state_code == 1) {
            $wuxToptips().success({
              hidden: false,
              text: '删除成功',
              duration: 2000,
              success() { },
            });

          }
          else {
            $wuxToptips().show({
              hidden: false,
              text: '删除失败',
              duration: 2000,
              success() { },
            })
          }
        }
      })
      //移除列表中下标为index的项
      excerpt_list.splice(index, 1);
      //更新列表的状态
      this.setData({
        excerpt_list: excerpt_list
      });

    }
  },
  // 点击下拉显示框
  selectTap() {
    this.setData({ selectShow: !this.data.selectShow });

  },
  // 点击下拉列表
  optionTap(e) {
    var that = this;
    var excerpt_group_list = this.data.excerpt_group_list;
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index: Index,
      selectShow: !this.data.selectShow
    });
    wx.request({
      url: serverUrl + '/get_excerpt_by_group',
      data: {
        user_id: app.globalData.user_id,
        group_name: excerpt_group_list[Index].group_name
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          excerpt_list: res.data.excerpt_list
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    selectShow: false;
    var that = this;
    user_id = app.globalData.user_id;
    wx.request({
      url: serverUrl + '/get_recent_excerpt',
      data: {
        user_id: user_id
      },
      success: function (res) {
        that.setData({
          excerpt_list: res.data.recent_excerpt_list
        })
      }
    })

    wx.getSystemInfo({
      success: function (res) {
        that.setData({ windowHeight: res.windowHeight, windowWidth: res.windowWidth });//设备宽高
      }
    });
    //初始化分组
    wx.request({
      url: serverUrl + '/initial_excerpt_group_list',
      data: {
        'user_id': app.globalData.user_id
      },
      success: function (res) {
        console.log(res.data)
        var array = res.data.excerpt_group_list;
        array.push("编辑分组");
        var last = array.length;
        that.setData({
          excerpt_group_list: array,
          last: last - 1
        });
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
    var that = this;
    //初始化分组
    wx.request({
      url: serverUrl + '/initial_excerpt_group_list',
      data: {
        'user_id': app.globalData.user_id
      },
      success: function (res) {
        console.log(res.data)
        var array = res.data.excerpt_group_list;
        array.push("编辑分组");
        var last = array.length;
        that.setData({
          excerpt_group_list: array,
          last: last - 1
        });
      }
    })
    wx.request({
      url: serverUrl + '/get_recent_excerpt',
      data: {
        user_id: user_id
      },
      success: function (res) {
        that.setData({
          excerpt_list: res.data.recent_excerpt_list
        })
      }
    })
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
  navigateToGroup: function () {
    wx.navigateTo({
      url: '../excerpt_group/excerpt_group',
    })
  },

})