import { $wuxSelect } from '../../dist/index'
import { $wuxToptips } from '../../dist/index'

var serverUrl = 'https://xwnotebook.cn:8000';
var app = getApp();
var user_id ;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    article_group_list: [
    ], 
    excerpt_group_list:[],
    index:0,
    index2:0,
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
    excerptHidden:true,
    evilHidden: true,
    autoFocus:false,
    windowHeight:null,
    windowWidth:null,
    noteStyle:'',
    bottom: 0,
    menuStyle:'',
    noteValue:'',
    promptstyle:'',
    note:'',
    chooseColor:'',
    title:'',
    author:'',
    content: [],
    marker: [{},{ key1:0, value1:'', key2:1, value2:'123' }, { key1:0, value1:'', key2:0, value2:'' }, { key1: 1, value1: '#0ff', key2: 0, value2: '' }, { key1: 0, value1: '', key2: 1, value2: '笔记记录' }, { key1: 1, value1: '#0ff', key2: 1, value2: '这是一个笔记' },{ key1:0, value1:'', key2:0, value2:'' },{}, { key1:0, value1:'', key2:0, value2:'' }, { key1:0, value1:'', key2:0, value2:'' }, { key1:0, value1:'', key2:0, value2:'' }, { key1:0, value1:'', key2:0, value2:'' }, { key1:0, value1:'', key2:0, value2:'' }, { key1:0, value1:'', key2:0, value2:'' }, { key1:0, value1:'', key2:0, value2:'' }, { key1:0, value1:'', key2:0, value2:'' },{ key1:0, value1:'', key2:0, value2:'' },{ key1:0, value1:'', key2:0, value2:'' }],
    modify:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    user_id = app.globalData.user_id;
    //console.log(options);
    //console.log(options);
    var that = this;
    //调用load_article接口
    if (options.article_url) {
      var article_url = options.article_url
      this.load_article(article_url);
      console.log(options)
    }
    //调用get_article_info接口
    if (options.article_id) {
      var article_id = options.article_id
      this.get_article_info(article_id)
      console.log(options)
    }
   
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res.windowWidth)
        //console.log(res.windowHeight)
        that.setData({ windowHeight: res.windowHeight, windowWidth: res.windowWidth});//设备宽高
      }
    });
    
    //获取article_group_list
    var article_group_list;
    wx.request({
      url: serverUrl+'/initial_article_group_list',
      data:{
        user_id:user_id
      },
      success:function(res){
        that.setData({
          article_group_list:res.data.article_group_list
        })
      }
    })
  
  // 获取excerpt_group_list
    var excerpt_group_list;
    wx.request({
      url: serverUrl+'/initial_excerpt_group_list',
      data:{
        user_id:user_id
      },
      success:function(res){
        that.setData({
          excerpt_group_list:res.data.excerpt_group_list
        })
      }
    })
  },
  // 点击下拉文章显示框
  selectTap() {
    var article_group_list = this.data.article_group_list;
    this.setData({
      selectShow: !this.data.selectShow,
      article_group_list: article_group_list
    });
  },
  // 点击文章下拉列表
  optionTap(e) {
    var that = this;
    var article_group_list = this.data.article_group_list;
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index: Index,
      selectShow: !this.data.selectShow
    });
    wx.request({
      url: serverUrl + '/get_articles_by_group',
      data: {
        user_id: app.globalData.user_id,
        group_name: article_group_list[Index].group_name
      },
      success: function (res) {
        that.setData({
          article_list: res.data.article_list
        })
      }
    })
  },

  // 点击下拉摘抄显示框
  selectTap2() {
    var excerpt_group_list = this.data.excerpt_group_list;
    this.setData({
      selectShow: !this.data.selectShow,
      excerpt_group_list: excerpt_group_list
    });
  },

  // 点击摘抄下拉列表
  optionTap2(e) {
    var that = this;
    var excerpt_group_list = this.data.excerpt_group_list;
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index2: Index,
      selectShow: !this.data.selectShow
    });
    // wx.request({
    //   url: serverUrl + '/get_excerpt_by_group',
    //   data: {
    //     user_id: app.globalData.user_id,
    //     group_name: excerpt_group_list[Index].group_name
    //   },
    //   success: function (res) {
    //     that.setData({
    //       excerpt_list: res.data.excerpt_list
    //     })
    //   }
    // })
  },
 
  load_article: function (article_url) {
    var that = this;
    console.log("----", user_id);
    wx.request({
      url: serverUrl + '/load_article',
      data: {
        'url': article_url,
        'user_id': user_id
      },
      success: function (res) {
        //console.log(res.data)
        that.setData({
          article_id: res.data.article_id,
          title: res.data.article_dic.title,
          author: res.data.article_dic.profile_nickname,
          content: res.data.article_dic.content,
          marker: res.data.mark_list
        });

      }
    })
  },
  get_article_info: function (article_id) {
    var that = this;
    wx.request({
      url: serverUrl + '/get_article_info',
      data: {
        'article_id': article_id,
        'user_id': user_id
      },
      success: function (res) {
        //console.log(res.data)
        that.setData({
          article_id: article_id,
          title: res.data.article_dic.title,
          author: res.data.article_dic.profile_nickname,
          content: res.data.article_dic.content,
          marker: res.data.mark_list
        });

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
      excerptHidden:true,
      evilHidden: true,
      editHidden:true,
      noteStyle: '',
      menuStyle: '',
      promptStyle:'',
      bottom:0,
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
  save_excerpt: function (e) {
    var index = this.data.cur;
    //console.log(index);
    var group_index = this.data.index2;
    //console.log(group_index);
    var that = this;
    var excerpt = that.data.content[index][1];
    var article_id = that.data.article_id;
    user_id = app.globalData.user_id;
    var group_name = that.data.excerpt_group_list[group_index].group_name;
    wx.request({
      url: serverUrl + '/save_excerpt',
      data: {
        excerpt_content: excerpt,
        user_id: user_id,
        article_id: article_id,
        group_name: group_name
      },
      success: function (res) {
        if (res.data.state_code == 1) {
          $wuxToptips().success({
            hidden: false,
            text: '摘抄成功！',
            duration: 3000,
            success() { },
          })
          that.refresh();
        }
      },
      fail: function (res) {
        $wuxToptips().show({
          icon: 'cancel',
          hidden: false,
          text: '摘抄失败！请稍后再试',
          duration: 3000,
          success() { },
        })
        that.refresh();
      }
    });
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
  modifyStyle: function (e) {
    //console.log(e);
    var style = "bottom:" + e.detail.height + "px"
    console.log(style);
    this.setData({ bottom: e.detail.height });
  },
  losefocus() {
    var style = "bottom:" + 0 + "px"
    console.log(style);
    this.setData({ bottom: 0 });
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
              that.refresh();
            }
            else{
              that.toptipFail();
              that.refresh();
            }
          },
          fail:function(e){
            that.toptipFail();
            that.refresh();
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
  excerpt() {
    var width = this.data.windowWidth;
    var height = this.data.windowHeight;
    var style = "width:" + width + "px;height:" + height + "px;"
    this.setData({ evilHidden: false, excerptHidden: false, promptStyle: style });
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
