<template>
  <div class="container">
    <div class="flip-book" id="demoBookExample">
      <div class="page page-cover page-cover-top" >
        <div class="page-content">
          <h2>BOOK TITLE</h2>
        </div>
      </div>
      <div class="page" v-for="(item,index) in imagesArr" :key="index">
        <div class="page-content">
          <img :src="item.src" alt="" />
          <!-- <h2 class="page-header">Page header 1</h2>
                <div class="page-image" style="background-image: url(images/html/1.jpg)"></div>
                <div class="page-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In cursus mollis nibh, non convallis ex convallis eu. Suspendisse potenti. Aenean vitae pellentesque erat. Integer non tristique quam. Suspendisse rutrum, augue ac sollicitudin mollis, eros velit viverra metus, a venenatis tellus tellus id magna. Aliquam ac nulla rhoncus, accumsan eros sed, viverra enim. Pellentesque non justo vel nibh sollicitudin pharetra suscipit ut ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In cursus mollis nibh, non convallis ex convallis eu. Suspendisse potenti. Aenean vitae pellentesque erat. Integer non tristique quam. Suspendisse rutrum, augue ac sollicitudin mollis, eros velit viverra metus, a venenatis tellus tellus id magna.</div>
                 -->
                 <div class="page-footer">{{index}}</div>
        </div>
      </div>

      <div class="page page-cover page-cover-bottom" data-density="hard">
        <div class="page-content">
          <h2>THE END</h2>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { PageFlip } from "page-flip";
export default {
  data() {
    return {
      imagesMap: [
        {
          src: "https://api.qsyjlab.club/file/uploads/cover/20230202/63db23f9002f3.png",
        },
        {
          src: "https://api.qsyjlab.club/file/uploads/cover/20230129/63d5ff6caa936.jpg",
        },
        {
          src: "https://api.qsyjlab.club/file/uploads/cover/20221116/63745b8944e55.jpg",
        },
        {
          src: "https://api.qsyjlab.club/file/uploads/cover/20230202/63db23f9002f3.png",
        },
        {
          src: "https://api.qsyjlab.club/file/uploads/cover/20220908/63194d27c8fc0.jpg",
        },
        {
          src: "https://api.qsyjlab.club/file/uploads/cover/20230202/63db23f9002f3.png",
        },
        {
          src: "https://api.qsyjlab.club/file/uploads/cover/20230202/63db23f9002f3.png",
        },
        {
          src: "https://api.qsyjlab.club/file/uploads/cover/20230202/63db23f9002f3.png",
        },
        {
          src: "https://api.qsyjlab.club/file/uploads/cover/20230202/63db23f9002f3.png",
        },
        {
          src: "https://api.qsyjlab.club/file/uploads/cover/20230202/63db23f9002f3.png",
        },
      ],
      imagesArr: [],
    };
  },
  mounted() {
    for (let i = 0; i <= 400; i++) {
        console.log('this.imagesMap[i % this.imagesMap.length]',this.imagesMap[i % this.imagesMap.length]);
      this.imagesArr.push(this.imagesMap[i % this.imagesMap.length]);
    }

    this.$nextTick(()=> {
        this.init();
    })
  },
  methods: {
    init() {
      const pageFlip = new PageFlip(
        document.getElementById("demoBookExample"),
        {
          width: 550, // base page width
          height: 733, // base page height

          size: "stretch",
          // set threshold values:
          minWidth: 315,
          maxWidth: 600,
          minHeight: 420,
          maxHeight: 800,
          flippingTime: 500,

          maxShadowOpacity: 0.3, // Half shadow intensity
          showCover: false,
          mobileScrollSupport: true, // disable content scrolling on mobile devices
        }
      );

      pageFlip.loadFromHTML(document.querySelectorAll(".page"));
      //   document.querySelector(".page-orientation").innerText =
      //     pageFlip.getOrientation();
      //   document.querySelector(".btn-prev").addEventListener("click", () => {
      //     pageFlip.flipPrev();
      //   });
      //   document.querySelector(".btn-next").addEventListener("click", () => {
      //     pageFlip.flipNext();
      //   });
      //   pageFlip.on("flip", (e) => {
      //     document.querySelector(".page-current").innerText = e.data + 1;
      //   });
      //   pageFlip.on("changeState", (e) => {
      //     document.querySelector(".page-state").innerText = e.data;
      //   });
      //   pageFlip.on("changeOrientation", (e) => {
      //     document.querySelector(".page-orientation").innerText = e.data;
      //   });
    },
  },
};
</script>
<style lang="scss" scoped>
.flip-book {
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.5);
  //   display: none;
  //   background-size: cover;
  min-width: 315px;
  min-height: 400px;
  width: 100%;
  max-width: 2000px;
}
.page {
  //  height: 100vh;
//   padding: 20px;
  box-sizing: border-box;

  background-color: #FCFAF7;
  color: #785E3A;
  border: solid 1px black;

  overflow: hidden;

  .page-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;

    img {
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      user-select: none;
    }

    .page-header {
      height: 30px;
      font-size: 100%;
      text-transform: uppercase;
      text-align: center;
    }

    .page-image {
      height: 100%;
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
    }

    .page-text {
      height: 100%;
      flex-grow: 1;
      font-size: 80%;
      text-align: justify;
      margin-top: 10px;
      padding-top: 10px;
      box-sizing: border-box;
      border-top: solid 1px black;
    }

    // .page-footer {
    //   height: 30px;
    //   border-top: solid 1px black;
    //   font-size: 80%;
    //   color: #998466;
    // }
  }

  &.--left {
    // for left page (property will be added automatically)
    border-right: 0;
    box-shadow: inset -7px 0 30px -7px rgba(0, 0, 0, 0.4);
  }

  &.--right {
    // for right page (property will be added automatically)
    border-left: 0;
    box-shadow: inset 7px 0 30px -7px rgba(0, 0, 0, 0.4);

    .page-footer {
      text-align: right;
    }
  }

  &.hard {
    // for hard page
    background-color: #F2E8D9;
    border: solid 1px #998466;
  }

  &.page-cover {
    background-color: #E3D0B5;
    color: #785E3A;
    border: solid 1px #998466;

    h2 {
      text-align: center;
      padding-top: 50%;
      font-size: 210%;
    }

    &.page-cover-top {
      box-shadow: inset 0px 0 30px 0px rgba(36, 10, 3, 0.5),
        -2px 0 5px 2px rgba(0, 0, 0, 0.4);
    }

    &.page-cover-bottom {
      box-shadow: inset 0px 0 30px 0px rgba(36, 10, 3, 0.5),
        10px 0 8px 0px rgba(0, 0, 0, 0.4);
    }
  }
}
</style>
