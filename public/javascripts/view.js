// 繪圖事件
function drawCanvasArea(obj, fill) {
  // console.log(obj);
  context.strokeStyle = obj.bordercolor;
  context.beginPath();
  context.rect(obj.x, obj.y, obj.width, obj.height);
  if (fill) {
    context.fillStyle = fill;
    context.fill();
  }
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

