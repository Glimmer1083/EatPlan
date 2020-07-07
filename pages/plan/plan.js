const app = getApp();
import { $wuxActionSheet } from '../../dist/index'
import { $wuxDialog } from '../../dist/index'
Page({
    data: {
        tabbar: {},
        planList: []
    },
    onLoad:function(options){
        // 生命周期函数--监听页面加载
        app.editTabbar();
        console.log(app.globalData.planList);
        this.setData({
            allplan: app.globalData.allplan
        });
    },
    prompt: function() {
        var that = this;
        const alert = (content) => {
            $wuxDialog('#wux-dialog--alert').alert({
                resetOnClose: true,
                title: '提示',
                content: content,
            });
        };

        $wuxDialog().prompt({
            resetOnClose: true,
            title: '请输入您的计划名称',
            content: '最长8个字',
            defaultText: '',
            placeholder: '请输入计划名称',
            maxlength: 16,
            onConfirm(e, response) {
                var plan = {
                    name: response,
                    planList: [{
                        date: '',
                        goal: 0,
                        weight: 0,
                        subgoal: []
                    }],
                    used: false
                };
                app.globalData.allplan.push(plan);
                console.log(app.globalData.allplan);
                that.setData({
                    allplan: app.globalData.allplan
                });
                wx.navigateTo({
                    url: '../../pages/add_plan/add_plan?planName=' + response,
                });
            },
        });
    },

    use_plan: function(plan_name){
        for (let index = 0; index < app.globalData.allplan.length; index++) {
            if(app.globalData.allplan[index].name == plan_name){
                app.globalData.allplan[index].used = true;
                console.log('启用成功');
            } else {
                app.globalData.allplan[index].used = false;
            }
        }
        this.setData({
            allplan: app.globalData.allplan
        });
    },

    delete_plan: function(plan_name){
        for (let index = app.globalData.allplan.length - 1; index >=0 ; index--) {  
            if (app.globalData.allplan[index].name === plan_name){
              app.globalData.allplan.splice(index,1);
              console.log('删除成功');
            }
          } 
        this.setData({
            allplan: app.globalData.allplan
        });
    },
    bindTouchStart: function(e) {
        this.startTime = e.timeStamp;
    },
    bindTouchEnd: function(e) {
        this.endTime = e.timeStamp;
    },

    bindTap: function(e){
        if(this.endTime - this.startTime < 350){
            var plan_name = e.currentTarget.dataset.name;
            wx.navigateTo({
                url: '../plan_detail/plan_detail?plan_name=' + plan_name,
                success: function(res){
                    // success
                },
                fail: function() {
                    // fail
                },
                complete: function() {
                    // complete
                }
            });
        }
    },
    bindLongTap: function(e) {
        console.log(e);
        var that = this;
        var plan_name = e.currentTarget.dataset.name;
        const hideSheet = $wuxActionSheet().showSheet({
            theme: 'wx',
            titleText: '请选择您要进行的操作',
            buttons: [{
                    text: '启用计划'
                },
                {
                    text: '删除计划'
                },
            ],
            buttonClicked(index, item) {
                index === 0 && that.use_plan(plan_name)

                index === 1 && that.delete_plan(plan_name)
                return true;
            },
        })
    },
})