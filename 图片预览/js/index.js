import { updateStyle, adaptScale } from "./utils.js";

export function init() {
  document.getElementById("list").addEventListener("click", (e) => {
    e.preventDefault();

    if (e.target.tagName === "IMG") {
      preview(e.target);
    }
  });
}

function preview(originEl) {
  const el = originEl.cloneNode(true);

  el.style.opacity = 0;

  let offset = {};

  // 中心点
  let origin = "center";
  let scale = 1;
  let lastScale = 1;
  let lastDistance = 0;

  let scaleOrigin = { x: 0, y: 0 };

  let startPoint = { x: 0, y: 0 }; // 记录初始触摸点位
  let isTouching = false; // 标记是否正在移动
  let isMove = false; // 正在移动中，与点击做区别

  let touches = new Map();

  const maskInstance = createMask();

  document.body.appendChild(maskInstance);

  const { top, left } = originEl.getBoundingClientRect();
  el.style.opacity = 1;

  updateStyle(el, [`left: ${left}px`, `top: ${top}px`]);

  maskInstance.appendChild(el);

  const { innerWidth, innerHeight } = window;

  const originalCenterPoint = {
    x: originEl.offsetWidth / 2 + left,
    y: originEl.offsetHeight / 2 + top,
  };
  // 中心点位置
  const winCenterPoint = { x: innerWidth / 2, y: innerHeight / 2 };

  const offsetDistance = {
    left: winCenterPoint.x - originalCenterPoint.x + left,
    top: winCenterPoint.y - originalCenterPoint.y + top,
  };

  const diffs = {
    left: ((getOriginElScale() - 1) * originEl.offsetWidth) / 2,
    top: ((getOriginElScale() - 1) * originEl.offsetHeight) / 2,
  };

  updateStyle(el, [
    "transition: all 0.3s",
    `width: ${originEl.offsetWidth * getOriginElScale() + "px"}`,
    `transform: translate(${offsetDistance.left - left - diffs.left}px, ${
      offsetDistance.top - top - diffs.top
    }px)`,
  ]);

  setTimeout(() => {
    updateStyle(el, [
      "transition: all 0s",
      `left: 0`,
      `top: 0`,
      `transform: translate(${offsetDistance.left - diffs.left}px, ${
        offsetDistance.top - diffs.top
      }px)`,
    ]);
    offset = {
      left: offsetDistance.left - diffs.left,
      top: offsetDistance.top - diffs.top,
    }; // 记录值
  }, 300);

  bindEventHandler();

  function bindEventHandler() {
    maskInstance.addEventListener("click", (e) =>
      maskClickEventHandler(e, maskInstance)
    );
    maskInstance.addEventListener(
      "mousewheel",
      (e) => zoomEventHandler(e, el),
      {
        passive: false,
      }
    );
  }

  // 模态框点击事件
  function maskClickEventHandler(e, maskInstance) {
    if (isMove) {
      isMove = false;
    } else {
      updateStyle(el, [
        "transition: all .3s",
        `left: ${left}px`,
        `top: ${top}px`,
        `transform: translate(0,0)`,
        `width: ${originEl.offsetWidth}px`,
      ]);
      initilizeVal();
      setTimeout(() => {
        document.body.removeChild(maskInstance);
        originEl.style.opacity = 1;
        maskInstance.removeEventListener("click", maskClickEventHandler);
      }, 300);
    }
  }

  function getOriginElScale() {
    return adaptScale(originEl);
  }

  // 鼠标/手指按下
  window.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    isTouching = true;

    touches.set(e.pointerId, e);

    if (touches.size === 2) {
      lastDistance = getDistance();
      lastScale = scale;
    }

    startPoint = { x: e.clientX, y: e.clientY };
  });
  // 鼠标/手指抬起
  window.addEventListener("pointerup", (e) => {
    e.preventDefault();
    e.stopPropagation();
    isTouching = false;

    setTimeout(() => {
      isMove = false;
    }, 0);
    touches.delete(e.pointerId);
  });
  // 鼠标/手指移动
  window.addEventListener("pointermove", (e) => {
    if (!isTouching) return false;

    isMove = true;

    if (touches.size < 2) {
      // 单指滑动/鼠标移动
      offset = {
        left: offset.left + (e.clientX - startPoint.x),
        top: offset.top + (e.clientY - startPoint.y),
      };
      updateStyle(el, [
        "transition: all 0s",
        `transform: translate(${offset.left + "px"}, ${
          offset.top + "px"
        }) scale(${scale})`,
        `transform-origin: ${origin}`,
      ]);
      // 注意移动完也要更新初始点位，否则图片会加速逃逸可视区域
      startPoint = { x: e.clientX, y: e.clientY };
    } else {
      touches.set(e.pointerId, e); // 更新点位数据
      const ratio = getDistance() / lastDistance; // 比较距离得出比例
      scale = ratio * lastScale;
      offset = getOffsetCorrection();
      updateStyle(el, [
        "transition: all 0s",
        `transform: translate(${offset.left + "px"}, ${
          offset.top + "px"
        }) scale(${scale})`,
        `transform-origin: ${origin}`,
      ]);
    }
  });
  // 滚轮缩放
  function zoomEventHandler(event, el) {
    if (!event.deltaY) {
      return;
    }
    event.preventDefault();
    origin = `${event.offsetX}px ${event.offsetY}px`;

    if (event.deltaY < 0) {
      scale += 0.2; // 放大
    } else if (event.deltaY > 0) {
      scale >= 0.3 && (scale -= 0.2); // 缩小
    }

    offset = getOffsetCorrection(event.offsetX, event.offsetY);
    updateStyle(el, [
      "transition: all .15s",
      `transform-origin: ${origin}`,
      `transform: translate(${offset.left + "px"}, ${
        offset.top + "px"
      }) scale(${scale})`,
    ]);
  }

  function createMask() {
    const maskInstance = document.createElement("div");
    maskInstance.classList.add("modal");

    return maskInstance;
  }

  // 初始化值
  function initilizeVal() {
    offset = {};

    // 中心点
    origin = "center";
    scale = 1;
    lastScale = 1;
    lastDistance = 0;

    scaleOrigin = { x: 0, y: 0 };

    startPoint = { x: 0, y: 0 }; // 记录初始触摸点位
    isTouching = false; // 标记是否正在移动
    isMove = false; // 正在移动中，与点击做区别

    touches = new Map();
  }

  function getDistance() {
    const touchArr = Array.from(touches);
    if (touchArr.length < 2) {
      return 0;
    }
    const start = touchArr[0][1];
    const end = touchArr[1][1];
    return Math.hypot(end.x - start.x, end.y - start.y);
  }

  // 获取中心改变的偏差
  function getOffsetCorrection(x = 0, y = 0) {
    const touchArr = Array.from(touches);
    if (touchArr.length === 2) {
      const start = touchArr[0][1];
      const end = touchArr[1][1];
      x = (start.offsetX + end.offsetX) / 2;
      y = (start.offsetY + end.offsetY) / 2;
    }
    origin = `${x}px ${y}px`;
    const offsetLeft = (scale - 1) * (x - scaleOrigin.x) + offset.left;
    const offsetTop = (scale - 1) * (y - scaleOrigin.y) + offset.top;
    scaleOrigin = { x, y };
    return { left: offsetLeft, top: offsetTop };
  }
}
