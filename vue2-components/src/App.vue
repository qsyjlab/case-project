<template>
  <div>
    <div
      :style="{
        width: '500px',
      }"
    >
      <UploadDragger />
    </div>
  </div>
</template>
<script>
import UploadDragger from "./components/upload/upload-dragger.vue";
export default {
  components: {
    UploadDragger,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped></style>
