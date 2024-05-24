/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fs = require("fs/promises");
const { JavaManager } = require("../../dist/index.js");

const { Client, Authenticator } = require("minecraft-launcher-core");
const launcher = new Client();

const storePath = path.join(__dirname, "..", "java");

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
    javaPath: await jmgr.use("1.8.9"),
  };

  launcher.launch(opts);

  launcher.on("debug", (e) => console.log(e));
  launcher.on("data", (e) => console.log(e));
})();
