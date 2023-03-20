import * as Comlink from "comlink";
import * as FileSaver from "file-saver";

const urlList = [
  "e88e6485-f53f-40de-9eb8-d696ac726c73/1_pbh_3x3.tif",
  "e88e6485-f53f-40de-9eb8-d696ac726c73/2_pbh_3x3.tif",
  "e88e6485-f53f-40de-9eb8-d696ac726c73/3_pbh_3x3.tif",
  "e88e6485-f53f-40de-9eb8-d696ac726c73/4_pbh_3x3.tif",
  //...
];

const button = document.querySelector("#btn") as HTMLButtonElement;
const time = document.querySelector("#time") as HTMLElement;
const timeConsuming = document.querySelector("#time-consuming") as HTMLElement;


const worker = new Worker(new URL("worker.ts", import.meta.url), {
  type: "module",
});

// 使用 Comlink 包装
const getImagesZip = Comlink.wrap(worker) as unknown as any;
 
// 点击触发下载
async function download() {
    timeConsuming.innerHTML = '-'

    const startTime = Date.now()

  button.disabled = true;

  // 生成 zip 文档的 blob 数据
  const blob = await getImagesZip(urlList);


  FileSaver.saveAs(blob, "test.zip");

  button.disabled = false;

  timeConsuming.innerHTML = Date.now() - startTime + 'ms'
  
}

button.addEventListener("click", download);

// 观察时间是否卡顿
setInterval(() => {
  time.innerHTML = new Date().toLocaleTimeString();
}, 1000);
