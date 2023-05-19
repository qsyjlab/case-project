<!--
 * @Date: 2020-10-21 10:44:54
 * @information: pdf 转图片并下载
-->
<template>
  <div id="page09">
    <div class="info-box">
      <div class="input">
        <input
          id="input"
          type="file"
          accept="application/pdf"
          @change="convertFile()"
        />
      </div>
      <div class="cell">
        <div>名称：{{ fileName || "-" }}</div>
        <div>大小：{{ Number(fileSize).toFixed(2) }}M</div>
        <div>页数：{{ filePage }}</div>
        <button @click="onExportImg">保存图片</button>
      </div>
    </div>

    <div id="container"></div>
  </div>
</template>

<script>
import PDFJS from "pdfjs-dist";
import JSZIP from "jszip";
import FileSaver from "file-saver";

PDFJS.GlobalWorkerOptions.workerSrc = import("pdfjs-dist/build/pdf.worker.entry");

export default {
  data() {
    return {
      // pdf地址
      pdfPath2: `https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf`,
      // arrayBuffer
      arrayBuffer: null,
      // 文件名称
      fileName: null,
      // 文件大小
      fileSize: 0,
      // 文件页数
      filePage: 0,
    };
  },
  methods: {
    /**
     * 读取文件内容
     */
    convertFile() {
      let file = document.getElementById("input").files;
      if (!file.length) return;
      let { name, size } = file[0];
      Object.assign(this, { fileName: name, fileSize: size / 1024 / 1024 });
      // 使用FileReader对象，web应用程序可以异步的读取存储在用户计算机上的文件(或者原始数据缓冲)内容，可以使用File对象或者Blob对象来指定所要处理的文件或数据
      let fileReader = new FileReader();
      // 异步按字节读取文件内容，结果用ArrayBuffer对象表示
      fileReader.readAsArrayBuffer(file[0]);
      fileReader.onload = (e) => {
        let arrayBuffer = (this.arrayBuffer = e.target.result);
        // 创建canvas节点
        this.createCanvas(arrayBuffer);
      };
    },

    /**
     * 创建canvas
     */
    createCanvas(val) {
      // 清空节点下数据
      document.getElementById("container").innerHTML = "";
      // 使用getTextContent获取pdf内容
      PDFJS.getDocument(val).promise.then((el) => {
        let filePage = (this.filePage = el.numPages);
        for (let i = 1; i <= filePage; i++) {
          let canvas = document.createElement("canvas");
          canvas.id = `pageNum-${i}`;
          let context = canvas.getContext("2d");
          document.getElementById("container").append(canvas);
          // 渲染canvas
          this.openPage(el, i, context);
        }
      });
    },

    /**
     * 渲染canvas
     */
    openPage(pdfFile, pageNumber, context) {
      // 获取PDF文档中的各个页面
      pdfFile.getPage(pageNumber).then((page) => {
        // 设置展示比例
        let scale = 3;
        // 获取pdf尺寸
        let viewport = page.getViewport(scale);
        let canvas = context.canvas;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = "100%";
        canvas.style.height = "100%";

        let model = {
          canvasContext: context,
          viewport: viewport,
        };
        // 渲染PDF
        page.render(model);
      });
    },

    /**
     * 保存图片
     */
    onExportImg() {
      if (!this.arrayBuffer) {
        alert(`请上传pdf文件`);
        return;
      }

      let jszip = new JSZIP();
      // 解压缩后的文件夹名称
      let images = jszip.folder("images");
      let eleList = document.querySelectorAll("canvas");
      // 遍历所有canvas节点
      for (let i = 0; i < eleList.length; i++) {
        let canvas = document.getElementById(`pageNum-${i + 1}`);
        // 向此文件夹中加入文件
        // toDataURL() 方法返回一个包含图片展示的 data URI 。可以使用 type 参数其类型，默认为 PNG 格式。图片的分辨率为96dpi
        images.file(
          `image-${i + 1}.png`,
          this.dataURLtoBlob(canvas.toDataURL("image/png", 1.0)),
          {
            base64: true,
          }
        );
      }

      // 生成一个zip文件
      jszip
        .generateAsync({
          type: "blob",
        })
        .then((content) => {
          // 使用 FileSaver 保存下载 zip 文件
          FileSaver.saveAs(content, "pdfToImages.zip");
        });
    },

    /**
     * dataURL 转成 Blob
     */
    dataURLtoBlob(val) {
      let arr = val.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        // charCodeAt() 方法可返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数
        u8arr[n] = bstr.charCodeAt(n);
      }
      // new Blob(blobParts, [options]) 参数说明:
      // 1. blobParts：数组类型，数组中的每一项连接起来构成Blob对象的数据，数组中的每项元素可以是ArrayBuffer, ArrayBufferView, Blob, DOMString
      // 2. options：可选项，字典格式类型，可以指定如下两个属性：
      //    (1) type，默认值为 ""，它代表了将会被放入到blob中的数组内容的MIME类型。
      //    (2) endings，默认值为"transparent"，用于指定包含行结束符\n的字符串如何被写入。 它是以下两个值中的一个： "native"，表示行结束符会被更改为适合宿主操作系统文件系统的换行符； "transparent"，表示会保持blob中保存的结束符不变

      return new Blob([u8arr], { type: mime });
    },
  },
  created() {},
  mounted() {},
};
</script>

<style>
#page09 {
  width: 1000px;
  margin: 0 auto;
}

.info-box {
  position: relative;
}

.input {
  margin: 15px 0;
}
#input {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.cell {
  margin: 15px 0;
  display: flex;
  justify-content: space-around;
}

.cell div {
  margin-right: 20px;
}

#container {
  width: 100%;
  min-height: 850px;
  margin: 0 auto;
  border: 1px solid #eee;
  border-radius: 10px;
}

canvas {
  margin-bottom: 10px;
  border: 1px solid #ff6700;
  border-radius: 10px;
}
</style>
