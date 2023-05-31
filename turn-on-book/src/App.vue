<!--
 * @Description: 
 * @Autor: qsyj
 * @Date: 2023-05-19 21:45:55
 * @LastEditors: qsyj
 * @LastEditTime: 2023-05-20 15:01:11
-->
<template>
  <div>
    <flip-page></flip-page>
    <!-- <filip></filip> -->
    <!-- <PdfToImage /> -->
  </div>
</template>
<script>
import filip from "./flip/filip.vue";
import FlipPage from "./flip-page/flip-page.vue";

export default {
  components: {
    FlipPage,
    filip,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped></style>
