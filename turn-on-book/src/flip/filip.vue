<!--
 * @Description: 
 * @Autor: qsyj
 * @Date: 2023-05-19 22:10:00
 * @LastEditors: qsyj
 * @LastEditTime: 2023-05-19 22:31:48
-->
<template>
  <div>
    <div id="book">
      <div class="odd" id="page1">1</div>
      <div class="even" id="page2">2</div>
      <div class="odd" id="page3">3</div>
      <div class="even" id="page4">4</div>
    </div>
  </div>
</template>
<script>
import "../lib/turn";
import $ from "jquery";

export default {
  data() {
    return {};
  },
  methods: {
    init() {
      console.log('$("#flipbook")', $("#flipbook"));
      this.$nextTick(() => {
        $("#book").turn({
          acceleration: true, // 是否启动硬件加速 如果为触摸设备必须为true
          pages: 4, // 页码总数
          elevation: 50, // 这个忘记是什么了
          height: 200, // 高度 单位 px
          gradients: true, // 是否显示翻页阴影效果
          display: 'single', //设置单页还是双页
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
    console.log("$", $);
    this.init();
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
  width: 70%;
  height: 600px;
  background-color: white;
}
#book {
  width: 90vw;
  margin: 0 auto;
  box-shadow: 0 0 15px #4d4c4c;
}

#book .turn-page {
  background-color: white;
}

#book .cover {
  background: #333;
}

#book .cover h1 {
  color: white;
  text-align: center;
  font-size: 50px;
  line-height: 500px;
  margin: 0px;
}

#book .loader {
  /* background-image: url(loader.gif); */
  width: 24px;
  height: 24px;
  display: block;
  position: absolute;
  top: 238px;
  left: 188px;
}

#book .data {
  text-align: center;
  font-size: 40px;
  color: #999;
  line-height: 500px;
}

#book .odd {
  background-image: -webkit-linear-gradient(left, #fff 95%, #ddd 100%);
  background-image: -moz-linear-gradient(left, #fff 95%, #ddd 100%);
  background-image: -o-linear-gradient(left, #fff 95%, #ddd 100%);
  background-image: -ms-linear-gradient(left, #fff 95%, #ddd 100%);
  box-shadow: 0 0 15px #4d4c4c;
}

#book .even {
  background-image: -webkit-linear-gradient(right, #fff 95%, #ddd 100%);
  background-image: -moz-linear-gradient(right, #fff 95%, #ddd 100%);
  background-image: -o-linear-gradient(right, #fff 95%, #ddd 100%);
  background-image: -ms-linear-gradient(right, #fff 95%, #ddd 100%);
  box-shadow: 0 0 15px #4d4c4c;
}
</style>
