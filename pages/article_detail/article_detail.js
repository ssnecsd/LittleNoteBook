import { $wuxSelect } from '../../dist/index'

var serverUrl = 'http://148.70.115.138:8000';
var app = getApp();
var user_id ;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    article_group_list: [
      {
        'group_name': '最近',
        'group_color': 'ccffcc',
        'article_count': 10
      },
      {
        'group_name': '文学',
        'group_color': 'ef7a82',
        'article_count': 12
      },
      {
        'group_name': '旅游',
        'group_color': 'ffcccc',
        'article_count': 12
      },
    ],
    index:0,
    article_id:null,
    group_name:null,
    cur: -1,
    active:false,
    startTime:0,
    endTime:null,
    menuHidden:true,
    noteHidden:true,
    highlightHidden:true,
    editHidden:true,
    promptHidden:true,
    evilHidden: true,
    autoFocus:false,
    windowHeight:null,
    windowWidth:null,
    noteStyle:'',
    editStyle:'',
    menuStyle:'',
    noteValue:'',
    promptstyle:'',
    note:'',
    chooseColor:'',
    title:'',
    author:'',
    content: [],
    marker: [{},{ key1:0, value1:'', key2:1, value2:'123' }, { key1:0, value1:'', key2:0, value2:'' }, { key1: 1, value1: '#0ff', key2: 0, value2: '' }, { key1: 0, value1: '', key2: 1, value2: '笔记记录' }, { key1: 1, value1: '#0ff', key2: 1, value2: '这是一个笔记' },{ key1:0, value1:'', key2:0, value2:'' },{}, { key1:0, value1:'', key2:0, value2:'' }, { key1:0, value1:'', key2:0, value2:'' }, { key1:0, value1:'', key2:0, value2:'' }, { key1:0, value1:'', key2:0, value2:'' }, { key1:0, value1:'', key2:0, value2:'' }, { key1:0, value1:'', key2:0, value2:'' }, { key1:0, value1:'', key2:0, value2:'' }, { key1:0, value1:'', key2:0, value2:'' },{ key1:0, value1:'', key2:0, value2:'' },{ key1:0, value1:'', key2:0, value2:'' }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    user_id = app.globalData.user_id;
    //console.log(options);
    var that = this;
    this.setData({article_id:options.article_id});
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res.windowWidth)
        //console.log(res.windowHeight)
        that.setData({ windowHeight: res.windowHeight, windowWidth: res.windowWidth});//设备宽高
      }
    });
    //zhende
    this.load_articletest();

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
  load_articletest: function () {
    var that = this;
    console.log("----", user_id);
    wx.request({
      url: serverUrl + '/load_article',
      data: {
        'url': 'https://mp.weixin.qq.com/s/G11wlj1tVg8A-7o4NKR-aQ',
        'user_id': user_id
      },
      success: function (res) {
        //console.log(res.data)
        that.setData({title: res.data.article_dic.title,
          author: res.data.article_dic.profile_nickname,
          content:res.data.article_dic.content,
          marker: res.data.mark_list});
        
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
    //this.refresh();//
    var that = this;
    //console.log(e);
    that.setData({cur:e.target.dataset.index});
    //console.log(that.data.cur);
    var  offsettop = e.target.offsetTop-30;
    var offsetleft = e.target.offsetLeft;
    if (offsettop<0){
      offsettop+=30;
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
    that.setData({cur:index});
    if (that.data.marker[index].key2==1){
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
    //console.log(e);
    this.setData({ startTime: e.timeStamp, startPos: { x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY}})
  },
  touchend:function(e){
    console.log("==touchend==");
    console.log(e);
    //this.setData({ endTime: e.timeStamp });
    var that = this;
    var during = e.timeStamp-this.data.startTime;
    var pos = {x:e.changedTouches[0].pageX,y:e.changedTouches[0].pageY}
    var staPos = that.data.startPos;
    var x = pos.x-staPos.x;
    var y = pos.y-staPos.y;
    var index = e.target.dataset.index;
    this.setData({ startTime:0 })
    if(Math.abs(x)<5&&Math.abs(y)<5){
      if(during>350){
        this.setData({active:true})
        this.menu(e);
      }else{
        this.review(e);
      }
    }
  },
  refresh:function(e){
    console.log("--refresh");
    this.setData({
      cur: -1,
      selectShow:false,
      active:false,
      startTime: 0,
      startPos:0,
      endTime: null,
      menuHidden: true,
      noteHidden: true,
      highlightHidden: true,
      promptHidden:true,
      evilHidden: true,
      editHidden:true,
      noteStyle: '',
      menuStyle: '',
      promptStyle:'',
      editStyle:'',
      note: ''})
  },
  highlight: function () {
    this.setData({ menuHidden: true, highlightHidden: false});
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
    this.refresh();
  },
  /**
   * 出现edit、笔记事件
   */
  note:function(e){
    console.log("==note");
    var width = this.data.windowWidth;
    var height = this.data.windowHeight;
    var style = "width:" + width + "px;height:" + height + "px;"
    //,promptStyle:style
    this.setData({ autoFocus:true, evilHidden: false,editHidden: false, menuHidden:true});
  },
  edit:function(e){
    console.log("++edit++");
    var index = this.data.cur;
    var array = this.data.marker;
    var that = this;
    //console.log(index, array);
    //that.refresh();
    //console.log("***",array[index].key2);
    if (array[index].key2==1){
      //有笔记，修改笔记
      this.setData({noteValue:array[index].value2,noteHidden:true});
      that.note();
    }
    else{
      //没有笔记，新建笔记
      that.note();
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
  },
  /**
   * 获取输入笔记内容
   */
  update:function(e){
    this.setData({noteValue:e.detail.value});
  },
  /**
   * 修改笔记、新建笔记
   */
  finishNote:function(e){
    console.log("==finishNote==");
    var str= this.data.noteValue;
    if (str!=''){
      console.log("__dddß");
      var array = this.data.marker;
      var index = this.data.cur;
      array[index].key2=1;
      array[index].value2=str;
      this.setData({marker:array});
    }
    this.refresh();
  },
  /**
   * 修改输入框样式
   */
  modifyStyle:function(e){
    console.log(e);
    var style = "bottom:" + e.detail.height +"px"
    console.log(style);
    this.setData({ editStyle:style});
  },
  losefocus(){
    var style = "bottom:" +0+ "px"
    console.log(style);
    this.setData({ editStyle: style });
  },
  save:function(){
    var that = this;
    wx.request({
      url: serverUrl+'/initial_article_group_list',
      data: { user_id: user_id},
      method: "POST",
      success:function(res){
        var group_index = that.data.index;
        console.log('---save');
        var group_name = res.data.article_group_list[group_index].group_name;
        console.log("==", that.data.marker);
        console.log("==", user_id);
        console.log("==", group_name);
        console.log("==", that.data.article_id);
        wx.request({
          url: serverUrl+'/save_article',
          method:"POST",
          data: {
            mark_list: that.data.marker,
            user_id: user_id,
            group_name: group_name,
            article_id: that.data.article_id
          },
          success: function (res) {
            //tishi
            if (res.data.state_code==1){
              that.toptipSuccess();
            }
            else{
              that.toptipFail();
            }
          },
          fail:function(e){
            that.toptipFail();
          }
        })
      }
    })
    
  },
  prompt(){
    this.refresh();
    var width = this.data.windowWidth;
    var height=this.data.windowHeight;
    var style = "width:"+width+"px;height:"+height+"px;"
    this.setData({evilHidden:false,promptHidden:false,promptStyle:style});
  },
  toptipFail() {
    $wuxToptips().show({
      icon: 'cancel',
      hidden: false,
      text: '文章保存失败！请稍后再试',
      duration: 3000,
      success() { },
    })
  },
  toptipSuccess() {
    $wuxToptips().success({
      hidden: false,
      text: '文章保存成功！',
      duration: 3000,
      success() { },
    })
  },
})
