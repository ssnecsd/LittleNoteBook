import { $wuxSelect } from '../../dist/index'

var serverUrl = 'http://148.70.115.138:8000';
var app = getApp();
var user_id = app.globalData.user_id;

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
    content: [[0, 'https://mmbiz.qpic.cn/mmbiz_png/SJxFylPllWxPoGaqTx8aRPA4Kl7lbicjJxbeKWZNGByKibO4KzLbotWuKg80t2SHiam8z4ox70JtZGkAAPJH0OePQ/640?wx_fmt=png'], [1, '  未成年人犯罪一再刺痛社会神经，轻率、无知的暴行，让大众开始质疑未成年人保护法规的初衷。'], [1, '今天的故事来自于一位少年犯的自述，他因一时失足身陷牢狱，却在这个过程里反思自身，并重新找到了自我归属。\n'], [1, '  这是真实故事计划第;441;个故事\n'], [1, '  故事时间：2013-2015年\n'], [1, '老师轻声安慰：“犯错了没什么，年轻的谁都犯过错，改了就好，进来这里也不一定是一件坏事。'], [1, '”我重重点点头。\n'], [1, '  之后每个星期能让我心情好点的事就是去上课，老师也会留作业，我都会按时完成。'], [0, 'https://mmbiz.qpic.cn/mmbiz_jpg/SJxFylPllWxPoGaqTx8aRPA4Kl7lbicjJxIlNope7c4kH6icaibJcibAVQNibV4icINV8sWMoCnomefWmy6wKDBXfIaA/640?wx_fmt=jpeg'],[1, '钢笔是利器，只有两只，大家要在值班员的指令下轮着用来写作业。'], [1, '功课做得好，我获得了一个点歌的机会。'], [1, '想了半天，我对老师说想听《卡农》，觉得它和铁窗外边、被阳光照耀的树很配。'], [1, '每天休息的时候我都会看。\n'], [1, '  我问李爽：“外边是什么树？'], [1, '”李爽翻着手中的《故事会》，头也不抬地说是杨梅。'], [1, '“好吃么？'], [1, '”李爽的视线从书移到我脸上：“你没吃过杨梅？'], [1, '”我点点头。\n']],
    marker: [{},{ key1:0, value1:'', key2:1, value2:'123' }, { key1:0, value1:'', key2:0, value2:'' }, { key1: 1, value1: '#0ff', key2: 0, value2: '' }, { key1: 0, value1: '', key2: 1, value2: '笔记记录' }, { key1: 1, value1: '#0ff', key2: 1, value2: '这是一个笔记' },{ key1:0, value1:'', key2:0, value2:'' },{}, { key1:0, value1:'', key2:0, value2:'' }, { key1:0, value1:'', key2:0, value2:'' }, { key1:0, value1:'', key2:0, value2:'' }, { key1:0, value1:'', key2:0, value2:'' }, { key1:0, value1:'', key2:0, value2:'' }, { key1:0, value1:'', key2:0, value2:'' }, { key1:0, value1:'', key2:0, value2:'' }, { key1:0, value1:'', key2:0, value2:'' },{ key1:0, value1:'', key2:0, value2:'' },{ key1:0, value1:'', key2:0, value2:'' }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //this.setdata({article_id:options.article_id});
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res.windowWidth)
        //console.log(res.windowHeight)
        that.setData({ windowHeight: res.windowHeight, windowWidth: res.windowWidth});//设备宽高
      }
    });
    //this.load_articletest();

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
  getNote:function(e){
    this.setData({noteValue:e.detail.value});
  },
  /**
   * 修改笔记、新建笔记
   */
  finishNote:function(e){
    console.log("==finishNote==");
    var str= this.data.noteValue;
    if (str!=''){
      var array = this.data.marker;
      var index = this.data.cur;
      array[index].key2=1;
      array[index].value2=str;
      this.setData({marker:array});
      this.refresh();
    }
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
      url: 'localhost/initial_article_group_list',
      data: { user_id: user_id},
      success:function(res){
        var group_index = that.data.index;
        var group_name = res[index].group_name;
        wx.request({
          url: 'localhost/save_article',
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
