# Description

基于 Comlink 实现浏览器多线程请求 oss 文件生成 zip 包的功能

## Installation

```bash
npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 实现

main.ts

```typescript
import * as Comlink from "comlink";
import * as FileSaver from "file-saver";


const worker = new Worker(new URL("worker.ts", import.meta.url), {
  type: "module",
});

// 使用 Comlink 包装
const getImagesZip = Comlink.wrap(worker) as unknown as any;

// ...

const blob = await getImagesZip(urlList);

FileSaver.saveAs(blob, "test.zip");

// ...
```

worker.ts

```typescript
import * as Comlink from "comlink";
import * as AdmZip from "adm-zip";
import { Buffer } from "buffer";

console.log("worker init");

const getImagesZip = async (list: string[]) => {
  const oss_prefix = "http://test-code-card.oss-cn-hongkong.aliyuncs.com/";
  const resizeAction = "?x-oss-process=image/resize,w_100";
  //@ts-ignore
  const zip = new AdmZip();
  await Promise.all(
    list.map(async (v) => {
      const [prefix, baseName] = v.split("/");

      const res = await fetch(oss_prefix + v, {
        method: "get",
      });
      const buffer = await res.arrayBuffer(); 

      zip.addFile(prefix + "/3x3/" + baseName, Buffer.from(buffer));

      const res2 = await fetch(oss_prefix + v + resizeAction, {
        method: "get",
      });
      const buffer2 = await res2.arrayBuffer();

      zip.addFile(prefix + "/2x2/" + baseName, Buffer.from(buffer2));
    })
  );

  return new Blob([zip.toBuffer()], { type: "application/octet-stream" });
};

Comlink.expose(getImagesZip);
```

## 参考 [Web 多线程开发利器 Comlink 的剖析与思考](https://www.cnblogs.com/cangqinglang/p/15791367.html)
