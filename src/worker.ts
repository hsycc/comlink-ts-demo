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
