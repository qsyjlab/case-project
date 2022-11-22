let modalInstance = null;

let offset = {};

// 中心点
let origin = "center";
let scale = 1;

let startPoint = { x: 0, y: 0 }; // 记录初始触摸点位
let isTouching = false; // 标记是否正在移动
let isMove = false; // 正在移动中，与点击做区别

export function init() {
  document.getElementById("list").addEventListener("click", (e) => {
    e.preventDefault();

    if (e.target.tagName === "IMG") {
      const cloneTargetNode = e.target.cloneNode(true);

      cloneTargetNode.style.opacity = 0;
      preview(cloneTargetNode, e.target);
    }
  });
}

function preview(el, originEl) {
  const mask = document.createElement("div");

  modalInstance = mask;
  mask.classList.add("modal");

  document.body.appendChild(mask);

  const { top, left } = originEl.getBoundingClientRect();
  el.style.opacity = 1;

  function maskClickFn(e, mask) {
    if (e.stopPropagation) {
      e.stopPropagation(); //非IE
    } else {
      e.cancelBubble = true; //兼容IE
    }
    // console.log('close');

    if (isMove) {
      isMove = false;
    } else {
      changeStyle(el, [
        "transition: all .3s",
        `left: ${left}px`,
        `top: ${top}px`,
        `transform: translate(0,0)`,
        `width: ${originEl.offsetWidth}px`,
      ]);
      setTimeout(() => {
        document.body.removeChild(mask);
        originEl.style.opacity = 1;
        mask.removeEventListener("click", maskClickFn);
      }, 300);
    }
  }

  mask.addEventListener("click", (e) => maskClickFn(e, mask));

  // 事件
  mask.addEventListener("mousewheel", (e) => zoom(e, el, originEl), {
    passive: false,
  });

  changeStyle(el, [`left: ${left}px`, `top: ${top}px`]);

  mask.appendChild(el);

  const { innerWidth, innerHeight } = window;

  const originalCenterPoint = {
    x: originEl.offsetWidth / 2 + left,
    y: originEl.offsetHeight / 2 + top,
  };

  const winCenterPoint = { x: innerWidth / 2, y: innerHeight / 2 };

  const offsetDistance = {
    left: winCenterPoint.x - originalCenterPoint.x + left,
    top: winCenterPoint.y - originalCenterPoint.y + top,
  };

  const diffs = {
    left: ((adaptScale(originEl) - 1) * originEl.offsetWidth) / 2,
    top: ((adaptScale(originEl) - 1) * originEl.offsetHeight) / 2,
  };

  changeStyle(el, [
    "transition: all 0.3s",
    `width: ${originEl.offsetWidth * adaptScale(originEl) + "px"}`,
    `transform: translate(${offsetDistance.left - left - diffs.left}px, ${
      offsetDistance.top - top - diffs.top
    }px)`,
  ]);

  // 鼠标/手指按下
  window.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    isTouching = true;
    startPoint = { x: e.clientX, y: e.clientY };
  });
  // 鼠标/手指抬起
  window.addEventListener("pointerup", (e) => {
    e.preventDefault();
    isTouching = false;
    setTimeout(() => {
      isMove = false;
    }, 300);
  });
  // 鼠标/手指移动
  window.addEventListener("pointermove", (e) => {
    if (isTouching) {
      isMove = true;
      // 单指滑动/鼠标移动
      offset = {
        left: offset.left + (e.clientX - startPoint.x),
        top: offset.top + (e.clientY - startPoint.y),
      };
      changeStyle(el, [
        'transition: all 0s',
        `transform: translate(${offset.left + "px"}, ${
          offset.top + "px"
        }) scale(${scale})`,
        `transform-origin: ${origin}`,
      ]);
      // 注意移动完也要更新初始点位，否则图片会加速逃逸可视区域
      startPoint = { x: e.clientX, y: e.clientY };
    }
  });

  //   // 动画结束后消除定位重置的偏差
  setTimeout(() => {
    changeStyle(el, [
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
}

// 滚轮缩放
const zoom = (event, el) => {
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
  changeStyle(el, [
    "transition: all .15s",
    `transform-origin: ${origin}`,
    `transform: translate(${offset.left + "px"}, ${
      offset.top + "px"
    }) scale(${scale})`,
  ]);
};

// 用于修改样式的工具类，并且可以减少回流重绘，后面代码中会频繁用到
function changeStyle(el, arr) {
  const original = el.style.cssText.split(";");
  original.pop();
  el.style.cssText = original.concat(arr).join(";") + ";";
}

// 动态计算 缩放倍率
function adaptScale(el) {
  const { innerWidth, innerHeight } = window;
  const { offsetWidth: w, offsetHeight: h } = el; // 获取文档中图片的宽高
  let scale = 0;
  scale = innerWidth / w;
  if (h * scale > innerHeight - 80) {
    scale = (innerHeight - 80) / h;
  }
  return scale;
}
