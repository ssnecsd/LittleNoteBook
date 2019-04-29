
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    cur: 0,
    scroll: 0,
    colorSet: [
      "background-color:#FFFF00",
      'background-color:#B0E0E6',
      'background-color:#7FFFD4',
      'background-color:#FF6100',
      'background-color:#FFFFCD',
      'background-color:#F0FFF0',
      'background-color:#DDA0DD',
      'background-color:#A066D3',
      'background-color:#FFC0CB',
      'background-color:#FFE384'
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    choose: function (e) {
      var that = this;
      var index = e.target.dataset.index;
      //console.log(index)
      that.setData({ cur: index })
    },
    update: function (e) {
      //console.log(e.detail);
      var scroll = e.detail.scrollLeft;
      //console.log(scroll);
      this.setData({ scroll: scroll });
    },
    prevTap: function () {
      var that = this;
      var scroll = 0;
      const query = wx.createSelectorQuery().in(this);
      //console.log(query.select('#colorset'))
      query.select('#colorset').fields({
        scrollOffset: true,
      }, function (res) {
        res.scrollLeft // 节点的水平滚动位置
      }).exec(function (e) {
        scroll = e[0].scrollLeft;
        //console.log(scroll)
        if (scroll > 240) {
          scroll -= 240;
        } else {
          scroll = 0;
        }
        that.setData({ scroll: scroll });
      })
    },
    nextTap: function () {
      var that = this;
      var scroll=0; 
      const query = wx.createSelectorQuery().in(this);
      //console.log(query.select('#colorset'))
      query.select('#colorset').fields({
        scrollOffset: true,
      }, function (res) {
        res.scrollLeft // 节点的水平滚动位置
      }).exec(function (e){
        scroll=e[0].scrollLeft;
        //console.log(scroll)
        if (scroll + 240 < 300) {
          scroll += 240;
        } else {
          scroll = 331;
        }
        that.setData({ scroll: scroll });
      })

    },
    getLeft(e) {
      console.log('e');
      console.log(e);
    }
  }
})
