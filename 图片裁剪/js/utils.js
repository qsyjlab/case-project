/**
 * html file to base64
 * @param {File} file
 * @returns
 */
function htmlFileToBase64(file) {
  const fileRender = new FileReader();

  return new Promise((resolve, reject) => {
    if (!file) resolve(null);
    try {
      fileRender.readAsDataURL(file);

      fileRender.onload = () => {
        if (fileRender.result) {
          resolve(fileRender.result);
        } else {
          resolve(null);
        }
      };
    } catch (err) {
      console.warn(err);

      reject(err);
    }
  });
}

/**
 *  blob to base64
 * @param {*} blob
 * @returns
 */

function htmlBlobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      resolve(e.target.result);
    };
    fileReader.readAsDataURL(blob);
    fileReader.onerror = (err) => {
      reject(err);
    };
  });
}

/**
 * 压缩图片
 * @param {*} url
 * @returns
 */
function htmlCompressImage(url, options = {}) {
  const { toType = "blob", imageType = "image/jpeg", quality = 1 } = options;

  return new Promise((resolve, reject) => {
    const canvasInstance = document.createElement("canvas");
    const imageObject = document.createElement("img");
    const canvas2DInstance = canvasInstance.getContext("2d");

    imageObject.src = url;

    imageObject.onerror = (err) => {
      reject(err);
    };

    imageObject.onload = () => {
      canvasInstance.width = imageObject.width;
      canvasInstance.height = imageObject.height;

      canvas2DInstance.clearRect(0, 0, imageObject.width, imageObject.height);

      canvas2DInstance.drawImage(
        imageObject,
        0,
        0,
        imageObject.width,
        imageObject.height
      );

      if (toType === "blob") {
        resolve(canvasInstance.toDataURL(imageType, quality));
      } else if (toType === "base64") {
        resolve(canvasInstance.toDataURL(imageType, quality));
      } else {
        reject(null);
      }
    };
  });
}
