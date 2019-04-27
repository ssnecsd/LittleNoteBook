var app = getApp();

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