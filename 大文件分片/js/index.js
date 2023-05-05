const uploadFileDom = document.getElementById("uploadFile");

function calFileMd5Fn(chunks, progressCallbackFn) {
  return new Promise((resolve, reject) => {
    let currentChunk = 0; // 准备从第0块开始读
    let spark = new SparkMD5.ArrayBuffer(); // 实例化SparkMD5用于计算文件hash值
    let fileReader = new FileReader(); // 实例化文件阅读器用于读取blob二进制文件
    fileReader.onerror = reject; // 兜一下错
    fileReader.onload = (e) => {
      if (typeof progressCallbackFn === "function") {
        progressCallbackFn(Math.ceil((currentChunk / chunks.length) * 100)); // 抛出一个函数，用于告知进度
      }

      spark.append(e.target.result); // 将二进制文件追加到spark中（官方方法）
      currentChunk = currentChunk + 1; // 这个读完就加1，读取下一个blob
      // 若未读取到最后一块，就继续读取；否则读取完成，Promise带出结果
      if (currentChunk < chunks.length) {
        fileReader.readAsArrayBuffer(chunks[currentChunk]);
      } else {
        resolve(spark.end()); // resolve出去告知结果 spark.end官方api
      }
    };
    // 文件读取器的readAsArrayBuffer方法开始读取文件，从blob数组中的第0项开始
    fileReader.readAsArrayBuffer(chunks[currentChunk]);
  });
}

uploadFileDom.addEventListener("change", (e) => {
  console.log("asdasd", e.target.files);

  console.time('start')

  const file = e.target.files[0];
  function sliceFn(file, chunkSize = 1 * 1024 * 1024) {
    const result = [];
    // 从第0字节开始切割，一次切割1 * 1024 * 1024字节
    for (let i = 0; i < file.size; i = i + chunkSize) {
      result.push(file.slice(i, i + chunkSize));
    }
    return result;
  }
  const chunks = sliceFn(file);
  calFileMd5Fn(chunks).then((res) => {
    console.log("res", res);
    console.timeEnd('start')
  });

  console.log("chunks", chunks);

});

console.log("uploadFileDom", uploadFileDom);
