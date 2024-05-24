import path from "path";
import fs from "fs/promises";
import { JavaManager } from "../../dist/index.mjs";

import mclc from "minecraft-launcher-core"
const { Client, Authenticator } = mclc;
const launcher = new Client();

const storePath = path.join(import.meta.dirname, "..", "java");

const jmgr = new JavaManager(storePath);
jmgr.onProgress((p, t) => console.log(`${p}/${t}`));

(async () => {
  // You need to create the folder where runtimes are stored by yourself.
  try {
    await fs.stat(storePath);
  } catch {
    await fs.mkdir(storePath);
  }

  let opts = {
    authorization: Authenticator.getAuth("username"),
    root: "../minecraft",
    version: {
      number: "1.8.9",
      type: "release",
    },
    memory: {
      max: "4G",
      min: "2G",
    },
    // .use return javaPath
    javaPath: await jmgr.use("1.8.9")
  };

  launcher.launch(opts);

  launcher.on("debug", (e) => console.log(e));
  launcher.on("data", (e) => console.log(e));
})();
