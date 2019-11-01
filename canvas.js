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

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let click_event = [];
let alert_event = [];



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


// 把設計草圖放上去的功能
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
      let img = new Image();
      img.src = e.target.result
      img.onload = function (e) {
        // 破壞圖片比例後重畫到畫面上
        canvas.width = img.width;
        canvas.height = img.height;

        context.drawImage(img, 0, 0, img.width, img.height);
      }
      canvas.style.backgroundImage = `url(${e.target.result})`;
    })
  }
});


// 繪製圖形和樣式增加對應事件
let mousedownx, mousedowny;
canvas.addEventListener('mousedown', function (e) {
  if (paint_mode) {

    mousedownx = e.offsetX;
    mousedowny = e.offsetY;
    console.log(context.isPointInPath(e.offsetX, e.offsetY), 'context.isPointInPath');
  }
})
// 畫形狀
canvas.addEventListener('mouseup', function (e) {
  if (paint_mode) {

    let text = document.getElementById('text').value;
    let textfontsize = document.getElementById('textfont').value;
    let textcolor = document.getElementById('textcolor').value;
    let bordercolor = document.getElementById('bordercolor').value;
    let color = document.getElementById('color').value;
    let identification = document.getElementById('identification').value;
    context.strokeStyle = bordercolor;
    // context.fillStyle = color;
    context.beginPath();
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
    context.rect(startx, starty, endx, endy);
    // context.fill();
    context.stroke();
    context.closePath();
    context.textAlign = "center";
    context.textBaseline = 'middle';
    context.font = textfontsize + "px Arial";
    context.fillStyle = textcolor;
    context.fillText(text, startx + (endx / 2), starty + (endy / 2), endx);
    alert_event[alert_event.length] = {
      x: startx,
      y: starty,
      width: endx,
      height: endy,
      alertcolor: color,
      bordercolor: bordercolor,
      text: text,
      textfontsize: textfontsize,
      textcolor: textcolor,
      identification: identification
    }
  }
})


// 給測試按鈕事件

let alertbutton = document.getElementsByClassName('alert');
for (let i = 0; i < alertbutton.length; i += 1) {
  alertbutton[i].addEventListener('click', alertbuttonevent);
}
function alertbuttonevent(e) {
  console.log(e.target.parentNode.id);
  let alertarea = alert_event.filter(function (arr) {
    return arr.identification == e.target.parentNode.id;
  })
  if (alertarea[0]) {
    alertcanvas(alertarea[0]);
  }
}
function alertcanvas(alertarea) {
  context.beginPath();
  context.rect(alertarea.x, alertarea.y, alertarea.width, alertarea.height);
  context.fillStyle = '#f00';
  context.fill();
  context.strokeStyle = alertarea.bordercolor;
  context.stroke();
  context.textAlign = "center";
  context.textBaseline = 'middle';
  context.font = alertarea.textfontsize + "px Arial";
  context.fillStyle = alertarea.textcolor;
  context.fillText(alertarea.text, alertarea.x + (alertarea.width / 2), alertarea.y + (alertarea.height / 2), alertarea.width);
  context.closePath();
  setTimeout(() => {
    context.beginPath();
    context.rect(alertarea.x, alertarea.y, alertarea.width, alertarea.height);
    context.fillStyle = alertarea.alertcolor;
    context.fill();
    context.strokeStyle = alertarea.bordercolor;
    context.stroke();
    context.textAlign = "center";
    context.textBaseline = 'middle';
    context.font = alertarea.textfontsize + "px Arial";
    context.fillStyle = alertarea.textcolor;
    context.fillText(alertarea.text, alertarea.x + (alertarea.width / 2), alertarea.y + (alertarea.height / 2), alertarea.width);
    context.closePath();
    setTimeout(() => {
      alertcanvas(alertarea);
    }, 500);
  }, 500);
}
function canvasDraw(obj) {

}

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
  } else {
    e.target.appendChild(document.querySelector('#' + id));
  }
  // console.log(e,'e.target');
}

function cancelDefault(e) {
  e.preventDefault()
  e.stopPropagation()
  return false
}