import { $wuxActionSheet } from '../../dist/index'

const app = getApp()
var user_id;
var serverUrl = 'https://xwnotebook.cn:8000';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: "../icon/gobg.png",//用户选择的图片，默认有一张
    imgH:240,
    imgW:320,
    color:"#FFDEAD",
    wechat: "../icon/weixin.png",
    quan: "../icon/moments.png",
    inputValue: "",
    maskHidden: false,
    name: "",
    touxiang: "",
    title: "",
    excerpt_detail: ""
  },
  //获取输入框的值
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  //点击提交按钮
  btnclick: function () {
    var text = this.data.inputValue
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('-----'+options);
    this.setData({excerpt_detail:options.excerpt_content,title:options.title});
    var that = this;
    wx.getUserInfo({
      success: res => {
        console.log(res.userInfo, "huoqudao le ")
        this.setData({
          name: res.userInfo.nickName,
        })
        wx.downloadFile({
          url: res.userInfo.avatarUrl, //仅为示例，并非真实的资源
          success: function (res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              console.log(res, "reererererer")
              that.setData({
                touxiang: res.tempFilePath
              })
            }
          }
        })
      }
    })

  },
  //将canvas转换为图片保存到本地
  createNewImg: function () {
    var that = this;
    var color = that.data.color;
    var canvasW=375;
    var canvasH=667;
    var context = wx.createCanvasContext('mycanvas');//创建画布
    context.setFillStyle("#fff");
    context.fillRect(0, 0, canvasW, canvasH)//长宽写死？？
    //头顶的框
    //小的
    context.beginPath();
    context.setFillStyle(color);
    context.fillRect(30,90,35,35);
    
    //大的
    context.beginPath();
    context.setFillStyle(color);
    context.fillRect(100, 20, 55, 55);

    //小程序图片或者二维码
    var path = "../icon/logo.png";
    context.drawImage(path, 250, 10,100,100 );
    context.save();
    //中间
    //矩形
    context.beginPath();
    
    //图片
    // var sx=0;
    // var sy=0;
    // if(that.data.imgH>=240){
    //   sy=0.5*that.data.imgH-120;
    // }
    // if(that.data.imgW>=320){
    //   sx=0.5*that.data.imgW-160;
    // }
   
    // if(sx==0||sy==0){//大小不够
    //   //drawImage(imageResource, dx, dy, dWidth, dHeight)
    //   var dx = 160-0.5*that.data.imgW;
    //   var dy = 120 - 0.5 * that.data.imgH;
    //   console.log(dx,dy);
    //   context.drawImage(that.data.img, 27.5+dx, 150+dy);
    // }else if(sx!=0&&sy!=0){//太大
    //   context.drawImage(that.data.img, sx, sy, 320, 240, 27.5, 150, 320, 240);
    // }
    var bottomStartX = 0;
    var bottomStartY=0;

    if(that.data.imgH==that.data.imgW){
      context.rect(37.5, 140, 300, 300);
      context.fill();
      context.clip();
      context.drawImage(that.data.img, 0, 0, that.data.imgW, that.data.imgH, 37.5, 140, 300, 300);
      bottomStartX = 47.5;
      bottomStartY=440;
    }
    else{
      context.setStrokeStyle("#fff");
      context.rect(27.5, 150, 320, 240);
      context.fill();
      context.clip();
      context.drawImage(that.data.img, 0, 0, that.data.imgW, that.data.imgH, 27.5, 150, 320, 240);
      bottomStartX = 37.5;
      // if (320 * that.data.imgH / that.data.imgW>240){
      //   bottomStartY = 150 +240; 
      // }
      // else{
      //   bottomStartY = 150 + 320 * that.data.imgH / that.data.imgW;
      //   console.log("shenme"); 
      // }
      bottomStartY = 390;
      
    }
    context.restore();

    //底部
    //线条
    context.beginPath();
    context.moveTo(bottomStartX,bottomStartY);
    console.log(bottomStartX, bottomStartY);
    context.lineTo(bottomStartX,canvasH-25);
    context.setStrokeStyle(color);
    context.setLineWidth(3);
    context.stroke();
    //圆点
    context.beginPath();
    context.arc(bottomStartX, canvasH-25, 5, 0, 2 * Math.PI);
    context.setFillStyle(color);
    context.fill();
    // context.fillRect(30, 100, 40, 40);
    

    //摘抄
    var excerpt = that.data.excerpt_detail;
    console.log(excerpt);
    var len = excerpt.toString().length;
    var times = len/13;
    console.log(len,times);
    var start = 0;
    context.setFontSize(20);
    context.setFillStyle('#333333');
    context.setTextAlign('left');
    for(var i=0;i<times&&start<len-1;i++){
      var char = excerpt[start + 13];
      if (char == ',' || char == '；' || char == '、' || char == '：' || char == ':' ){
        context.fillText(excerpt.substring(start, start + 14), bottomStartX + 20, bottomStartY + 40 + 20 * i);
        start += 14;
      }else{
        context.fillText(excerpt.substring(start, start + 13), bottomStartX + 20, bottomStartY + 40 + 20 * i);
        start += 13;
      }
      context.stroke();
    }

    context.fillText(excerpt.substring(start), bottomStartX + 20, bottomStartY + 40 + 20 * times);
    context.stroke();
    
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,//图片路径
            canvasHidden: true
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 200);
  },
  //点击保存到相册
  baocun: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          }, 
          fail: function (res) {
            console.log(11111);
          }
        })
      }

    })
  },
  /**
   * 点击相册
   */
  shareToAlbum:function(e){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log("图片临时路径：",res.tempFilePaths[0]);
        that.setData({img:res.tempFilePaths[0]});
        //获取图片的宽高
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success(res) {
            console.log(res.width)
            console.log(res.height)
            that.setData({imgW:res.width,imgH:res.height});
            that.formSubmit();
          },
          fail(){
            console.log("获取图片宽高失败");
          }
        })
      },
      fail() {
        console.log("获取图片失败");
      }
    })
  },
  /**
   * 相机生成
   */
  shareToCamera: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log("图片临时路径：", res.tempFilePaths[0]);
        that.setData({ img: res.tempFilePaths[0] });
        //获取图片的宽高
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success(res) {
            console.log(res.width)
            console.log(res.height)
            that.setData({ imgW: res.width, imgH: res.height });
            that.formSubmit();
          },
          fail() {
            console.log("获取图片宽高失败");
          }
        })
      },
      fail() {
        console.log("获取图片失败");
      }
    })
  },
  //点击生成
  formSubmit: function (e) {
    var that = this;
    this.setData({
      maskHidden: false
    });
    wx.showToast({
      title: '图片生成中...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function () {
      wx.hideToast()
      that.createNewImg();
      that.setData({
        maskHidden: true
      });
    }, 1000)
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
    var that = this;
    wx.getUserInfo({
      success: res => {
        //console.log(res.userInfo, "huoqudao le ")
        this.setData({
          name: res.userInfo.nickName,
        })
        wx.downloadFile({
          url: res.userInfo.avatarUrl, //仅为示例，并非真实的资源
          success: function (res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              //console.log(res, "reererererer")
              that.setData({
                touxiang: res.tempFilePath
              })
            }
          }
        })
      }
    })
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
  onShareAppMessage: function (res) {
    console.log(1);
    return {
      //小程序的名字？
      title: "好咖啡要和朋友一起品尝，好句子也要和朋友一起分享。",
      path:'pages/home_page/home_page',//转发页面?????邀请码
     //imageUrl:'',//转发的图片路径
      success: function (res) {
        console.log(res, "转发成功")
      },
      fail: function (res) {
        console.log(res, "转发失败")
      }
    }
  },
  cancle(){
    this.setData({ maskHidden:false});
  },

  showActionSheet() {
    var that=this;
    const hideSheet = $wuxActionSheet().showSheet({
      theme: 'wx',
      titleText: '选择图片',
      buttons: [{
        text: '相机'
      },
        {
          text: '图库'
        },
      {
        text: '从手机相册选择'
      }
      ],
      buttonClicked(index, item) {
        hideSheet();
        if(index==0){
          //相机
          that.shareToCamera();
        }
        else if(index==1){
          //图库shareToImage
          //this.
        }
        else if(index==2){
          //相册
          that.shareToAlbum();
        }
      },
    })

  },

})

