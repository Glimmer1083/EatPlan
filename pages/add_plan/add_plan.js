const app = getApp();
var that;
var deltaX = 0;
var minValue = 1;

Page({
  data: {
      tabbar: {},
      chooseSize:false,
      animationData:{},
      choosenItem: {},
      todayList:[],
      dateList: [],
      current: 'tab1',
      toggle: false,
      // 标尺
      canvasHeight: 80,
      canvasWidth:0,
      value: 0,
  },

  onLoad:function(options){
    // 生命周期函数--监听页面加载
    console.log(options);
    this.prepdata();
    app.editTabbar();
    var that= this;
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    var Y =date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var today = Y + '年' + M + '月' + D + '日';
    var selectDate = Y + '/' + M + '/' + D;
    for (let index = 0; index < app.globalData.allplan.length; index++) {
      if(app.globalData.allplan[index].name == options.planName){
        app.globalData.planList = app.globalData.allplan[index].planList;
        this.setData({
          planIndex: index
        });
      }
    }
    var index = this.dateInlist(selectDate);
    if (index != -1){
      this.setData({
        todayList: app.globalData.planList[index]
      });
    }
    this.setData({
      today: today,
      selectDate: selectDate,
    });
  },

  onReady:function(){
    deltaX = 0;
  },

  onShow:function(){
    this.prepdata();
  },

  addsports: function(e) {
    this.setData({
      type: 'sport'
    });
    this.toggleBottomModal();
  },
  
  addeat: function(e) {
    this.setData({
      type: 'eat'
    });
    this.toggleBottomModal();
  },

  adddrink: function(e) {
    this.setData({
      type: 'drink'
    });
    this.toggleBottomModal();
  },
  
  bindgoalInput: function(e){
    this.setData({
      goal: e.detail.value
    });
  },

  bindweightInput: function(e){
    this.setData({
      weight: e.detail.value
    });
  },

  bindsubmitplan: function(e){
    var index = this.dateInlist(this.data.selectDate);
    app.globalData.planList[index].goal = this.data.goal;
    app.globalData.planList[index].weight = this.data.weight;
    app.globalData.allplan[this.data.planIndex].planList = app.globalData.planList;
    wx.showToast({
      title: '计划提交成功！',
      icon: 'none',
      image: '',
      duration: 1500,
      mask: false,
    });
  },

  chooseItem: function(e) {
    console.log(e)
    if (e.currentTarget.dataset.type == 'food' || e.currentTarget.dataset.type == 'drink' || e.currentTarget.dataset.type == 'sport'){
      wx.navigateTo({
        url: '../add_item/add_item?type=' + e.currentTarget.dataset.type,
      });
    } else {
      var that = this;
      this.toggleScaleModal();
      this.toggleBottomModal();
      var item = {
        itemName: e.currentTarget.dataset.itemname, 
        calories: e.currentTarget.dataset.calories,
        amount: 0
      };
      this.setData({
        choosenItem: item,
        menu: 'add'
      });
      this.drawRuler();
      this.drawCursor();
    }
  },

  addPlan: function(e){
    var that = this;
    var item = {
      itemName: this.data.choosenItem.itemName, 
      calories: this.data.choosenItem.calories,
      amount: this.data.value,
      no: 0
    };
    this.setData({
      choosenItem: item
    });
    var index = this.dateInlist(this.data.selectDate);
    if (this.data.type == 'eat'){
      app.globalData.planList[index].subgoal.eat.push(this.data.choosenItem);
      // 更新编号
      for (let i = 0 ; i < app.globalData.planList[index].subgoal.eat.length ; i++) {
        app.globalData.planList[index].subgoal.eat[i].no = i;
      }
      console.log('push ok');
    } else if (this.data.type == 'drink'){
      app.globalData.planList[index].subgoal.drink.push(this.data.choosenItem);
      for (let i = 0 ; i < app.globalData.planList[index].subgoal.drink.length ; i++) {
        app.globalData.planList[index].subgoal.drink[i].no = i;
      }
      console.log('push ok');
    } else if (this.data.type == 'sport'){
      console.log(index)
      app.globalData.planList[index].subgoal.sport.push(this.data.choosenItem);
      for (let i = 0 ; i < app.globalData.planList[index].subgoal.sport.length ; i++) {
        app.globalData.planList[index].subgoal.sport[i].no = i;
      }
      console.log('push ok');
    }
    this.setData({
      todayList: app.globalData.planList[index],
      isScaleModal: that.data.isScaleModal ? false : true,
      value: 0,
      addMessage: false
    });
  },

  delete_record: function(e){
    console.log(e);
    var that = this;
    var no = e.currentTarget.dataset.no;
    var type = e.currentTarget.dataset.type;
    var date_index = this.dateInlist(this.data.selectDate);
    console.log(date_index);
    if (type == 'eat') {
      for (let index = app.globalData.planList[date_index].subgoal.eat.length - 1; index >=0 ; index--) {  
        if (app.globalData.planList[date_index].subgoal.eat[index].no === no){
          app.globalData.planList[date_index].subgoal.eat.splice(index,1);
        }
      } 
    } else if (type == 'drink'){
      for (let index = app.globalData.planList[date_index].subgoal.drink.length - 1; index >=0 ; index--) {  
        if (app.globalData.planList[date_index].subgoal.drink[index].no === no){
          app.globalData.planList[date_index].subgoal.drink.splice(index,1);
        }
      } 
    } else if (type == 'sport'){
      for (let index = app.globalData.planList[date_index].subgoal.sport.length - 1; index >=0 ; index--) {  
        if (app.globalData.planList[date_index].subgoal.sport[index].no === no){
          app.globalData.planList[date_index].subgoal.sport.splice(index,1);
        }
      } 
    } else if (type == 'weight'){
      for (let index = app.globalData.planList[date_index].subgoal.eat.length - 1; index >=0 ; index--) {  
        if (app.globalData.planList[date_index].subgoal.eat[index].no === no){
          app.globalData.planList[date_index].subgoal.eat.splice(index,1);
        }
      } 
    }
    
    if (type == 'eat') {
      for (let index = 0 ; index < app.globalData.planList[date_index].subgoal.eat.length ; index++) {
        app.globalData.planList[date_index].subgoal.eat[index].no = index;
      } 
    } else if (type == 'drink'){
      for (let index = 0 ; index < app.globalData.planList[date_index].subgoal.drink.length ; index++) {
        app.globalData.planList[date_index].subgoal.drink[index].no = index;
      }      
    } else if (type == 'sport'){
      for (let index = 0 ; index < app.globalData.planList[date_index].subgoal.sport.length ; index++) {
        app.globalData.planList[date_index].subgoal.sport[index].no = index;
      }
    } else if (type == 'weight'){
      for (let index = 0 ; index < app.globalData.planList[date_index].subgoal.eat.length ; index++) {
        app.globalData.planList[date_index].subgoal.eat[index].no = index;
      } 
    }
    this.setData({
      todayList: app.globalData.planList[date_index],
      toggle: that.data.toggle ? false : true
    });
  },

  edit_amount: function(e){
    console.log(e);
    var that = this;
    var no = e.currentTarget.dataset.no;
    var type = e.currentTarget.dataset.type;
    this.setData({
      isScaleModal: that.data.isScaleModal ? false : true,
      menu: 'edit',
      editNo: no,
      editType: type,
      value: 0
    });
    this.drawRuler();
    this.drawCursor();
  },
  
  editPlan: function(e){
    var that = this;
    var no = this.data.editNo;
    var type = this.data.editType;
    var date_index = this.dateInlist(this.data.selectDate);
    if (type == 'eat') {
      for (let index = app.globalData.planList[date_index].subgoal.eat.length - 1; index >=0 ; index--) {  
        if (app.globalData.planList[date_index].subgoal.eat[index].no === no){
          app.globalData.planList[date_index].subgoal.eat[index].amount = this.data.value;
        }
      } 
    } else if (type == 'drink'){
      for (let index = app.globalData.planList[date_index].subgoal.drink.length - 1; index >=0 ; index--) {  
        if (app.globalData.planList[date_index].subgoal.drink[index].no === no){
          app.globalData.planList[date_index].subgoal.drink[index].amount = this.data.value;
        }
      } 
    } else if (type == 'sport'){
      for (let index = app.globalData.planList[date_index].subgoal.sport.length - 1; index >=0 ; index--) {  
        if (app.globalData.planList[date_index].subgoal.sport[index].no === no){
          app.globalData.planList[date_index].subgoal.sport[index].amount = this.data.value;
        }
      } 
    } else if (type == 'weight'){
      for (let index = app.globalData.planList[date_index].subgoal.eat.length - 1; index >=0 ; index--) {  
        if (app.globalData.planList[date_index].subgoal.eat[index].no === no){
          app.globalData.planList[date_index].subgoal.eat[index].amount = this.data.value;
        }
      } 
    }
    this.setData({
      todayList: app.globalData.planList[date_index],
      toggle: that.data.toggle ? false : true,
      isScaleModal: this.data.isScaleModal ? false : true,
      value: 0
    });
  },
  
  // 工具函数

  getfulldate: function(e){
    var dateList = [];
    for (let index = 0; index < app.globalData.allplan[this.data.planIndex].planList.length; index++) {
      dateList.push(app.globalData.allplan[this.data.planIndex].planList[index].date);
    }
    this.setData({
      dateList: dateList
    });
  },
  
  onTabsChange: function(e) {
    console.log('onTabsChange', e);
    const { key } = e.detail;
    if (this.data.type == 'eat') {
      var index = this.data.eat_tabs.map((n) => n.key).indexOf(key);
      this.setData({
        eat_key: key,
        eat_index: index,
      });
    } 
    else if (this.data.type == 'drink'){
      var index = this.data.drink_tabs.map((n) => n.key).indexOf(key);
      this.setData({
        drink_key: key,
        drink_index: index,
      });
    } 
    else if (this.data.type == 'sport'){
      var index = this.data.sport_tabs.map((n) => n.key).indexOf(key);
      this.setData({
        sport_key: key,
        sport_index: index,
      });
    }
  },

  onSwiperChange: function(e) {
    console.log('onSwiperChange', e)
    const { current: index, source } = e.detail;
    if (this.data.type == 'eat') {
      var { key } = this.data.eat_tabs[index];
      if (!!source) {
        this.setData({
          eat_key: key,
          eat_index: index,
        });
      }
    } 
    else if (this.data.type == 'drink'){
      var { key } = this.data.drink_tabs[index];
      if (!!source) {
        this.setData({
          drink_key: key,
          drink_index: index,
        });
      }
    }
    else if (this.data.type == 'sport'){
      var { key } = this.data.sport_tabs[index];
      if (!!source) {
        this.setData({
          sport_key: key,
          sport_index: index,
        });
      }
    }
  },

  toggleScaleModal: function(){
    this.setData({
      isScaleModal: this.data.isScaleModal ? false : true
    });
  },

  toggleBottomModal: function(){
    this.setData({
      isBottomModal: this.data.isBottomModal ? false : true
    });
  },

  cancelInputB: function() {
    this.toggleBottomModal();
  },

  cancelInputS: function() {
    this.toggleScaleModal();
  },

  dayClick: function(e){
    var that = this;
    var str = 'tabbar.list[2].pagePath';
    var Y = e.detail.year;
    //获取月份
    var M = e.detail.month < 10 ? '0' + (e.detail.month) : e.detail.month;
    //获取当日日期
    var D = e.detail.day < 10 ? '0' + e.detail.day : e.detail.day;
    var today = Y + '年' + M + '月' + D + '日';
    var selectDate = Y + '/' + M + '/' + D;
    this.setData({
      today: today,
      [str]: '/pages/middle/middle?date=' + selectDate,
      selectDate: selectDate
    });
    this.onPickHeaderClick();
    this.dateInlist(selectDate);
    var index = this.dateInlist(selectDate);
    this.setData({
      todayList: app.globalData.planList[index],
      value: 0
    });
    this.getfulldate();
    // 标记
    var days_color = [];
    var month = '';
    for (let index = 0; index < this.data.dateList.length; index++) {
        var time_1 = new Date(this.data.dateList[index]);
        var time_2 = new Date(this.data.selectDate);
        var y_1 = time_1.getFullYear();
        var y_2 = time_2.getFullYear();
        var m_1 = time_1.getMonth() + 1;
        var m_2 = time_2.getMonth() + 1;
        if( y_1 == y_2 ){
          if ((m_1 - m_2) == 0 ){
            month = 'current';
          } else if ((m_1 - m_2) == -1 ){
            month = 'prev';
          } else if ((m_1 - m_2) == 1 ){
            month = 'next';
          } else{
            continue;
          }
        } else {
          continue;
        }
        var day = {
          month: month,
          day: time_1.getDate(),
          color: '#ffffff',
          background: '#f17c67'
        };
        days_color.push(day);
    }
    this.setData({
      days_color: days_color
    });
  },

  onPickHeaderClick: function () {
    this.setData({
        openPicker: !this.data.openPicker,
        needAnimation : true
    });
  },

  dateInlist: function (date){
    var index = 0;
    for (; index < app.globalData.planList.length; index++) {
      if (app.globalData.planList[index].date == date) {
        break;
      }
    }
    if ((index == app.globalData.planList.length) && (app.globalData.planList[index - 1].date != date)){
      var plan = {
        goal: 0,
        date: date,
        subgoal: {
          eat: [],
          sport: [],
          drink: [],
          weight: 0
        }
      };
      app.globalData.planList.push(plan);
      return -1;
    } else {
      return index;
    }
  },

  drawRuler: function(canvas_show) {
    var that = this;
		/* 1.定义变量 */
    // var screenWidth = wx.getSystemInfoSync().windowWidth;
    var screenWidth = 309;
		var origion = {x: screenWidth / 2, y: that.data.canvasHeight};
		var end = {x: screenWidth / 2, y: that.data.canvasHeight};
		var heightDecimal = 50;
		var heightDigit = 25;
		var fontSize = 20;
		var maxValue = 2000;
		var currentValue = 20;
		var ratio = 10;
		var canvasWidth = maxValue * ratio + screenWidth - minValue * ratio;
		that.setData({
			canvasWidth: canvasWidth,
			scrollLeft: (currentValue - minValue) * ratio
		});
		/* 2.绘制 */
		const context = wx.createCanvasContext('canvas-ruler');
		for (var i = 0; i <= maxValue; i++) {
			context.beginPath();
			context.moveTo(origion.x + (i - minValue) * ratio, origion.y);
			context.lineTo(origion.x + (i - minValue) * ratio, origion.y - (i % ratio == 0 ? heightDecimal : heightDigit));
			context.setLineWidth(2);
			context.setStrokeStyle(i % ratio == 0 ? 'gray' : 'darkgray');
			context.stroke();
			context.setFillStyle('gray');
			if (i % ratio == 0) {
				context.setFontSize(fontSize);
				context.fillText(i == 0 ? ' ' + i : i, origion.x + (i - minValue) * ratio - fontSize / 2, fontSize);
			}
			context.closePath();
    }
    context.draw(false, function (e) {
      console.log('draw callback')
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: that.data.canvasWidth,
        height: that.data.canvasHeight,
        canvasId: 'canvas-ruler',
        success: function(res) {
          that.setData({ rulerImg: res.tempFilePath});
        }
      });
    });
  },

	drawCursor: function () {
    /* 定义变量 */
    var that = this;
    var screenWidth = 309;
		var center = {x: screenWidth / 2, y: 5};
		var length = 20;
		var left = {x: center.x - length / 2, y: center.y + length / 2 * Math.sqrt(3)};
		var right = {x: center.x + length / 2, y: center.y + length / 2 * Math.sqrt(3)};
		const context = wx.createCanvasContext('canvas-cursor');
		context.moveTo(center.x, center.y);
		context.lineTo(left.x, left.y);
		context.lineTo(right.x, right.y);
		context.setFillStyle('#f17c67');
		context.fill();
		context.draw(false, function (e) {
      console.log('draw callback')
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: screenWidth,
        height: 40,
        canvasId: 'canvas-cursor',
        success: function(res) {
          that.setData({ cursorImg: res.tempFilePath});
        }
      });
    });
  },
  
  bindscroll: function (e) {
    var that = this;
		// deltaX 水平位置偏移位，每次滑动一次触发一次，所以需要记录从第一次触发滑动起，一共滑动了多少距离
		deltaX += e.detail.deltaX;
		var value = (- deltaX / 10 + minValue).toFixed(1);
		if (value < 0.01) {
			value = 0;
		} else if (value >= 2000.0) {
			value = 2000.0;
		}
		// 数据绑定
		that.setData({
			value: value
		});
  },

  prepdata: function(){
    this.setData({
      eat_tabs: [
        {
          key: 'tab1',
          title: '我的食谱',
          content: app.globalData.itemdata.user_define_food
        },
        {
          key: 'tab2',
          title: '五谷类',
          content: app.globalData.itemdata.wugulei
        },
        {
          key: 'tab3',
          title: '蔬菜类',
          content: app.globalData.itemdata.shucailei
        },
        {
          key: 'tab4',
          title: '水果类',
          content: app.globalData.itemdata.shuiguolei
        },
        {
          key: 'tab5',
          title: '肉类',
          content: app.globalData.itemdata.roulei
        },
        {
          key: 'tab6',
          title: '蛋类',
          content: app.globalData.itemdata.danlei
        },
        {
          key: 'tab7',
          title: '水产类',
          content: app.globalData.itemdata.shuichanlei
        },
        {
          key: 'tab8',
          title: '糕点小吃',
          content: app.globalData.itemdata.gaodianlei
        },
        {
          key: 'tab9',
          title: '其他食品',
          content: app.globalData.itemdata.qita
        }
      ],
      drink_tabs: [
        {
          key: 'tab1',
          title: '我的饮品',
          content: app.globalData.itemdata.user_define_drink
        },
        {
          key: 'tab2',
          title: '糖类',
          content: app.globalData.itemdata.tanglei
        },
        {
          key: 'tab3',
          title: '奶类',
          content: app.globalData.itemdata.nailei
        },
        {
          key: 'tab4',
          title: '糕点小吃',
          content: app.globalData.itemdata.gaodianlei
        },
        {
          key: 'tab5',
          title: '其他食品',
          content: app.globalData.itemdata.qita
        }
      ],
      sport_tabs: [
        {
          key: 'tab1',
          title: '我的运动',
          content: app.globalData.itemdata.user_define_sport
        },
        {
          key: 'tab2',
          title: '走路跑步',
          content: app.globalData.itemdata.zoulupaobu
        },
        {
          key: 'tab3',
          title: '力量',
          content: app.globalData.itemdata.liliang
        },
        {
          key: 'tab4',
          title: '器械',
          content: app.globalData.itemdata.qixie
        },
        {
          key: 'tab5',
          title: '球类',
          content: app.globalData.itemdata.qiulei
        }
      ]
    });
  }
});