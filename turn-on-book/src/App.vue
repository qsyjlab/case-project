<!--
 * @Description: 
 * @Autor: qsyj
 * @Date: 2023-05-19 21:45:55
 * @LastEditors: qsyj
 * @LastEditTime: 2023-05-20 15:01:11
-->
<template>
  <div>
    <filip></filip>
    <!-- <PdfToImage /> -->
  </div>
</template>
<script>
import filip from "./flip/filip.vue";
import PdfToImage from "./pdf-to-image.vue";
export default {
  components: {
    filip,
    PdfToImage
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped></style>
