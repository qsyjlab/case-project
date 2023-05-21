<!--
 * @Description: 
 * @Autor: qsyj
 * @Date: 2023-05-19 22:10:00
 * @LastEditors: qsyj
 * @LastEditTime: 2023-05-21 14:48:46
-->
<template>
  <div>
    <div>
      <input type="file" @change="fileChange" />
    </div>

    <div v-show="showBook" id="book" ref="bookRef">
      <div class="page" v-for="(item, index) in imagesMap" :key="index">
        <img :src="item.src" alt="/" />
      </div>
    </div>

    <div class="canvasList" v-show="false" ref="canvsListRef"></div>
  </div>
</template>
<script>
import "../lib/turn";
import $ from "jquery";
import {
  readPdfArrayBuffer,
  pdfArrayBufferToContent,
  createCanvas,
  renderPdfCanvas,
} from "../utils/pdf";

export default {
  data() {
    return {
      showBook: false,
      imagesMap: [],
    };
  },
  methods: {
    fileChange(e) {
      const files = e.target.files;

      readPdfArrayBuffer(files[0], (arrayBuffer) => {
        // console.log('arrayBuffer',arrayBuffer);
        pdfArrayBufferToContent(arrayBuffer, (pdf) => {
          const canvasMap = createCanvas(pdf);

          this.$nextTick(async () => {
            let height = 0;
            let width = 0;

            for (const key in canvasMap) {
              if (Object.hasOwnProperty.call(canvasMap, key)) {
                const item = canvasMap[key].context2d;

                if (!width) width = item.canvas.width;

                if (!height) height = item.canvas.height;

                const div = document.createElement("div");
                div.append(item.canvas);
                div.classList.add("page");
                await renderPdfCanvas(pdf, key, item);
                this.$refs.canvsListRef.append(div);

                const blob = await this.generateImage(canvasMap[key].instance);
                this.imagesMap.push({
                  name: "",
                  num: key,
                  src: window.URL.createObjectURL(blob),
                });
              }
            }

            setTimeout(() => {
              this.showBook = true;
              this.init(this.imagesMap.length, 595 * 3, 841 * 3);
            }, 300);
          });
        });
      });
    },
    generateImage(canvas) {
      // console.log("canvas.toBlob", canvas.toBlob);

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/png",
          1.0
        );
      });
    },
    init(pages, width, height) {
      // console.log('$("#flipbook")', $("#flipbook"));

      // console.log(" width, height", width, height);
      this.$nextTick(() => {
        $("#book").turn({
          // height:700,
          width,
          height,

          acceleration: true, // 是否启动硬件加速 如果为触摸设备必须为true
          pages: pages, // 页码总数
          // elevation: 50, // 这个忘记是什么了
          gradients: true, // 是否显示翻页1阴影效果
          display: "single", //设置单页还是双页
          when: {
            // 翻页前触发
            turning: function (e, page, view) {},
            // 翻页后触发
            turned: function (e, page) {},
          },
        });
      });
    },
  },
  mounted() {
    // console.log("$", $);
    // this.init();
  },
};
</script>
<style scoped>
#flipbook {
  width: 100%;
  height: 600px;
  /* background-color: antiquewhite; */
  background-color: black;
}

.page {
  /* width: 70%; */
  height: 600px;
  background-color: white;
  text-align: center;
}
#book {
  /* width: 80%; */
  /* width: 90vw; */
  /* height: 70vh; */
  margin: 0 auto;
  box-shadow: 0 0 15px #4d4c4c;
}

#book canvas {
  width: 100%;
  /* height:100%; */
}
</style>
