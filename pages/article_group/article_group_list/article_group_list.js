// pages/article_group/article_group_list/article_group_list.js
//全局变量用来确定点击事件点击的哪一个按钮
var y=0
Page({

  /**
   * 页面的初始数据1
   */
  data: {
    //--------------------测试用数据----------------------
    article_group_list:[
      {
        'group_name':'最近',
        'group_color':'ccffcc',
        'article_count':10
      },
      {
        'group_name':'文学',
        'group_color':'ef7a82',
        'article_count':12
      },
      {
        'group_name':'旅游',
        'group_color':'ffcccc',
        'article_count':12
      },
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
    show_window:0,
    //修改还是新建
    tpye:'',
    //输入框中默认出现的文字
    contentInInput:'',
    //----------------------------------------------------------------------
  },
  
  /*
  *  点击增加新的分类
  */
  add_group:function(e){
    //将show_window设置为1
    this.setData({
      show_window:1,
      type:'新建分类',
      contentInInput:'一个好名字'
    });
    
  },

  /**
   * 右滑出线的两个按钮
   */

  onClick(e){
    console.log('onClick', e);
    //定位点击的是哪一个，y是article_group_list数组的角标
    y=e.target.dataset.y
    //定位点击的是重命名还是删除,0重命名，1删除
    var index=e.detail.index
    if (index==0){
      this.setData({
        type:'重命名',
        show_window: 1,
        contentInInput:this.data.article_group_list[y].group_name,
      })
    }
  },

  /**
   * 关闭弹出的窗口
   */
  onClose1(){
    this.setData({
      show_window: 0,
    }
    )
  },
  /**
   * 输入框失去焦点时
   */
  onBlur(e){
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
  cancle(e){
    this.setData({
      show_window: 0,
    })
  },
  /**
   * 点击确定键
   */
  confirm(e){
    //重命名
    if(this.data.type=='重命名'){
      this.data.article_group_list[y].group_name=this.data.contentInInput
      console.log(y)
      console.log(this.data.article_group_list)
      this.setData({
        article_group_list: this.data.article_group_list,
        show_window: 0,
      })
    }
    //新建分类
    if(this.data.type=='新建分类'){
      var newitem=[{
        'group_name': this.data.contentInInput,
        'group_color': 'ccffcc',//颜色待定
        'article_count': 0
      }]
      this.data.article_group_list = this.data.article_group_list.concat(newitem)
      this.setData({
        article_group_list: this.data.article_group_list,
        show_window: 0,
      })
    }
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