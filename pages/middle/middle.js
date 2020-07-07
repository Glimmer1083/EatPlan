// pages/middle/middle.js
var util = require("../../utils/time-utils.js");
import { $wuxKeyBoard } from '../../dist/index';
var that;
var deltaX = 0;
var minValue = 1;
const icon4 = 'data:image/png;base64,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';
const icon3 = 'data:image/png;base64,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'
const icon2 = 'data:image/png;base64,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'
const icon1 = 'data:image/png;base64,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'
const app = getApp();
const buttons = [{
        label: '体重',
        icon: icon4,
    },
    {
        label: '运动',
        icon: icon3,
    },
    {
        label: '喝水',
        icon: icon2,
    },
    {
        label: '饮食',
        icon: icon1,
    },
];

Page({
  data: {
    // 界面渲染  
    tabbar: {},
    floatButton: true,
    animationData: {},
    name: 'name1',
    choosenItem: {},
    type:'',
    selectDate: '',
    recordType: '',
    todayList:[],
    current: 'tab1',
    toggle: false,
    addMessage: false,
    // 标尺
    canvasHeight: 80,
    canvasWidth:0,
    value: 0,
    // 日历
    selectWeek:0,
    timeBean:{},
    // 浮钮
    buttons: buttons,
  },

  onLoad: function(options){
    app.editTabbar();
    this.prepdata();
    console.log(options.date);
    var that = this;
    this.setData({
      selectDate: options.date,
      selectDate_2: options.date,
      timeBean: util.getWeekDayList(0,options.date)
    });
    var index = this.dateInlist(options.date);
    if (index == -1 ){
      this.setData({
        addMessage: true,
      });
    } else {
      if ((app.globalData.record[index].eat.length == 0) && (app.globalData.record[index].drink.length == 0) && (app.globalData.record[index].sport.length == 0)){
        this.setData({
          addMessage: true,
        });
      } else {
        this.setData({
          todayList: app.globalData.record[index],
          addMessage: false
        });
      }
    }
  },

  onReady: function () {
    deltaX = 0;    
  },

  onShow: function(){
    this.prepdata();
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

  addRecord: function(e){
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
    var index = this.dateInlist(this.data.selectDate_2);
    if (this.data.type == 'eat'){
      app.globalData.record[index].eat.push(this.data.choosenItem);
      // 更新编号
      for (let i = 0 ; i < app.globalData.record[index].eat.length ; i++) {
        app.globalData.record[index].eat[i].no = i;
      }
      console.log('push ok');
    } else if (this.data.type == 'drink'){
      app.globalData.record[index].drink.push(this.data.choosenItem);
      for (let i = 0 ; i < app.globalData.record[index].drink.length ; i++) {
        app.globalData.record[index].drink[i].no = i;
      }
      console.log('push ok');
    } else if (this.data.type == 'sport'){
      app.globalData.record[index].sport.push(this.data.choosenItem);
      for (let i = 0 ; i < app.globalData.record[index].sport.length ; i++) {
        app.globalData.record[index].sport[i].no = i;
      }
      console.log('push ok');
    } else if (this.data.type == 'weight'){
      app.globalData.record[index].weight.push(this.data.choosenItem);
      for (let i = 0 ; i < app.globalData.record[index].weight.length ; i++) {
        app.globalData.record[index].weight[i].no = i;
      }
      console.log('push ok');
    }
    this.setData({
      todayList: app.globalData.record[index],
      value: 0,
      addMessage: false,
    });
    this.toggleScaleModal();
    this.toggleFloatButton();
  },
 
  delete_record: function(e){
    console.log(e);
    var that = this;
    var no = e.currentTarget.dataset.no;
    var type = e.currentTarget.dataset.type;
    var date_index = this.dateInlist(this.data.selectDate_2);
    console.log(date_index);
    if (type == 'eat') {
      for (let index = app.globalData.record[date_index].eat.length - 1; index >=0 ; index--) {  
        if (app.globalData.record[date_index].eat[index].no === no){
          app.globalData.record[date_index].eat.splice(index,1);
        }
      } 
    } else if (type == 'drink'){
      for (let index = app.globalData.record[date_index].drink.length - 1; index >=0 ; index--) {  
        if (app.globalData.record[date_index].drink[index].no === no){
          app.globalData.record[date_index].drink.splice(index,1);
        }
      } 
    } else if (type == 'sport'){
      for (let index = app.globalData.record[date_index].sport.length - 1; index >=0 ; index--) {  
        if (app.globalData.record[date_index].sport[index].no === no){
          app.globalData.record[date_index].sport.splice(index,1);
        }
      } 
    } else if (type == 'weight'){
      for (let index = app.globalData.record[date_index].eat.length - 1; index >=0 ; index--) {  
        if (app.globalData.record[date_index].eat[index].no === no){
          app.globalData.record[date_index].eat.splice(index,1);
        }
      } 
    }

    if (type == 'eat') {
      for (let index = 0 ; index < app.globalData.record[date_index].eat.length ; index++) {
        app.globalData.record[date_index].eat[index].no = index;
      } 
    } else if (type == 'drink'){
      for (let index = 0 ; index < app.globalData.record[date_index].drink.length ; index++) {
        app.globalData.record[date_index].drink[index].no = index;
      }      
    } else if (type == 'sport'){
      for (let index = 0 ; index < app.globalData.record[date_index].sport.length ; index++) {
        app.globalData.record[date_index].sport[index].no = index;
      }
    } else if (type == 'weight'){
      for (let index = 0 ; index < app.globalData.record[date_index].eat.length ; index++) {
        app.globalData.record[date_index].eat[index].no = index;
      } 
    }
    this.setData({
      todayList: app.globalData.record[date_index],
      toggle: that.data.toggle ? false : true
    });
  },

  edit_amount: function(e){
    console.log(e);
    var that = this;
    var no = e.currentTarget.dataset.no;
    var type = e.currentTarget.dataset.type;
    this.toggleScaleModal();
    this.toggleFloatButton();
    this.setData({
      menu: 'edit',
      editNo: no,
      editType: type,
      value: 0
    });
    this.drawRuler();
    this.drawCursor();
  },

  editRecord: function(e){
    var that = this;
    var no = this.data.editNo;
    var type = this.data.editType;
    var date_index = this.dateInlist(this.data.selectDate_2);
    if (type == 'eat') {
      for (var index = app.globalData.record[date_index].eat.length - 1; index >=0 ; index--) {  
        if (app.globalData.record[date_index].eat[index].no === no){
          app.globalData.record[date_index].eat[index].amount = this.data.value;
        }
      } 
    } else if (type == 'drink'){
      for (var index = app.globalData.record[date_index].drink.length - 1; index >=0 ; index--) {  
        if (app.globalData.record[date_index].drink[index].no === no){
          app.globalData.record[date_index].drink[index].amount = this.data.value;
        }
      } 
    } else if (type == 'sport'){
      for (var index = app.globalData.record[date_index].sport.length - 1; index >=0 ; index--) {  
        if (app.globalData.record[date_index].sport[index].no === no){
          app.globalData.record[date_index].sport[index].amount = this.data.value;
        }
      } 
    } else if (type == 'weight'){
      for (var index = app.globalData.record[date_index].eat.length - 1; index >=0 ; index--) {  
        if (app.globalData.record[date_index].eat[index].no === no){
          app.globalData.record[date_index].eat[index].amount = this.data.value;
        }
      } 
    }
    this.setData({
      todayList: app.globalData.record[date_index],
      toggle: that.data.toggle ? false : true,
      value: 0
    });
    this.toggleFloatButton();
    this.toggleScaleModal();
  },

  onClick: function(e) {
    var that= this;
    if (e.detail.index == 3) {
      this.setData({
        type: 'eat',
      });
      this.toggleBottomModal();
      this.toggleFloatButton();
    } else if (e.detail.index == 2) {
      this.setData({
        type: 'drink',
      });
      this.toggleBottomModal();
      this.toggleFloatButton();
    } else if (e.detail.index == 1) {
      this.setData({
        type: 'sport',
      });
      this.toggleBottomModal();
      this.toggleFloatButton();
    } else if (e.detail.index == 0) {
      this.addweight();
    }
  },

  addweight: function(e){
    var that = this;
    this.toggleFloatButton();
    var index = this.dateInlist(this.data.selectDate_2);
      $wuxKeyBoard().show({
        className: 'className',
        titleText: '单位：公斤',
        cancelText: '确认',
        inputText: '输入您的体重',
        password: false,
        showCancel: true,
        disorder: false,
        maxlength: -1,
        onChange(value) {
          console.log(`输入的体重是：${value}`);
          that.setData({
            weight: value
          })
          return true;
        },
        onConfirm() {
          if (index != -1) {
            app.globalData.record[index].weight = that.data.weight;
            that.setData({
              todayList: app.globalData.record[index],
            });
            that.toggleFloatButton();
          }
        },
        onHide() {
          that.setData({
            floatButton: true
          });
        }
      });
  },
  //展示日历函数

  lastWeek:function(e){
    var selectWeek = --this.data.selectWeek;
    var timeBean = this.data.timeBean;
    timeBean = util.getWeekDayList(selectWeek,this.data.selectDate);
    var currentWeekday = util.getCurrenrWeek(this.data.selectDate);
    var timestamp = new Date(this.data.selectDate).getTime() + (this.data.selectWeek * 7) * 24 * 60 * 60 * 1000 + (this.data.timeBean.selectDay - currentWeekday) * 24 * 60 * 60 * 1000;
    var date = new Date(timestamp);
    var Y =date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var selectDate_2 = Y + '/' + M + '/' + D;
    if (selectWeek != 0){
      timeBean.selectDay = util.getCurrenrWeek(this.data.selectDate_2);
    }
    this.setData({
      timeBean: timeBean,
      selectWeek: selectWeek,
      selectDate_2: selectDate_2
    });
    var index = this.dateInlist(selectDate_2);
    if (index == -1){
      this.setData({
        addMessage: true
      });
    } else {
      if ((app.globalData.record[index].eat.length == 0) && (app.globalData.record[index].drink.length == 0) && (app.globalData.record[index].sport.length == 0)){
        this.setData({
          addMessage: true,
        });
      } else {
        this.setData({
          todayList: app.globalData.record[index],
          addMessage: false
        });
      }
    }
  },

  nextWeek:function(e){
    var selectWeek = ++this.data.selectWeek;
    var timeBean = this.data.timeBean;
    timeBean = util.getWeekDayList(selectWeek, this.data.selectDate_2);

    var currentWeekday = util.getCurrenrWeek(this.data.selectDate);
    var timestamp = new Date(this.data.selectDate).getTime() + (this.data.selectWeek * 7) * 24 * 60 * 60 * 1000 + (this.data.timeBean.selectDay - currentWeekday) * 24 * 60 * 60 * 1000;
    var date = new Date(timestamp);
    var Y =date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var selectDate_2 = Y + '/' + M + '/' + D;
    if (selectWeek != 0){
      timeBean.selectDay = util.getCurrenrWeek(this.data.selectDate_2);
    }
    this.setData({
      timeBean: timeBean,
      selectWeek: selectWeek,
      selectDate_2: selectDate_2
    });
    var index = this.dateInlist(selectDate_2);
    if (index == -1){
      this.setData({
        addMessage: true
      });
    } else {
      if ((app.globalData.record[index].eat.length == 0) && (app.globalData.record[index].drink.length == 0) && (app.globalData.record[index].sport.length == 0)){
        this.setData({
          addMessage: true,
        });
      } else {
        this.setData({
          todayList: app.globalData.record[index],
          addMessage: false
        });
      }
    }
  },

  dayClick:function(e){
    var timeBean = this.data.timeBean;
    timeBean.selectDay = e.detail;
    this.setData({
      timeBean: timeBean,
    });
    var currentWeekday = util.getCurrenrWeek(this.data.selectDate);
    var timestamp = new Date(this.data.selectDate).getTime() + (this.data.selectWeek * 7) * 24 * 60 * 60 * 1000 + (this.data.timeBean.selectDay - currentWeekday) * 24 * 60 * 60 * 1000;
    var date = new Date(timestamp);
    var Y =date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var selectDate_2 = Y + '/' + M + '/' + D;
    console.log(date);
    var index = this.dateInlist(selectDate_2);
    if (index == -1){
      this.setData({
        addMessage: true,
        selectDate_2: selectDate_2
      });
    } else {
      if ((app.globalData.record[index].eat.length == 0) && (app.globalData.record[index].drink.length == 0) && (app.globalData.record[index].sport.length == 0)){
        this.setData({
          addMessage: true,
        });
      } else {
        this.setData({
          todayList: app.globalData.record[index],
          addMessage: false
        });
      }
    }
    this.setData({
      selectDate_2: selectDate_2
    });
  },
  
  // 工具函数
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
      isScaleModal: this.data.isScaleModal ? false : true,  
    });
  },

  toggleFloatButton: function() {
    this.setData({
      floatButton: this.data.floatButton ? false : true
    });
  },

  toggleBottomModal: function(){
    this.setData({
      isBottomModal: this.data.isBottomModal ? false : true
    });
  },

  cancelInputB: function() {
    this.toggleBottomModal();
    this.toggleFloatButton();
  },

  cancelInputS: function() {
    this.toggleScaleModal();
    this.toggleFloatButton();
  },

  dateInlist: function (date){
    var index = 0;
    for (; index < app.globalData.record.length; index++) {
      if (app.globalData.record[index].date == date) {
        break;
      }
    }
    if ((index == app.globalData.record.length) && (app.globalData.record[index - 1].date != date)){
      var record = {
        eat:[],
        drink:[],
        sport: [],
        weight:0,
        date: date
      };
      app.globalData.record.push(record);
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
    })
  }
});