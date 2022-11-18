export function createArtboard(el) {
  if (!el) return;

  const canvasInstance = document.createElement("canvas");

  canvasInstance.width = el.offsetWidth;
  canvasInstance.height = el.offsetHeight;

  el.appendChild(canvasInstance);

  const canvasContext2D = canvasInstance.getContext("2d");

  canvasContext2D.lineJoin = "round";
  canvasContext2D.lineCap = "round";

  

  let isDraw = false;

  // 停止绘制
  function stopDraw() {
    isDraw = false;
    canvasContext2D.closePath();
  }

  // 清空画布
  function clearCanvas() {
    canvasContext2D.clearRect(
      0,
      0,
      canvasInstance.width,
      canvasInstance.height
    );
  }

  function stroke(x, y) {
    
    canvasContext2D.lineTo(x, y);
    canvasContext2D.stroke();
  }

  function mouseEvent(e) {
    const x = e.pageX - canvasInstance.offsetLeft;
    const y = e.pageY - canvasInstance.offsetTop;

    return { x, y };
  }

  canvasInstance.onmousedown = (e) => {
    isDraw = true;
    canvasContext2D.beginPath();

    const { x, y } = mouseEvent(e);

    canvasContext2D.moveTo(x, y);

    stroke(x, y);
  };

  // 移动绘制
  canvasInstance.onmousemove = (e) => {
    if (!isDraw) return;

    const { x, y } = mouseEvent(e);
    stroke(x, y);
  };

  // 鼠标离开
  canvasInstance.onmouseleave = () => {
    stopDraw();
  };

  // 鼠标抬起
  canvasInstance.onmouseup = () => {
    stopDraw();
  };

  function toBlob(...parameter) {
    canvasInstance.toBlob(...parameter);
  }

  function toBase64(...parameter) {
    return canvasInstance.toDataURL(...parameter);
  }

  return {
    toBlob,
    toBase64,
    clearCanvas,
  };
}

export default createArtboard;
