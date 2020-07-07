//index.js
const app = getApp();
var util = require("../../utils/time-utils.js");
var wxCharts = require('../../utils/wxcharts.js');
var windWidth = wx.getSystemInfoSync().windowWidth;
var areaChart = null;
Page({
  data: {
    tabbar: {},
    openPicker: false,
    needAnimation : false,
    todayList: [],
    contentHeight: 0,
    today: "",
    ringWidth: windWidth * 0.5,
    canvasWidth: windWidth * 0.5,
    currentPage: 1,
    addMessage: false,
    title: "还能吃",
    suffix: "Kcal",
    valueColor: '#fff',
    value: 9,
    isMarginTop: true,
    value1: ['1'],
    value2: ['1'],
    value3: ['1'],
    value4: ['1'],
    goalcal: 100
  },

  onLoad: function () {
    app.editTabbar();
    var that= this;
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var today = Y + '年' + M + '月' + D + '日';
    var str = 'tabbar.list[2].pagePath';
    var selectDate = Y + '/' + M + '/' + D;
    this.setData({
      today: today,
      [str]: '/pages/middle/middle?date=' + selectDate,
      selectDate: selectDate
    });
    this.getallData(selectDate);
    
    if (this.data.todayList == -1 || this.data.todayGoal == -1){
      // this.showCanvasRing(this.data.goalcal, this.data.value);
    } else {
      var amount = this.getTodayleft(this.data.todayList, this.data.todayGoal);
      this.setData({
        goalcal: amount.amount_g,
        value: amount.amount_r
      });
      this.showCanvasRing(this.data.goalcal, this.data.value);
    }
    this.getallData(selectDate);
    this.drawgraph();
  },

  onReady: function(){
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
            contentHeight: (res.windowHeight - 64 * res.screenWidth / 750)
        });
      }
    });
  },

  onShow: function(){
    var that= this;
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var today = Y + '年' + M + '月' + D + '日';
    var str = 'tabbar.list[2].pagePath';
    var selectDate = Y + '/' + M + '/' + D;
    this.setData({
      today: today,
      [str]: '/pages/middle/middle?date=' + selectDate,
      selectDate: selectDate
    });
    this.getallData(selectDate);
    if (this.data.todayList == -1 || this.data.todayGoal == -1){
      this.showCanvasRing(this.data.goalcal, this.data.value);
    } else {
      var amount = this.getTodayleft(this.data.todayList, this.data.todayGoal);
      this.setData({
        goalcal: amount.amount_g,
        value: amount.amount_r
      });
      this.showCanvasRing(amount.amount_g, amount.amount_r);
    }
  },
  
  dayClick: function(e){
    var that = this;
    var str = 'tabbar.list[2].pagePath';
    var Y = e.detail.year;
    var M = e.detail.month < 10 ? '0' + (e.detail.month) : e.detail.month;
    var D = e.detail.day < 10 ? '0' + e.detail.day : e.detail.day;
    var today = Y + '年' + M + '月' + D + '日';
    var selectDate = Y + '/' + M + '/' + D;
    this.onPickHeaderClick();
    this.setData({
      today: today,
      [str]: '/pages/middle/middle?date=' + selectDate,
    });
    this.getallData(selectDate);
    this.drawgraph();
  },

  // 工具函数

  getRecord: function(date){
    var index = this.dateInlist(date);
    if (index == -1){
      return -1;
    } else {
      if ((app.globalData.record[index].eat.length == 0) && (app.globalData.record[index].drink.length == 0) && (app.globalData.record[index].sport.length == 0)){
        return -1;
      } else {
        return app.globalData.record[index];
      }
    }
  },

  getusedplanGoal: function(date){
    var index = 0;
    for (; index < app.globalData.allplan.length; index++) {
      if (app.globalData.allplan[index].used){
        break;    
      }
    }
    if (app.globalData.allplan.length == 0){
      return -1;
    } else if ((index == app.globalData.allplan.length) && (!app.globalData.allplan[index - 1].used)){
      return -1;
    } else {
      var plan = app.globalData.allplan[index].planList;
      var goalIndex = this.dateInPlanlist(plan, date);
      if (goalIndex == -1){
        return -1;
      } else {  
        if ((app.globalData.allplan[index].planList[goalIndex].subgoal.eat.length == 0) && (app.globalData.allplan[index].planList[goalIndex].subgoal.sport.length == 0)){
          return -1;
        } else {
          return app.globalData.allplan[index].planList[goalIndex];
        }
      }
    }
  },

  getallData: function(date){
    var record = this.getRecord(date);
    var goal = this.getusedplanGoal(date);
    this.setData({
      addMessage: false,
      todayList: record,
      todayGoal: goal
    });
  },

  getTodayleft: function(todayList,todayGoal){
    var amount_r = 0;
    if (todayList != -1){
      for (let index = 0; index < todayList.eat.length; index++) {
        amount_r = amount_r + todayList.eat[index].calories / 100 * todayList.eat[index].amount;
      }
      for (let index = 0; index < todayList.drink.length; index++) {
        amount_r = amount_r + todayList.drink[index].calories / 100 * todayList.drink[index].amount;
      }
      for (let index = 0; index < todayList.sport.length; index++) {
        amount_r = amount_r - todayList.sport[index].calories / 30 * todayList.sport[index].amount;
      }
      if(amount_r < 0){
        amount_r = 0;
      }
    } else {
      amount_r = 0;
    }
    var amount_g = 0;
    if (todayGoal != -1){  
      for (let index = 0; index < todayGoal.subgoal.eat.length; index++) {
        amount_g = amount_g + todayGoal.subgoal.eat[index].calories / 100 * todayGoal.subgoal.eat[index].amount;
      }
      for (let index = 0; index < todayGoal.subgoal.drink.length; index++) {
        amount_g = amount_g + todayGoal.subgoal.drink[index].calories / 100 * todayGoal.subgoal.drink[index].amount;
      }
      for (let index = 0; index < todayGoal.subgoal.sport.length; index++) {
        amount_g = amount_g - todayGoal.subgoal.sport[index].calories / 30 * todayGoal.subgoal.sport[index].amount;
      }
      if(amount_g < 0){
        amount_g = 0;
      }
    } else {
      amount_g = 0;
    }
    return {
      amount_r: amount_r,
      amount_g: amount_g
    };
  },

  drawgraph: function(){
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    // 获取数据
    var that = this;
    var record = app.globalData.record.sort(that.compare("date"));
    this.setData({
      record : app.globalData.record
    });
    var dateList = [];
    var weightList = [];
    for (let index = 0; index < record.length; index++) {
      dateList.push(record[index].date);
      weightList.push(record[index].weight);
    }
    // 画图像
    areaChart = new wxCharts({
      canvasId: 'areaCanvas',
      type: 'area',
      categories: dateList,
      animation: true,
      series: [{
          name: '体重',
          data: weightList
      }],
      yAxis: {
          title: '体重 (公斤)',
          format: function (val) {
            return val.toFixed(2);
          },
          min: 0,
          fontColor: '#A39F93',
          gridColor: '#F17C67',
          titleFontColor: '#000000'
      },
      xAxis: {
          fontColor: '#A39F93',
          gridColor: '#F17C67'
      },
      extra: {
          legendTextColor: '#000000'
      },
      width: windowWidth,
      height: 180
    });
  },

  compare:function (property) {
    return function (a, b) {
      var value1 = new Date(a[property]).getTime();
      var value2 = new Date(b[property]).getTime();
      return value1 - value2;
    };
  },

  showCanvasRing: function(maxValue, value) {
    var lineWidth = 10;
    var lineColor = "#A39F93";
    // var maxValue = 100;
    var minValue = 0;
    var startDegree = 0;
    if (this.data.title.replace(/(^\s*)|(\s*$)/g, "").length == 0) {
      this.setData({
        isMarginTop: false
      });
    }
    //作画
    var ctx = wx.createCanvasContext("circleBar");
    var circle_r = this.data.ringWidth / 2; //画布的一半，用来找中心点和半径
    var percent = 360 * ((value - minValue) / (maxValue - minValue)); //计算结果
    //定义起始点
    ctx.translate(circle_r, circle_r);
    //灰色圆弧
    ctx.beginPath();
    ctx.setStrokeStyle("#ffffff");
    ctx.setLineWidth(lineWidth);
    ctx.arc(0, 0, circle_r - 10, 0, 2 * Math.PI, true);
    ctx.stroke();
    ctx.closePath();
    //有色彩的圆弧
    ctx.beginPath();
    ctx.setStrokeStyle(lineColor);
    ctx.setLineWidth(lineWidth);
    ctx.arc(0, 0, circle_r - 10, startDegree * Math.PI / 180 - 0.5 * Math.PI, percent * Math.PI / 180 + startDegree * Math.PI / 180 - 0.5 * Math.PI, false);
    ctx.stroke();
    ctx.closePath();
    //说明
    ctx.setFontSize(15);
    ctx.setFillStyle('#ffffff');
    ctx.fillText('还能吃', circle_r - 115, circle_r - 120);
    ctx.setFontSize(30);
    ctx.fillText(value + 'Kcal', circle_r - 135, circle_r - 70);
    var that = this;
    ctx.draw(false, function (e) {      
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: that.data.canvasWidth,
        height: that.data.canvasHeight,
        canvasId: 'circleBar',
        success: function(res) {
          console.log('draw callback');
          that.setData({
            ringImg: res.tempFilePath,
          });
        },
        fail: function(res) {
          console.log(res)
        }
      });
    });
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
        weight:[],
        date: date
      };
      app.globalData.record.push(record);
      return -1;
    } else {
      return index;
    }
  },

  dateInPlanlist: function (planList, date){
    var index = 0;
    for (; index < planList.length; index++) {
      if (planList[index].date == date) {
        break;
      }
    }
    if ((index == planList.length) && (planList[index - 1].date != date)){
      return -1;
    } else {
      return index;
    }
  },

  touchHandler: function (e) {
    console.log(areaChart.getCurrentDataIndex(e)); 
    areaChart.showToolTip(e);
  },

  onPickHeaderClick: function () {
    this.setData({
        openPicker: !this.data.openPicker,
        needAnimation: true
    });
  },
  
  changeTo1:function(){
    this.setData({
      currentPage: 0
    });
  },
  
  changeTo2:function(){
    this.setData({
      currentPage: 1
    });
  },
  
  changeTo3:function(){
    this.setData({
      currentPage: 2
    });
  },

  onChange: function(field, e) {
    const { value } = e.detail;
    const data = this.data[field];
    const index = data.indexOf(value);
    const current = index === -1 ? [...data, value] : data.filter((n) => n !== value);
    this.setData({
        [field]: current,
    })
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
  },

  onChangeSport: function(e) {
    this.onChange('value1', e);
  },
});