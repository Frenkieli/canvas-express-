// canvas點擊事件,這邊要做大量判斷上下層連動等
canvas.addEventListener('click', function (e) {
  let removeIndex;
  // console.log(alert_clock, 'box');
  if (paint_mode) { }
  else {
    let box = database['areas'].filter(function (v, index) {
      // 刪除已經繪製區塊事件
      let check = false;
      let value = v.style;
      let clickX = e.offsetX;
      let clickY = e.offsetY;
      if (clickX > value.x && clickY > value.y && clickX < value.x + value.width && clickY < value.y + value.height) {
        removeIndex = index;
        check = true;
      }
      return check;
    })
    if (box[0]) {
      if (delete_mode) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (box.length != 0) {
          // console.log(database['areas'][removeIndex]);
          database['areas'][removeIndex].style = {};
          putAxios('areas', database['areas'][removeIndex], database['areas'][removeIndex].id);
          alert_event = [];
          document.getElementById('areas').innerHTML = '';
          database['areas'].forEach((value, index) => {
            if (value.style.x) {
              setTimeout(() => {
                drawCanvasArea(value.style);
              }, 10);
              alert_event[alert_event.length] = value;
            } else {
              areas(value);
            }
          });
        }
      }
      connectionDevice(box[0]);
      // console.log(box);
    }
  }
  let box = alert_clock.filter(function (value, index) {
    // 解除警報事件
    let check = false;
    let clickX = e.offsetX;
    let clickY = e.offsetY;
    if (clickX > value.x && clickY > value.y && clickX < value.x + value.width && clickY < value.y + value.height) {
      removeIndex = index;
      check = true;
    }
    return check;
  });
  // console.log(box, '警報事件', alert_clock, removeIndex);
  if (box.length != 0) {
    clearTimeout(box[0].time);
    context.clearRect(0, 0, canvas.width, canvas.height);
    alert_clock.splice(removeIndex, 1);
    database['areas'].forEach((value, index) => {
      if (value.style.x) {
        setTimeout(() => {
          drawCanvasArea(value.style);
        }, 10);
      }
    });
  }
  //==================================================================
})
//顯示設備功能
function appendDevices(arr, divid = 'eq_list') {
  let div = document.createElement('div');
  let p = document.createElement('p');
  let img = new Image();
  div.className = 'item';
  div.id = arr.id;
  div.draggable = true;
  div.style.left = arr.style.x;
  div.style.top = arr.style.y;
  if (arr.value == 1) {
    // console.log(arr.type.img);
    arr.type.img = arr.type.img.replace('close', 'open');
    // console.log(arr.type.img);
  }
  img.src = './images/' + arr.type.img;
  img.draggable = false;
  img.className = 'devices_img'
  // p.innerHTML=arr.title;
  div.appendChild(img);
  // value是用來對應該商品最主要功能的
  // div.appendChild(p);
  div.innerHTML += arr.title;
  div.addEventListener('click', function (e) {
    let id = e.target.parentNode.id;
    // console.log(id);
    let box = database['devices'].filter(function (value) {
      return value.id == id;
    });
    // console.log(box[0]);
    let devices_info = document.getElementById('devices_info');
    devices_info.style.left = e.pageX + 50 + "px";
    devices_info.style.top = e.pageY + "px";
    devices_info.style.display = "block";
    // 先settimeout讓他消失
    setTimeout(() => {
      devices_info.style.display = "none";
    }, 2000);
    devices_viewinfo(box[0]);
  })
  // document.getElementById('eq_list').append(div);
  document.getElementById(divid).append(div);
}

// 顯示連接設施

function connectionDevice(arr) {
  // console.log(arr, 'arr');
  let connection_area = document.getElementById('connection_area');
  let box = database['devices'].filter(function (value) {
    // console.log(arr.id, 'arr', value.connection, 'value.connection')
    return arr.id == value.connection.split('-')[0];
  })
  connection_area.innerHTML = '與 " ' + arr.name + ' " 連動的警報設備';
  box.forEach((value, i) => {
    let div = document.createElement('div');
    let img = new Image();
    img.src = './images/' + value.type.img;
    div.appendChild(img);
    div.innerHTML += value.title;
    connection_area.appendChild(div);
  })
}

//==================================================================
//上傳檔案儲存進伺服器
function getFileInfo(fileStr) {
  //回傳一個陣列，索引0放的是主檔名, 索引1放的是副檔名
  let dotPos = fileStr.lastIndexOf(".");
  let fileName = fileStr.substring(0, dotPos);
  let fileExt = fileStr.substr(dotPos + 1);
  let file = {
    name: fileName,
    ext: fileExt
  };
  return file;
}

// 把平面圖放上去的功能

document.getElementById('updata').addEventListener('change', function (e) {
  let fileAccepts = ["png", "jpg", "jpeg", "gif"];
  let fileInfo = getFileInfo(e.target.value);
  if (fileAccepts.indexOf(fileInfo.ext.toLowerCase()) == -1) {
    alert("檔案格式不對");
    e.target.value = "";
  } else {
    let pic = e.target.files[0];
    let readpic = new FileReader();
    readpic.readAsDataURL(pic);
    readpic.addEventListener("load", function (e) {
      // console.log(readpic,確認這是什麼);
      // let img = new Image();
      // img.src = e.target.result
      // img.onload = function (e) {
      //   // 破壞圖片比例後重畫到畫面上
      //   canvas.width = img.width;
      //   canvas.height = img.height;
      //   context.drawImage(img, 0, 0, img.width, img.height);
      // }
      // canvas.style.backgroundImage = `url(${e.target.result})`;
      darwCanvas(e.target.result);
      setTimeout(() => {
        let pre;
        // 確認要壓縮多少
        if (canvas.toDataURL('image/jpeg', 1).length < (131072 - 1024)) {
          pre = 0.8;
        } else if (canvas.toDataURL('image/jpeg', 0.8).length < (131072 - 1024)) {
          pre = 0.6;
        } else if (canvas.toDataURL('image/jpeg', 0.6).length < (131072 - 1024)) {
          pre = 0.5;
        } else if (canvas.toDataURL('image/jpeg', 0.4).length < (131072 - 1024)) {
          pre = 0.3;
        } else {
          pre = 0.1;
        }
        let data = {
          img: `${canvas.toDataURL('image/jpeg', pre)}`
        }
        putAxios('plan', data, '1');
      }, 0);
    })

  }
});
//==================================================================
// 編輯狀態確認
let paint_mode;
document.getElementById('paint_mode').addEventListener('click', function (e) {
  paint_mode = e.target.checked;
  // console.log(paint_mode, 'paint_mode');
})
// 編輯設備狀態確認
let eq_mode;
document.getElementById('eq_mode').addEventListener('click', function (e) {
  eq_mode = e.target.checked;
  // console.log(eq_mode, 'eq_mode');
})
// 刪除模式
let delete_mode;
document.getElementById('delete_mode').addEventListener('click', function (e) {
  delete_mode = e.target.checked;
  // console.log(delete_mode, 'delete_mode');
})

//==================================================================
// 新增地點
document.getElementById('addareas').addEventListener('click', async function (e) {
  let areaname = document.getElementById('areaname');
  let data = {
    name: areaname.value,
    style: {}
  }
  areaname.value = '';
  let res = await postAxios('areas', data);
  areas(res);
  // console.log(res);
});

//刪除已有地點

document.getElementById('deleteareas').addEventListener('click', function (e) {
  let areas = document.getElementById('areas');
  let id = areas.value;
  let index = areas.selectedIndex;
  areas.options[index].remove();
  deleteAxios('areas', id);
})

// 將地點放入selec功能

function areas(arr) {
  let areas = document.getElementById('areas');
  let optionitem = new Option(arr.name, arr.id);
  areas.appendChild(optionitem);
}
//==================================================================

// 繪製區域和樣式增加對應事件
canvas.addEventListener('mousedown', function (e) {
  if (paint_mode) {
    mousedownx = e.offsetX;
    mousedowny = e.offsetY;
    // console.log(context.isPointInPath(e.offsetX, e.offsetY), 'context.isPointInPath');
  }
})
// 控制canvas形狀和存成什麼資料
canvas.addEventListener('mouseup', function (e) {
  if (paint_mode) {
    let areas = document.getElementById('areas');
    // 取用屬性
    let areasID = areas.value;
    if (!areasID) return;
    // 沒東西就直接跳出
    let index = areas.selectedIndex;
    text = areas.options[index].text;
    let textfontsize = document.getElementById('textfont').value;
    let textcolor = document.getElementById('textcolor').value;
    let bordercolor = document.getElementById('bordercolor').value;
    // 使用屬性
    let startx, starty, endx, endy;
    if (mousedownx > e.offsetX) {
      startx = e.offsetX;
      endx = mousedownx - e.offsetX;
    } else {
      startx = mousedownx;
      endx = e.offsetX - mousedownx;
    }
    if (mousedowny > e.offsetY) {
      starty = e.offsetY;
      endy = mousedowny - e.offsetY;
    } else {
      starty = mousedowny;
      endy = e.offsetY - mousedowny;
    }
    // 畫圖開始
    // context.strokeStyle = bordercolor;
    // // context.fillStyle = color;
    // context.beginPath();
    // context.rect(startx, starty, endx, endy);
    // // context.fill();
    // context.stroke();
    // context.closePath();
    // context.textAlign = "center";
    // context.textBaseline = 'middle';
    // context.font = textfontsize + "px Arial";
    // context.fillStyle = textcolor;
    // context.fillText(text, startx + (endx / 2), starty + (endy / 2), endx);

    alert_event[alert_event.length] = {
      x: startx,
      y: starty,
      width: endx,
      height: endy,
      bordercolor: bordercolor,
      text: text,
      textfontsize: textfontsize,
      textcolor: textcolor,
      areasID: areasID
    }
    drawCanvasArea(alert_event[alert_event.length - 1]);
    areas.options[index].remove();
    let data = {
      id: areasID,
      name: text,
      style: alert_event[alert_event.length - 1]
    }
    alert_event[alert_event.length - 1] = data;
    putAxios('areas', data, areasID);
  }
})

//==================================================================

// 警報事件

function alert_check(arr) {
  // console.log(arr,'alert_check');
  let box = database['areas'].filter(function (value) {
    return arr.connection.split('-')[0] == value.id
  })
  // console.log(box);
  if (box[0]) alert_center(box[0].style);
}

function alert_center(alert) {
  let obj = {};
  obj.x = alert.x;
  obj.y = alert.y;
  obj.width = alert.width;
  obj.height = alert.height;
  obj.id = alert.areasID;
  alert_clock[alert.areasID] = obj;
  alertcanvas(alert, alert_clock[alert.areasID]);
}

function alertcanvas(alertarea, obj) {
  drawCanvasArea(alertarea, '#f00')
  obj.time = setTimeout(() => {
    drawCanvasArea(alertarea, '#aaa')
    obj.time = setTimeout(() => {
      alertcanvas(alertarea, obj);
    }, 500);
  }, 500);
  // console.log(obj);
}

//==================================================================
//凡發生狀態更改就來這邊刷上畫面
// 設備狀態變更就來這邊
function devicesStateModify(arr) {
  // console.log(arr);
  let img = document.querySelector("#" + arr.id + " .devices_img");
  if (arr.value == 1) {
    img.src = img.src.replace('close', 'open');
  } else {
    img.src = img.src.replace('open', 'close');
  }
  if (arr.value == 1) {
    alert_check(arr);
  } else {
    closeAlert(arr);
  }
}

function closeAlert(arr) {
  // console.log(arr, 'closeAlert');
  // console.log(alert_clock, 'alert_clock');
  let removeIndex;
  let box = alert_clock.filter(function (value, index) {
    if (value.id == arr.connection.split('-')[0]) {
      removeIndex = index;
      return true
    }
  })
  if (box.length != 0) {
    clearTimeout(box[0].time);
    context.clearRect(0, 0, canvas.width, canvas.height);
    alert_clock.splice(removeIndex, 1);
    database['areas'].forEach((value, index) => {
      if (value.style.x) {
        setTimeout(() => {
          drawCanvasArea(value.style);
        }, 10);
      }
    });
  }
}

//==================================================================
// 拖曳事件開始
// document.getElementById('eq_list').addEventListener('dragstart',dragstart);
// function dragstart(e){
//   console.log('dragStart');
//   e.dataTransfer.setData('text/plain', e.target.id);
// }
// Allow multiple draggable items
// let dragSources = document.querySelectorAll('[draggable="true"]')
// dragSources.forEach(dragSource => {
//   dragSource.addEventListener('dragstart', dragStart)
// })
// let dragSources = document.getElementById('eq_list');
// dragSources.addEventListener('dragstart',dragStart);
// let dropTarget = document.getElementById('canvas_top');
// dropTarget.addEventListener('drop', dropped)
// dropTarget.addEventListener('dragenter', cancelDefault)
// dropTarget.addEventListener('dragover', cancelDefault)
// function dropped (e) {
//   console.log('dropped')
//   cancelDefault(e)
//   let id = e.dataTransfer.getData('text/plain')
//   console.log(id);
//   document.querySelector('#' + id).style.top= e.offsetY + 'px';
//   document.querySelector('#' + id).style.left= e.offsetX + 'px';
//   e.target.parentNode.appendChild(document.querySelector('#' + id))
//   console.log(e,'e.target');
// }
// function cancelDefault (e) {
//   e.preventDefault()
//   e.stopPropagation()
//   return false
// }

// Allow multiple dropped targets

//利用事件漫延讓物件可以拖曳
let dropTargets = document.querySelectorAll('[data-role="drag-drop-container"]')
dropTargets.forEach(dropTarget => {
  dropTarget.addEventListener('dragstart', dragStart);
  dropTarget.addEventListener('drop', dropped)
  dropTarget.addEventListener('dragenter', cancelDefault)
  dropTarget.addEventListener('dragover', cancelDefault)
})

function dragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.id);
}

function dropped(e) {
  cancelDefault(e)
  let id = e.dataTransfer.getData('text/plain');
  if (e.target.parentNode.id == 'canvas_top') {
    document.querySelector('#' + id).style.top = e.offsetY - 20 + 'px';
    document.querySelector('#' + id).style.left = e.offsetX - 20 + 'px';
    e.target.parentNode.appendChild(document.querySelector('#' + id));
    let data = {
      style: {
        x: e.offsetX - 20 + 'px',
        y: e.offsetY - 20 + 'px'
      }
    }
    patchAxios("devices", data, id);
  } else if (e.target.parentNode.id == 'eq_list') {
    // console.log('進入')
    e.target.parentNode.appendChild(document.querySelector('#' + id));
    let data = {
      style: {}
    }
    patchAxios("devices", data, id);
  }
  // console.log(e,'e.target');
}

function cancelDefault(e) {
  e.preventDefault()
  e.stopPropagation()
  return false
}