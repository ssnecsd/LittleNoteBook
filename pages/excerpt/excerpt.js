var app = getApp();

Page({
  data: {
    selectShow: false,
    url: '../excerpt_detail/excerpt_detail',
    excerpt_group_list: [
      {
        'group_name': '最近',
        'group_color': 'ccffcc',
        'excerpt_count': 10
      },
      {
        'group_name': '文学',
        'group_color': 'ef7a82',
        'excerpt_count': 12
      },
      {
        'group_name': '旅游',
        'group_color': 'ffcccc',
        'excerpt_count': 12
      },
    ],//下拉列表的数据
    index: 0,
    last: null,
    excerpt: [
      {
        time: '2018-2-15',
        title: '摘抄1',
        excerpt_id: null,
        last_modify: null
      }, {
        time: '2018-2-15',
        title: '摘抄2',
        excerpt_id: null,
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

  },
  // 处理左滑事件
  onClick(e) {
    console.log('onClick', e.detail);
    // 取消
    if (e.detail.index == 0) {

    }
    // 删除
    else if (e.detail.index == 1) {
      //获取列表中要删除项的下标
      var index = e.target.dataset.index;
      var excerpt = this.data.excerpt;
      //移除列表中下标为index的项
      excerpt.splice(index, 1);
      //更新列表的状态
      this.setData({
        excerpt: excerpt
      });
      wx.request({
        url: 'localhost',
      })
    }
  },
  // 点击下拉显示框
  selectTap() {
    this.setData({ selectShow: !this.data.selectShow });

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
    var array = this.data.excerpt_group_list;
    array.push("编辑分组");
    var last = array.length;
    var that = this;
    this.setData({
      excerpt_group_list: array,
      last: last - 1
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
      url: '../excerpt_group/excerpt_group_list/excerpt_group_list',
    })
  },
  navigateToSearch: function () {
    wx.navigateTo({
      url: '../articleSearch/articleSearch',
    })
  },
  navigateToDetail: function () {
    var that = this;
    wx.navigateTo({
      url: that.data.url,
    })
  },
  navigate:function(e){
    console.log("==navigates");
    var index=e.target.dataset.index;
    var id = this.data.excerpt[index].excerpt_id;
    console.log("==",index);
    wx.navigateTo({
      url: 'pages/excerpt_detail/excerpt_detail?id='+id,
    })
  }
})