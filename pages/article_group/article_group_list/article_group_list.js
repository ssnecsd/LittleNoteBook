// pages/article_group/article_group_list/article_group_list.js
import { $wuxToptips } from '../../../dist/index'
//全局变量用来确定点击事件点击的哪一个按钮
var y=0
var serverUrl = 'https://xwnotebook.cn:8000'
var app=getApp()

Page({

  /**
   * 页面的初始数据1
   */
  data: {
    //--------------------测试用数据----------------------
    article_group_list:[
      
    ],
    //---------------------滑动组件绑定数据----------------------
    right: [{
      text: '编辑',
      style: 'background-color:#8EE5EE; color: white;font-size:16px',
    },
    {
      text: '删除',
      style: 'background-color: #ff9999; color: white;font-size:16px',
    }],
    //---------------------测试用颜色-----------------------------------
    color: ["#ccffcc", "#ef7a82", "#ffcccc", "#ffffcc", "#99ffcc",
     "#99ffee", "#66ffcc", "#3f9", "#3fc", "#c9e", "#FFFAF0"],
    //---------------------弹出修改和新建的窗口--------------------------------
    //0是不弹出，1是弹出
    show_window:0,
    //修改还是新建
    tpye:'',
    //输入框中默认出现的文字
    contentInInput:'',
    //名字过长警告框
    show_long_name:0,
    //名字重复警告框
    show_name_exist:0,
    //删除成功提示框
    show_success_delete:0,
    //删除失败提示框
    show_fail_delete:0,
    //-----------------------颜色选择器-----------------------------------------------
    cur: 0,
    scroll: 0,
    //------------------------------------------------------------------------------
  },
  
  /*
  *  点击增加新的分类
  */
  add_group(e){
    //将show_window设置为1
    // console.log(e)
    this.setData({
      show_window:1,
      type:'新建分类',
    });
    
  },

  /**
   * 右滑出现的两个按钮
   */

  onClick(e){
    var that = this
    // console.log('onClick', e);
    //定位点击的是哪一个，y是article_group_list数组的角标
    y=e.target.dataset.y
    //定位点击的是编辑还是删除,0编辑，1删除
    var index=e.detail.index
    if (index==0){
      this.setData({
        type:'编辑',
        show_window: 1,
        contentInInput:this.data.article_group_list[y].group_name,
      })
    }
    if(index==1){
      var group_name = this.data.article_group_list[y].group_name
      //向服务器发送通知
      wx.request({
        url: serverUrl + '/delete_article_group',
        data: {
          'user_id': app.globalData.user_id,
          'group_name': group_name,
        },
        success: function (res) {
          console.log(res.data)
          //删除成功
          if(res.data.state_code==1){
            //显示删除成功提示
            $wuxToptips().success({
              hidden: false,
              text: '删除成功',
              duration: 2000,
              success() { },
            });
            that.data.article_group_list.splice(y, 1)
            that.setData({
              article_group_list: that.data.article_group_list,
            })
          }else{
            //删除失败
            //显示删除失败提示
            $wuxToptips().show({
              hidden: false,
              text: '删除失败，无法删除不为空的分组',
              duration: 2000,
              success() { },
            })
          }
        }
      })
      
    }
  },

  
  /**
   * 输入框失去焦点时
   */
  onBlur(e){
    // console.log(e)
    // console.log(e.detail.value)
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
    var that=this
    //编辑
    if(this.data.type=='编辑'){
      var old_group_name = this.data.article_group_list[y].group_name
      var new_group_name = this.data.contentInInput
      var group_color = this.data.color[this.data.cur]
      //向服务器发送通知
      wx.request({
        url: serverUrl + '/reset_article_group',
        data: {
          'user_id': app.globalData.user_id,
          'new_group_name': new_group_name,
          'group_color': group_color,
          'old_group_name': old_group_name
        },
        success: function (res) {
          console.log('/reset_article_group',res.data)
          //编辑成功
          if(res.data.state_code==1){
            //显示编辑成功提示
            $wuxToptips().success({
              hidden: false,
              text: '编辑成功',
              duration: 2000,
              success() { },
            });

            that.data.article_group_list[y].group_name = that.data.contentInInput
            that.data.article_group_list[y].group_color = that.data.color[that.data.cur]
            that.setData({
              article_group_list: that.data.article_group_list,
              show_window: 0,
            })
          }else{
            //检查是否重名
            if(res.data.state_code==2){
              //显示重名提示
              $wuxToptips().show({
                hidden: false,
                text: '名字重复，请重命名',
                duration: 2000,
                success() { },
              })
            }
            //显示编辑失败提示
            $wuxToptips().show({
              hidden: false,
              text: '编辑失败',
              duration: 2000,
              success() { },
            })
          }
        }
      })
    }
    //新建分类
    if(this.data.type=='新建分类'){
      var newitem=[{
        'group_name': this.data.contentInInput,
        'group_color': this.data.color[this.data.cur],
        'article_count': 0
      }]
      //向服务器端发送新建分类的通知
      // console.log(newitem)
      wx.request({
        url: serverUrl + '/new_article_group',
        data: {
          'user_id': app.globalData.user_id,
          'group_name': newitem[0].group_name,
          'group_color': newitem[0].group_color
        },
        success: function (res) {
          console.log(res.data)
          //新建成功
          if(res.data.state_code==1){
            //显示新建成功提示
            $wuxToptips().success({
              hidden: false,
              text: '新建成功',
              duration: 2000,
              success() { },
            });

            that.data.article_group_list = that.data.article_group_list.concat(newitem)
            that.setData({
              article_group_list: that.data.article_group_list,
              show_window: 0,
            })
          }else{
            //检查是否重名
            if (res.data.state_code == 2) {
              //显示重名提示
              $wuxToptips().show({
                hidden: false,
                text: '名字重复，请重命名',
                duration: 2000,
                success() { },
              })
            }
            //显示新建失败提示
            $wuxToptips().show({
              hidden: false,
              text: '新建失败',
              duration: 2000,
              success() { },
            })
          }
        }
      })
    }
  },
  /**
   * 关闭弹出的新建分类和编辑窗口
   */
  onClose1() {
    this.setData({
      show_window: 0,
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
      // console.log(that.data.scroll)
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
    }).exec(function (e){
      scroll=e[0].scrollLeft;
      // console.log(that.data.scroll)
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
    var that=this
    if (app.globalData.user_id!=null){
      wx.request({
        url: serverUrl + '/initial_article_group_list',
        data: {
          'user_id': app.globalData.user_id
        },
        success: function (res) {
          console.log(res.data)
          that.setData({
            article_group_list: res.data.article_group_list
          })
        }
      })
    }else{
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