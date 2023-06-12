<!--
 * @Description: 
 * @Autor: qsyj
 * @Date: 2023-05-19 21:45:55
 * @LastEditors: qsyj
 * @LastEditTime: 2023-05-20 15:01:11
-->
<template>
  <div id="fullpage">
    <div class="section">Section 1</div>
    <div class="section">Section 2</div>
    <div class="section">Section 3</div>
  </div>
</template>
<script>
import "fullpage.js/dist/fullpage.css";
import fullpage from "fullpage.js";
export default {
  components: {
    // FlipPage,
    // filip,
  },
  data() {
    return {};
  },
  mounted() {
    new fullpage("#fullpage", {
      // Options
      sectionsColor: ["#f2f2f2", "#4BBFC3", "#7BAABE"],
      navigation: true,
      navigationPosition: "right",
      responsiveWidth: 768,
    });
  },
  methods: {},
};
</script>
<style scoped></style>
