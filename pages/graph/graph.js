var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var areaChart = null;
Page({
  data: {
  
  },
  
  touchHandler: function (e) {
    console.log(areaChart.getCurrentDataIndex(e));
    areaChart.showToolTip(e);
  },    

  onLoad: function (e) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var that = this;
    var record = app.globalData.record.sort(that.compare("date"));
    this.setData({
      record : app.globalData.record
    });
    var dateList = [];
    var weightList = [];
    for (let index = 0; index < record.length; index++) {
      dateList.push(record[index].date);
      console.log(dateList);
      weightList.push(record[index].weight);
    }

    areaChart = new wxCharts({
      canvasId: 'areaCanvas',
      type: 'area',
      categories: dateList,
      animation: true,
      series: [{
          name: '体重',
          data: weightList,
          format: function (val) {
              return val.toFixed(2) + 'kg';
          }
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
      height: 250
    });
  },

//json数组比较

  compare:function (property) {
    return function (a, b) {
      var value1 = new Date(a[property]).getTime();
      var value2 = new Date(b[property]).getTime();
      return value1 - value2;
    };
  },

});