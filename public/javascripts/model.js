// 伺服器參數
const baseURL = "http://localhost:3000/";

// 獲取伺服器資料

let database = {};
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let alert_event = [];
let alert_clock = [];

// 全域用
let mousedownx, mousedowny;


// 開場獲取資料
async function dataAxios(cmd, id = '') {
  await axios.get(baseURL + cmd + '/' + id).then(res => {
    return res.data;
  }).then(res => {
    // console.log(cmd, res, 'dataAxios');
    database[cmd] = res;
  }).catch(err => {
    console.log(err);
  })
  return true;
}
// 查
async function getAxios(cmd, id = '') {
  let returnres;
  await axios.get(baseURL + cmd + '/' + id).then(res => {
    return res.data;
  }).then(res => {
    console.log(cmd, res, 'getAxios');
    returnres = res;
  }).catch(err => {
    console.log(err);
  })
  return returnres;
}
// 增
async function postAxios(cmd, data, id = '') {
  let returnres;
  await axios.post(baseURL + cmd + '/' + id, data).then(res => {
    return res.data;
  }).then(res => {
    console.log(cmd, res, 'postAxios');
    returnres = res;
    database[cmd].push(res);
    console.log(database[cmd]);
  }).catch(err => {
    console.log(err);
  })
  return returnres;
}
// 全改
async function putAxios(cmd, data, id = '') {
  let returnres;
  await axios.put(baseURL + cmd + '/' + id, data).then(res => {
    return res.data;
  }).then(res => {
    returnres = res;
    database[cmd].filter(function (value, index) {
      if (res.id == value.id) {
        database[cmd][index] = res;
      }
    })
    // console.log(cmd, value, 'putAxios',res);
    if (cmd == "devices") {
      devicesStateModify(res);
    }
  }).catch(err => {
    console.log(err);
  })
  return returnres;
}
// 改一部分
async function patchAxios(cmd, data, id = '') {
  let returnres;
  await axios.patch(baseURL + cmd + '/' + id, data).then(res => {
    return res.data;
  }).then(res => {
    returnres = res;
    database[cmd].filter(function (value, index) {
      if (res.id == value.id) {
        database[cmd][index] = res;
      }
    })
    // console.log(cmd, value, 'putAxios',res);
    if (cmd == "devices") {
      devicesStateModify(res);
    }
  }).catch(err => {
    // console.log(err);
  })
  return returnres;
}
// 刪
async function deleteAxios(cmd, id = '') {
  let returnres;
  await axios.delete(baseURL + cmd + '/' + id).then(res => {
    return res.data;
  }).then(res => {
    // console.log(cmd, res, 'deleteAxios');
    returnres = res;
  }).catch(err => {
    // console.log(err);
  })
  return returnres;
}

// 第一次進入刷新所有資料
Promise.all([dataAxios('devices'), dataAxios('areas'), dataAxios('plan')]).then(res => {
  if (database['plan'].length != 0) {
    // console.log(database['plan'], 'plan');
    darwCanvas(database['plan'][0].img);
  }
  if (database['devices'].length != 0) {
    // console.log(database['devices'], 'devices');
    database['devices'].forEach((value, index) => {
      if (!value.style.x) {
        appendDevices(value);
      } else {
        appendDevices(value, 'canvas_top');
      }
    })
  }
  if (database['areas'].length != 0) {
    // console.log(database['areas'], 'areas');
    database['areas'].forEach((value, index) => {
      // 沒被畫過的放上去
      if (!value.style.x) {
        areas(value);
      } else {
        setTimeout(() => {
          drawCanvasArea(value.style);
          alert_event[alert_event.length] = value;
        }, 0);
      }
    });
  }
  console.log(database, 'database');
})
