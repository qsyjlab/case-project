<template>
  <span
    ><div ref="uploadDraggerRef" :class="['ant-upload', 'ant-upload-drag']">
      <span role="button" tabindex="0" class="ant-upload ant-upload-btn"
        ><input
          ref="inputFileRef"
          type="file"
          accept=""
          :multiple="multiple"
          style="display: none"
          @change="inputFileChange"
        />
        <div class="ant-upload-drag-container">
          <div class="ant-upload-drag-icon">
            <svg
              viewBox="0 0 1024 1024"
              data-icon="inbox"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
              class=""
            >
              <path
                d="M885.2 446.3l-.2-.8-112.2-285.1c-5-16.1-19.9-27.2-36.8-27.2H281.2c-17 0-32.1 11.3-36.9 27.6L139.4 443l-.3.7-.2.8c-1.3 4.9-1.7 9.9-1 14.8-.1 1.6-.2 3.2-.2 4.8V830a60.9 60.9 0 0 0 60.8 60.8h627.2c33.5 0 60.8-27.3 60.9-60.8V464.1c0-1.3 0-2.6-.1-3.7.4-4.9 0-9.6-1.3-14.1zm-295.8-43l-.3 15.7c-.8 44.9-31.8 75.1-77.1 75.1-22.1 0-41.1-7.1-54.8-20.6S436 441.2 435.6 419l-.3-15.7H229.5L309 210h399.2l81.7 193.3H589.4zm-375 76.8h157.3c24.3 57.1 76 90.8 140.4 90.8 33.7 0 65-9.4 90.3-27.2 22.2-15.6 39.5-37.4 50.7-63.6h156.5V814H214.4V480.1z"
              ></path>
            </svg>
          </div>
          <p class="ant-upload-text">点击或拖拽到上传框内</p>
          <p class="ant-upload-hint" v-if="accept">支持 {{ accept }}格式文件</p>
        </div></span
      >
    </div>

    <div class="ant-upload-list ant-upload-list-text">
      <transition-group name="file-list">
        <div v-for="(item, index) in fileList" :key="item.uid" @click.stop="$emit('click-item',item)">
          <div
            class="ant-upload-list-item ant-upload-list-item-error ant-upload-list-item-list-type-text"
          >
            <div class="ant-upload-list-item-info">
              <span
                ><i
                  aria-label="图标: paper-clip"
                  class="anticon anticon-paper-clip"
                  ><svg
                    viewBox="64 64 896 896"
                    data-icon="paper-clip"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                    class=""
                  >
                    <path
                      d="M779.3 196.6c-94.2-94.2-247.6-94.2-341.7 0l-261 260.8c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0 0 12.7 0l261-260.8c32.4-32.4 75.5-50.2 121.3-50.2s88.9 17.8 121.2 50.2c32.4 32.4 50.2 75.5 50.2 121.2 0 45.8-17.8 88.8-50.2 121.2l-266 265.9-43.1 43.1c-40.3 40.3-105.8 40.3-146.1 0-19.5-19.5-30.2-45.4-30.2-73s10.7-53.5 30.2-73l263.9-263.8c6.7-6.6 15.5-10.3 24.9-10.3h.1c9.4 0 18.1 3.7 24.7 10.3 6.7 6.7 10.3 15.5 10.3 24.9 0 9.3-3.7 18.1-10.3 24.7L372.4 653c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0 0 12.7 0l215.6-215.6c19.9-19.9 30.8-46.3 30.8-74.4s-11-54.6-30.8-74.4c-41.1-41.1-107.9-41-149 0L463 364 224.8 602.1A172.22 172.22 0 0 0 174 724.8c0 46.3 18.1 89.8 50.8 122.5 33.9 33.8 78.3 50.7 122.7 50.7 44.4 0 88.8-16.9 122.6-50.7l309.2-309C824.8 492.7 850 432 850 367.5c.1-64.6-25.1-125.3-70.7-170.9z"
                    ></path></svg></i
                ><span
                  :title="item.name"
                  style="flex: 1"
                  class="ant-upload-list-item-name"
                  >{{ item.name }}</span
                >
                <span
                  class="ant-upload-list-item-card-actions"
                  style="cursor: pointer"
                  @click="remove(item, index)"
                  ><a title="删除文件"
                    ><i
                      aria-label="图标: delete"
                      tabindex="-1"
                      class="anticon anticon-delete"
                      title="删除文件"
                      ><svg
                        viewBox="64 64 896 896"
                        data-icon="delete"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                        class=""
                      >
                        <path
                          d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"
                        ></path></svg></i></a></span
              ></span>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </span>
</template>
<script>
export function uuid() {
  let s = [];
  let hexDigits = "0123456789abcdef";
  for (let i = 0; i < 32; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23];
  let uuid = s.join("");
  return uuid;
}
export default {
  name: "upload-dragger",
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    // 1次 change | file.length change
    isGroup: {
      type: Boolean,
      default: false,
    },
    accept: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      dragParamter: {
        dropActive: false,
      },
      fileList: [],
    };
  },
  mounted() {
    this.mountEvent();
  },
  methods: {
    mountEvent() {
      const uploadDraggerRef = this.$refs.uploadDraggerRef;

      uploadDraggerRef.addEventListener("click", this.clickEventHandler, false);
      uploadDraggerRef.addEventListener("drop", this.dorpEventHandler, false);
      uploadDraggerRef.addEventListener(
        "dragleave",
        this.dragLeaveEventHandler,
        false
      );

      uploadDraggerRef.addEventListener(
        "dragenter",
        this.dragEnterEventHandler,
        false
      );
      uploadDraggerRef.addEventListener(
        "dragover",
        this.dragOverEventHandler,
        false
      );
    },

    inputFileChange(e) {
      const files = Array.from(e.target.files);

      this.transformFileList(files);
      this.$refs.inputFileRef.value = "";
    },
    clickEventHandler() {
      this.$refs.inputFileRef?.click();
    },
    dorpEventHandler(e) {
      e.preventDefault();
      this.dragParamter.dropActive = false;

      const files = Array.from(e.dataTransfer.files);
      this.transformFileList(files);
    },
    transformFileList(files = []) {
      const _files = [];
      files.forEach((item) => {
        const _obj = {
          name: item.name,
          // image/* 类似 待处理
          type: "_",
          uid: uuid(),
          raw: item,
        };

        _files.push(_obj);
      });
      this.fileList.push(..._files);

      return _files;
    },
    emitValue(file) {
      if (this.multiple) {
        this.$emit("change", {
          files: file,
          fileList: this.fileList,
        });
      } else if(this.multiple  && !this.isGroup){
        this.$emit('')
      } else {
        this.$emit("change", {
          file,
          fileList: this.fileList,
        });
      }
    },
    remove(item, index) {
      this.fileList.splice(index, 1);
    },
    dragLeaveEventHandler(e) {
      e.preventDefault();
      this.dragParamter.dropActive = false;
    },
    dragEnterEventHandler(e) {
      e.preventDefault();
      this.dragParamter.dropActive = true;
    },
    dragOverEventHandler(e) {
      e.preventDefault();
      this.dragParamter.dropActive = true;
    },

    unMountEvent() {},
  },
};
</script>
<style scoped>
.ant-upload {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: "tnum";
  outline: 0;
}
.ant-upload.ant-upload-drag {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  background: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.ant-upload.ant-upload-drag .ant-upload {
  padding: 16px 0;
}
.ant-upload.ant-upload-drag .ant-upload-drag-container {
  display: table-cell;
  vertical-align: middle;
}

.ant-upload.ant-upload-drag p.ant-upload-text {
  margin: 0 0 4px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
}

.ant-upload.ant-upload-drag p.ant-upload-hint {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

.ant-upload.ant-upload-drag:not(.ant-upload-disabled):hover {
  border-color: #40a9ff;
}

.ant-upload.ant-upload-drag-hover {
  border-color: #40a9ff;
}

.ant-upload-list-item-info > span {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ant-upload-list-item-info :hover{
  cursor: pointer;
  background-color: #e6f7ff;
}


/* file-list transition */
.file-list-enter-active,
.file-list-leave-active {
  transition: all 0.5s;
}

.file-list-enter,
.file-list-leave-active {
  opacity: 0;
  transform: translateY(-20px);
}

.file-list-move {
  transition: all 0.5s;
}

.file-list-leave-active {
  position: absolute;
}

svg {
  color: rgba(0,0,0,.45);
}

.ant-upload-list-item-name {
  /* color: rgba(0,0,0,.45); */
  color: #1890ff;
  font-size: 13px;
  overflow: hidden;
}


.ant-upload-list-item-name--error {
  color: #f5222d;
}

.ant-upload-drag-icon {
  font-size: 40px;
}
</style>
