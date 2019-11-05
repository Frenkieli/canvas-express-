// 繪圖事件
function drawCanvasArea(obj, fill = "rgba(0, 0, 0, 0.5)") {
  // console.log(obj);
  context.strokeStyle = obj.bordercolor;
  context.beginPath();
  context.rect(obj.x, obj.y, obj.width, obj.height);
  // if (fill) {
  context.fillStyle = fill;
  context.fill();
  // }
  context.stroke();
  context.closePath();
  context.textAlign = "center";
  context.textBaseline = 'middle';
  context.font = obj.textfontsize + "px Arial";
  context.fillStyle = obj.textcolor;
  context.fillText(obj.text, obj.x + (obj.width / 2), obj.y + (obj.height / 2), obj.width);
  context.closePath();
}

// 繪出平面圖功能
function darwCanvas(src) {
  let img = new Image();
  img.src = src;
  img.onload = function (e) {
    // 破壞圖片比例後重畫到畫面上
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0, img.width, img.height);
  }
  canvas.style.backgroundImage = `url(${src})`;
}

// 點選設備後顯示設備訊息
// 可控制類的先清空controller內的物件再刷新
// 顯示類型的先清空view再重刷訊息
function devices_viewinfo(arr) {
  let devices_info = document.getElementById('devices_info');
  let devices_info_controller = document.getElementById('devices_info_controller');
  let devices_info_view = document.getElementById('devices_info_view');
  let devices_info_select = document.getElementById('devices_info_select');
  devices_info_select.innerHTML = '';
  document.getElementById('devices_info_title').innerHTML = arr.title;
  // console.log(arr, 'arr');
  devices_info_controller.innerHTML = '';
  for (let key in arr.type) {
    // console.log(key, arr.type[key]);
    info_controller(key, arr.type[key], arr.value, arr.id, devices_info_controller, devices_info_view);
  }
  // 選擇連動地點
  let select = document.createElement('select');
  let option = new Option('不連動警報', '');
  select.appendChild(option);
  database['areas'].forEach((value, index) => {
    let option = new Option(value.name, value.id + '-' + value.name);
    select.appendChild(option);
  })
  select.value = arr.connection;
  select.addEventListener('change', function (e) {
    let data = {
      connection:select.value
    }
    patchAxios('devices', data, arr.id);
  });
  devices_info_select.appendChild(select);
}

// 這邊是先將所有可能用到的按功能放進來後在由資料判斷
function info_controller(key, type, value, id, controller, view) {
  // let controller = document.getElementById('controller_controller')
  // 這個是開關之類,會在改
  switch (type) {
    case "switch":
      let input = document.createElement('input');
      input.type = "checkbox";
      if (value == 1) {
        input.checked = true;
      }
      input.addEventListener('click', function (e) {
        data = {
          value: e.target.checked ? 1 : 0
        }
        patchAxios("devices", data, id);
      })
      controller.appendChild(input);
      break;
    default:
      break;
  }
}

// window.addEventListener('load', function () {
//   devices_info_controller();
// })