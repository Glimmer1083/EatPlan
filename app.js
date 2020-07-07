  //app.js
import data from './data';
var that= this;
var timestamp = Date.parse(new Date());
var date = new Date(timestamp);
//获取年份
var Y =date.getFullYear();
//获取月份
var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
//获取当日日期
var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
var today = Y + '/' + M + '/' + D;
App({
  onLaunch: function () {
    //隐藏系统tabbar
    wx.hideTabBar();
    //获取设备信息
    this.getSystemInfo();

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });
    wx.setStorage({
      key: 'foodRecord',
      data: []
    });
  },
  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
      }
    });
  },
  editTabbar: function () {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;

    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);


    // if(pagePath.indexOf('/') != 0){
    //   pagePath = '/' + pagePath;
    // } 

    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  
  globalData: {
    systemInfo: null,//客户端设备信息
    userInfo: null,
    itemdata: data,
    tabBar: {
      "backgroundColor": "#f17c67",
      "color": "#979795",
      "selectedColor": "#1c1c1b",
      "list": [
        {
          "pagePath": "/pages/index/index",
          "iconPath": "icon/index.png",
          "selectedIconPath": "icon/index_s.png",
          "text": ""
        },
        {
          "pagePath": "/pages/food/food",
          "iconPath": "icon/food.png",
          "selectedIconPath": "icon/food_s.png",
          "text": ""
        },
        { 
          "pagePath": "/pages/middle/middle?date=" + today,
          "iconPath": "icon/icon_release.png",
          "isSpecial": true,
          "text": ""
        },
        {
          "pagePath": "/pages/plan/plan",
          "iconPath": "icon/plan.png",
          "selectedIconPath": "icon/plan_s.png",
          "text": ""
        },
        {
          "pagePath": "/pages/aboutme/aboutme",
          "iconPath": "icon/me.png",
          "selectedIconPath": "icon/me_s.png",
          "text": ""
        }
      ]
    },
    record: [
      {
        eat:[],
        drink:[],
        sport:[],
        weight:3,
        date: '2019/03/26'
      },
      {
        eat:[],
        drink:[],
        sport:[],
        weight:2,
        date: '2019/03/25'
      },
      {
        eat:[],
        drink:[],
        sport:[],
        weight:0,
        date: '2019/03/24'
      },
      {
        eat:[],
        drink:[],
        sport:[],
        weight:4,
        date: '2019/03/28'
      }],
    planList: [
      {
        goal: 0,
        date: '2019/03/26',
        subgoal: {
          eat: [],
          sport: [{
            itemName: 'dahkjdq',
            amount: 28910
          }],
          drink: [],
          weight: 0
        }
      }
    ],
    allplan: []
  }
});