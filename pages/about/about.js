// pages/about/about.js
import { $wuxToptips } from '../../dist/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  showToptips3() {
    $wuxToptips().info({
      hidden: false,
      text: '操作指南稍后更新(*¯︶¯*)',
      duration: 2000,
      success() { },
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title:'小微阅读',
      path:'/pages/home_page/home_page'//进入首页
    }
  },
  diretion(){
    wx.navigateTo({
      url: '/pages/direction/direction',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  navigateToHome(){
    console.log('navigateToHome')
    wx.navigateTo({
      url: '/pages/home_page/home_page',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})