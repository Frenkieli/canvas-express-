// 給測試按鈕事件

// let alertbutton = document.getElementsByClassName('alert');
// for (let i = 0; i < alertbutton.length; i += 1) {
//   alertbutton[i].addEventListener('click', alertbuttonevent);
// }
// function alertbuttonevent(e) {
//   console.log(e.target.parentNode.id, alert_event);
//   let alertarea = alert_event.filter(function (arr) {
//     // console.log(arr, 'arr');
//     return arr.id == e.target.parentNode.id;
//   })
//   if (alertarea[0]) {
//     alert_center(alertarea[0].style);
//   }
// }

document.getElementById('test_door').addEventListener('click',function(e){
  let data={
    value: true
  }
  patchAxios('devices',data,'IQgEIQgEIQgEIQ');
})
document.getElementById('test_door_close').addEventListener('click',function(e){
  let data={
    value: false
  }
  patchAxios('devices',data,'IQgEIQgEIQgEIQ');
})
document.getElementById('test_light').addEventListener('click',function(e){
  let data={
    value: true
  }
  patchAxios('devices',data,'ZPNS01T09PT09P');
})
document.getElementById('test_light_close').addEventListener('click',function(e){
  let data={
    value: false
  }
  patchAxios('devices',data,'ZPNS01T09PT09P');
})
document.getElementById('test_windows').addEventListener('click',function(e){
  let data={
    value: true
  }
  patchAxios('devices',data,'TnnJqLkG4HBzqW');
})
document.getElementById('test_windows_close').addEventListener('click',function(e){
  let data={
    value: false
  }
  patchAxios('devices',data,'TnnJqLkG4HBzqW');
})
