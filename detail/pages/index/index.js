var serverUrl = 'http://148.70.115.138:8000';
var app = getApp();
var user_id = app.globalData.user_id;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cur: -1,
    startTime:0,
    endTime:null,
    menuHidden:true,
    noteHidden:true,
    highlightHidden:true,
    editHidden:true,
    autoFocus:false,
    windowHeight:null,
    windowWidth:null,
    noteStyle:'',
    menuStyle:'',
    note:'',
    noteValue:'',
    chooseColor:'',
    content: [],
    marker: [{}, {}, { key1: 1, value1: '#0ff',key2:0,value2:'' }, { key1: 0, value1: '', key2: 1, value2: '笔记记录' }, {key1: 1, value1: '#0ff',key2: 1, value2: '这是一个笔记' }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res.windowWidth)
        //console.log(res.windowHeight)
        that.setData({ windowHeight: res.windowHeight, windowWidth: res.windowWidth});//设备宽高
      }
    });
    this.load_articletest();

  },
  load_articletest: function () {
    var that = this;
    wx.request({
      url: serverUrl + '/load_article',
      data: {
        'url': 'https://mp.weixin.qq.com/s/G11wlj1tVg8A-7o4NKR-aQ',
        'user_id': user_id
      },
      success: function (res) {
        //console.log(res.data)
        
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
   * 长按出菜单
   */
  menu:function(e) {
    console.log("--弹出菜单")
    this.refresh();
    var that = this;
    //console.log(e);
    that.setData({cur:e.target.dataset.index});
    //console.log(that.data.cur);
    var  offsettop = e.target.offsetTop-24;
    var offsetleft = e.target.offsetLeft;
    if (offsettop<0){
      offsettop+=24;
    }
    if(offsetleft+215>that.data.windowWidth){
      offsetleft = that.data.windowWidth-215;
    }
    var style = 'left:'+offsetleft+'px;top:'+offsettop+'px';
    //console.log(style);
    this.setData({menuHidden:false,menuStyle:style}); 
  },
  /**
   * 查看笔记
   */
  review:function(e){
    this.refresh();
    console.log("--查看笔记");
    var that = this;
    var index = e.target.dataset.index;
    var note = that.data.marker[index].value2;
    if(that.data.marker[index].key2==1){
      //有笔记,获取笔记显示笔记
      var offsettop = e.target.offsetTop - 154;
      //var height = e.target   如果不能简单第一行再改
      var offsetleft = e.target.offsetLeft+4;
      if (offsettop < 0) {
        offsettop += 24;
      }
      if (offsetleft + 250 > that.data.windowWidth) {
        offsetleft = that.data.windowWidth - 254;
      }
      var style = 'left:' + offsetleft + 'px;top:' + offsettop + 'px';
      //console.log(style);
      this.setData({ note:note,noteHidden: false, noteStyle: style }); 
      // wx.request({
      //   url: 'localhost/',
      //   success:function(res){
         
      //   }
      // })
    }
  },
  touchstart:function(e){
    this.setData({ startTime:e.timeStamp})
  },
  touchend:function(e){
    //this.setData({ endTime: e.timeStamp });
    var during = e.timeStamp-this.data.startTime;
    this.setData({ startTime:0 })
    if(during>350){
      this.menu(e);
    }else{
      this.review(e);
    }
  },
  refresh:function(e){
    console.log("--refresh");
    this.setData({
      cur: -1,
      startTime: 0,
      endTime: null,
      menuHidden: true,
      noteHidden: true,
      highlightHidden: true,
      noteStyle: '',
      menuStyle: '',
      note: ''})
  },
  highlight:function(){
    this.setData({ highlightHidden: false});
  },
  /**
   * 复制
   */
  copy:function(){
    var index = this.data.cur;
    var that = this;
    wx.setClipboardData({
      data: that.data.content[index][1],
      success(res) {
        // wx.getClipboardData({
        //   success(res) {
        //     console.log(res.data) // data
        //   }
        // })
        that.refresh();
      }
    })
  },
  /**
   * 颜色选择
   */
  mychoose:function(e){
    console.log(e.detail.color);
    this.setData({ chooseColor: e.detail.color})
  },
  //确认颜色
  confirm:function(e){
    console.log("--confirm");
    var index = this.data.cur;
    var color = this.data.chooseColor;
    //写到marker中
    var array = this.data.marker;
    array[index].key1 = 1;
    array[index].value1=color;
    this.setData({marker:array})
  },
  /**
   * 笔记事件
   */
  note:function(e){
    console.log("==note");
    this.setData({ editHidden: false, autoFocus:true,menuHidden:true});
  },
  edit:function(e){
    var index = this.data.cur;
    var array = this.data.marker;
    var that = this;
    console.log("***",array[index].key2);
    if (array[index].key2==1){
      //有笔记，修改笔记
      wx.setClipboardData({
        data: array[index].value2,
        success(res) {
          wx.getClipboardData({
            success(res) {
              console.log(res.data) // data
              that.setData({noteValue:res.data})
              that.note();
              //清除数据，没完
            }
          })
 
        }
      })
      

    }
    else{
      //没有笔记，新建笔记
      note();
    }
  },
  /**
   * 摘抄事件
   */
  excerpt:function(e){
    var index = this.data.cur;
    var that = this;
    wx.setClipboardData({
      data: that.data.content[index][1],
      success(res) {
        // wx.getClipboardData({
        //   success(res) {
        //     console.log(res.data) // data
        //   }
        // })
        that.refresh();
        wx.navigateTo({
          url: '摘抄页面',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    })
  },
  /**
   * 擦除事件
   */
  erase:function(e){
    console.log("==擦除");
    var index = this.data.cur;
    var that = this;
    var array = that.data.marker;
    array[index].key1 = 0;
    array[index].value1 = '';
    array[index].key2 = 0;
    array[index].value2 = '';
    that.setData({marker:array});
  }
})