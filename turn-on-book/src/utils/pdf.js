import PDFJS from "pdfjs-dist";
import JSZIP from "jszip";
import FileSaver from "file-saver";

PDFJS.GlobalWorkerOptions.workerSrc = import(
  "pdfjs-dist/build/pdf.worker.entry"
);

export function readPdfArrayBuffer(file, calback) {
  const fileReader = new FileReader();
  // 异步按字节读取文件内容，结果用ArrayBuffer对象表示
  fileReader.readAsArrayBuffer(file);
  fileReader.onload = (e) => {
    let arrayBuffer = e.target.result;
    calback && calback(arrayBuffer);
  };
}

export function pdfArrayBufferToContent(pdfArrayBuffer, handler) {
  return new Promise((resolve) => {
    const pdfContents = [];
    // 使用getTextContent获取pdf内容
    PDFJS.getDocument(pdfArrayBuffer).promise.then((el) => {
      handler && handler(el);

      resolve(pdfContents);
    });
  });
}

export function createCanvas(pdfEl, target) {
  const canvasMap = {};
  let filePage = pdfEl.numPages;
  for (let i = 1; i <= filePage; i++) {
    let canvas = document.createElement("canvas");
    canvas.id = `${new Date().getTime()}-${i}`;
    let context = canvas.getContext("2d");

    canvasMap[i] = {
      context2d: context,
      instance: canvas,
    };
  }

  return canvasMap;
}

export async function renderPdfCanvas(pdfFile, pageNumber, context) {
  return new Promise((resolve) => {
    pdfFile.getPage(Number(pageNumber)).then((page) => {
      // 设置展示比例
      let scale = 1;
      // 获取pdf尺寸
      let viewport = page.getViewport(scale);
      let canvas = context.canvas;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // console.log('viewport',viewport);
      let model = {
        canvasContext: context,
        viewport: viewport,
      };
      // 渲染PDF
      page.render(model).promise.then(() => {
        resolve(true);
      });
    });
  });
}
