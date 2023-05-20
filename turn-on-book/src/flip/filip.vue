<!--
 * @Description: 
 * @Autor: qsyj
 * @Date: 2023-05-19 22:10:00
 * @LastEditors: qsyj
 * @LastEditTime: 2023-05-20 16:34:42
-->
<template>
  <div>
    <div>
      <input type="file" @change="fileChange" />
    </div>

    <div v-show="showBook" id="book" ref="bookRef">
      <!-- <div class="odd" id="page1">1</div>
      <div class="even" id="page2">2</div>
      <div class="odd" id="page3">3</div>
      <div class="even" id="page4">4</div> -->
    </div>
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
    };
  },
  methods: {
    fileChange(e) {
      const files = e.target.files;

      readPdfArrayBuffer(files[0], (arrayBuffer) => {
        // console.log('arrayBuffer',arrayBuffer);
        pdfArrayBufferToContent(arrayBuffer, (pdf) => {
          const canvasMap = createCanvas(pdf);

          this.$nextTick(() => {
            let height = 0;
            let width = 0;
            Object.keys(canvasMap).forEach((key) => {
              const item = canvasMap[key];

              if (!width) width = item.canvas.width;

              if (!height) height = item.canvas.height;

              const div = document.createElement("div");

              div.append(item.canvas);
              div.classList.add("page");
              this.$refs.bookRef.append(div);

              renderPdfCanvas(pdf, key, item);
            });

            this.showBook = true;
            this.$nextTick(() => {
              // this.$refs.bookRef.style.width = `${width}px`;
              // this.$refs.bookRef.style.height = `${height}px`;
              setTimeout(() => {
                this.init(Object.keys(canvasMap).length, 595, 841);
              }, 200);
            });
          });
        });
      });
    },
    init(pages, width, height) {
      // console.log('$("#flipbook")', $("#flipbook"));

      console.log(" width, height", width, height);
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
