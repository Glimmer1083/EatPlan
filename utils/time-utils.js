/**
 * 获取该周的所要显示的周和日期的对应数据，数据结构如下
 * var weekDay = {week: '',day: ''}
 * 参数：selectWeek  0为本周，数字代表前几周或者后几周，例如1是下一周
 */
function getWeekDayList(selectWeek,date) {
  var selectWeekTime = getCurrentTimeStamp(date) + (selectWeek * 7) * 24 * 60 * 60 * 1000;
  console.log(selectWeekTime);
  var mondayTime = selectWeekTime - (getWeekNumber(selectWeekTime)) * 24 * 60 * 60 * 1000;
  var timeBean = {
    selectDay: 0,
    yearMonth: '',
    weekDayList: []
  };
  for (var i = 0; i < 7; i++) {
    var weekDay = {
      week: '',
      day: ''
    };
    weekDay.week = getWeek(mondayTime + i * 24 * 60 * 60 * 1000);
    weekDay.day = getMyDay(mondayTime + i * 24 * 60 * 60 * 1000);
    timeBean.weekDayList.push(weekDay);
  }

  timeBean.yearMonth = getYearMonth(selectWeekTime);
  timeBean.selectDay = getCurrenrWeek(date);
  return timeBean;
}

//获取时间戳  --
function getCurrentTimeStamp(res) {
  var timestamp = new Date(res).getTime();
  return timestamp;
}
  
//获取当前周几
function getCurrenrWeek(res) {
  var str = "0123456".charAt(new Date(res).getDay());
  return str;
}
  
//时间戳获得年月
function getYearMonth(res) {
  var time = new Date(res);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  return y + "年" + m + '月';
}
  
//时间戳转几号
function getMyDay(res) {
  var time = new Date(res);
  var d = time.getDate();
  return d;
}
  
//时间戳转周几 
function getWeek(res) {
  var time = new Date(res);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  return "日一二三四五六".charAt(new Date(y + '/' + m + '/' + d).getDay());
}
  
//时间戳转周几 0123456  --
function getWeekNumber(res) {
  var time = new Date(res);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  return "0123456".charAt(new Date(y + '/' + m + '/' + d).getDay());
}
  
module.exports = {  //把方法共享，让引用的地方可以调用
  getWeekDayList: getWeekDayList,
  getCurrenrWeek: getCurrenrWeek
}