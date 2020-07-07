// pages/add_food/add_food.js
const isTel = (value) => !/^1[34578]\d{9}$/.test(value);
const app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    type: 'food'
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      type: options.type
    });
  },
  
  submit: function (){
    var item = {};
    if (this.data.type == 'food'){  
      item.foodName = this.data.name;
      item.Calories = this.data.cal / this.data.amount * 100;
      app.globalData.itemdata.user_define_food.push(item);
    } else if (this.data.type == 'drink'){
      item.foodName = this.data.name;
      item.Calories = this.data.cal / this.data.amount * 100;
      app.globalData.itemdata.user_define_drink.push(item);
    } else if (this.data.type == 'sport'){
      item.sportName = this.data.name;
      item.Calories = this.data.cal / this.data.amount * 100;
      app.globalData.itemdata.user_define_sport.push(item);
    }
    console.log('push ok',app.globalData.itemdata);
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  onChange(e) {
    if (e.currentTarget.dataset.name == 'name'){
      this.setData({
        name: e.detail.value,
      });
    } else if (e.currentTarget.dataset.name == 'amount'){
      this.setData({
        amount: e.detail.value,
      });
    } else if (e.currentTarget.dataset.name == 'cal'){
      this.setData({
        cal: e.detail.value,
      });
    }
		console.log('onChange', e);
	},
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})