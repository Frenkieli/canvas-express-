// canvas點擊事件,這邊要做大量判斷上下層連動等
canvas.addEventListener('click', function (e) {
  let removeIndex;
  console.log(alert_clock, 'box');
  if (paint_mode) { }
  else if (delete_mode) {
    let box = database['areas'].filter(function (v, index) {
      // 刪除已經繪製區塊事件
      let check = false;
      let value = v.style;
      let clickX = e.offsetX;
      let clickY = e.offsetY;
      if (clickX > value.x && clickY > value.y && clickX < value.x + value.width && clickY < value.y + value.height) {
        removeIndex = index;
        check = true;
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
      return check;
    })
    if (box.length != 0) {
      console.log(database['areas'][removeIndex]);
      database['areas'][removeIndex].style = {};
      putAxios('areas', database['areas'][removeIndex], database['areas'][removeIndex].id);
      alert_event = [];
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
    console.log(box);
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
  console.log(box);
  if (box.length != 0) {
    clearTimeout(box[0].time);
    alert_clock.splice(removeIndex, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
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

function appendDevices(arr) {
  let div = document.createElement('div');
  let p =document.createElement('p');
  let img = new Image();
  div.className = 'item';
  div.id = arr.id;
  div.draggable = true;
  img.src = './images/' + arr.img;
  img.draggable = false;
  p.innerHTML=arr.title;
  div.appendChild(img);
  div.appendChild(p);
  document.getElementById('eq_list').append(div);
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
    })

  }
});
//==================================================================
// 編輯狀態確認
let paint_mode;
document.getElementById('paint_mode').addEventListener('click', function (e) {
  paint_mode = e.target.checked;
  console.log(paint_mode, 'paint_mode');
})
// 編輯設備狀態確認
let eq_mode;
document.getElementById('eq_mode').addEventListener('click', function (e) {
  eq_mode = e.target.checked;
  console.log(eq_mode, 'eq_mode');
})
// 刪除模式
let delete_mode;
document.getElementById('delete_mode').addEventListener('click', function (e) {
  delete_mode = e.target.checked;
  console.log(delete_mode, 'delete_mode');
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
  console.log(res);
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
    console.log(context.isPointInPath(e.offsetX, e.offsetY), 'context.isPointInPath');
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
// 給測試按鈕事件

let alertbutton = document.getElementsByClassName('alert');
for (let i = 0; i < alertbutton.length; i += 1) {
  alertbutton[i].addEventListener('click', alertbuttonevent);
}
function alertbuttonevent(e) {
  console.log(e.target.parentNode.id, alert_event);
  let alertarea = alert_event.filter(function (arr) {
    // console.log(arr, 'arr');
    return arr.id == e.target.parentNode.id;
  })
  if (alertarea[0]) {
    alert_center(alertarea[0].style);
  }
}
// 警報事件

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
    drawCanvasArea(alertarea, '#fff')
    obj.time = setTimeout(() => {
      alertcanvas(alertarea, obj);
    }, 500);
  }, 500);
  // console.log(obj);
}

//==================================================================

// 拖曳事件開始

// document.getElementById('eq_list').addEventListener('dragstart',dragstart);

// function dragstart(e){
//   console.log('dragStart');
//   e.dataTransfer.setData('text/plain', e.target.id);
// }


// Allow multiple draggable items
let dragSources = document.querySelectorAll('[draggable="true"]')
dragSources.forEach(dragSource => {
  dragSource.addEventListener('dragstart', dragStart)
})

function dragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.id);
}

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
let dropTargets = document.querySelectorAll('[data-role="drag-drop-container"]')
dropTargets.forEach(dropTarget => {
  dropTarget.addEventListener('drop', dropped)
  dropTarget.addEventListener('dragenter', cancelDefault)
  dropTarget.addEventListener('dragover', cancelDefault)
})

function dropped(e) {
  console.log('dropped')
  cancelDefault(e)
  let id = e.dataTransfer.getData('text/plain')
  // console.log(id);

  if (e.target.parentNode.id == 'canvas_top') {
    document.querySelector('#' + id).style.top = e.offsetY - 20 + 'px';
    document.querySelector('#' + id).style.left = e.offsetX - 20 + 'px';
    e.target.parentNode.appendChild(document.querySelector('#' + id));
  }
  // console.log(e,'e.target');
}

function cancelDefault(e) {
  e.preventDefault()
  e.stopPropagation()
  return false
}