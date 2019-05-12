// pages/articleSearch/articleSearch.js
import { $wuxToptips } from '../../dist/index'
var appInstance = getApp();
var serverUrl = 'https://xwnotebook.cn:8000';
var user_id;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    /* 设备高度 */
    btnHidden:true,
    cclHidden:true,
    resHidden: true,
    hintHidden:true,
    inputWidth:"width:96%",
    inputValue:"",
    valid:false,
    blank:"",
    focus:false,
    hint: "没有更多了 (ฅ• . •ฅ)",
    article_list: [ ],
    right: [{
      text: '取消',
      style: 'background-color: #ddd; color: white;font-size:16px',
    },
    {
      text: '删除',
      style: 'background-color: #ff9999; color: white;font-size:16px',
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},


  /**
   * 输入框获得焦点：显示按钮，修改input宽度 
   */
  focusinput:function(){
    this.setData({ 
      btnHidden: false,
      inputWidth: "width:75%"
      });

  },

  /**
   * 回车完成，输入完成
   */
  finishInput: function (e) { 
    this.search(e);
  },

  /**
   * 正在输入
   */
  Nowinput: function (e) {
    var that = this;
    var value = e.detail.value;
    //console.log("detail--->",e.detail.value);
    that.setData({ inputValue:value,valid:true});
    //console.log(that.data.inputValue);
    if (e.detail.value!="")
      this.setData({ cclHidden: false});
    else
      this.setData({ cclHidden: true });
   },

   /**
    * input失去焦点,这个问题可以改。动态绑定，value="{{valid?inputValue:blank}}"
    */
  loseFocus: function (e, ownerInstancee){
    //console.log("--lose--focus--")
    this.setData({
      btnHidden: true,
      cclHidden: true,
      inputWidth: "width:96%",
      valid:false
    });
  },

  /**
   * 取消搜索
   */
  cancelFunction:function(e){
    this.setData({focus:true});
  },
  /**
   * 点击搜索按钮
   */
  search(e){
    var that = this;
    var value = this.data.inputValue;
    //console.log(value);
    if (value != "") {
      wx.request({
        url:serverUrl+ '/search_article_by_key',
        data: {
          user_id: appInstance.globalData.user_id,
          article_key: value  //搜索数据
        },
        success: function (res) {
          console.log('----',res.data);
          console.log('====',that.data.article_list);
          if (res.data.article_list.length!=0) {
            //设置数据并显示
            that.setData({ article_list: res.data.article_list, resHidden: false, hintHidden: false });
          }
          else {
            //只显示没有找到
            console.log('meile');
            that.setData({ hint: "没有找到鸭(。•́︿•̀。)", resHidden: true, hintHidden: false });
          }
        }
      })
    }
    else {
      /*加组件,提示框*/
      $wuxToptips().show({
        icon: 'cancel',
        hidden: false,
        text: '请输入文章名或者关键字',
        duration: 2000,
        success() { },
      })
    }
  },
  /**
   * 左滑事件
   */
  leftAction:function(e){
    var that = this;
    var index = e.target.dataset.index;
    // 取消
    if (e.detail.index == 0) {}
    
    else if (e.detail.index == 1) {
      // 删除
       wx.request({
         url: serverUrl+'/delete_article',
         data:{
           user_id: appInstance.globalData.user_id,
           article_id:e.target.dataset.id
         },
         success:function(res){
           console.log(res.data);
           console.log('XXXX', res.data.status_code == 1);
           if (res.data.status_code==1){
             $wuxToptips().success({
               hidden: false,
               text: '删除成功',
               duration: 2000,
               success() { },
             });
             //前端删除 
            var array = that.data.article_list;
            array.pop(array[index]);
            that.setData({ article_list: array });
            //that.setData({article_list:res.article_list});
           }
           else{
             $wuxToptips().show({
               hidden: false,
               text: '删除失败',
               duration: 2000,
               success() { },
             })
           }
         }
       })
    }
  }
})