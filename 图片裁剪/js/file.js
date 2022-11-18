// 源文件
let originFile = null;
let base64File = null;

let cropperInstance = null;

// 上传 input 实例
const uploadFileId = document.getElementById("uploadFileId");

// 图片实例
let imageInstance = queryElSelector(IMGAGE_BG);

/**
 * 控制显示上传元素
 * @param {*} isRender
 */
function isRenderUpload(isRender) {
  if (isRender) {
    uploadFileId.style.display = "block";
  } else {
    uploadFileId.style.display = "none";
  }
}

/**
 * 控制显示上传
 */
function uploadFile() {
  uploadFileId.click();
}

/**
 * 上传事件
 * @param {*} e
 */
function onChangeFile(e) {
  originFile = e.target.files[0];

  htmlFileToBase64(originFile).then((result) => {
    base64File = result;

    setAttributes(imageInstance, {
      src: base64File,
    });

    imageInstance = queryElSelector(IMGAGE_BG);

    createCropper(imageInstance);
    isRenderUpload(false);
  });
}

/**
 * 创建 corppper 实例
 * @param {*} el
 */
function createCropper(el) {
  cropperInstance = new Cropper(el, {
    viewMode: 0,
    minContainerWidth: 800,
    minContainerHeight: 800,
    maxContainerWidth: 800,
    maxContainerHeight: 800,
    dragMode: "move",
    preview: [queryElSelector(BLOCK_MODE), queryElSelector(ROUND_MODE)],
  });
}

function getCroppedPicture() {
  cropperInstance
    .getCroppedCanvas({
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "low", // “low” (默认值), “medium”, "high"中的
    })
    .toBlob((blob) => {
      htmlCompressImage(URL.createObjectURL(blob), {
        toType: "base64",
        quality: 0.8,
      }).then((res) => {
        setAttributes(queryElSelector("#result-image img"), {
          src: res,
        });
      });
    });
}
