# JAVAMGR

A java runtime manager for minecraft launcher, allowing you to easily integrate java runtime with your launcher and make installation easier for your players.

**All you need to do is specify the minecraft version you intend to run, and javamgr will retrieve the corresponding java version.**

> Named after windows' task manager executable name : `taskmgr.exe`.

## Usage

### Basic usage

You can easily use javamgr with mclc to launch minecraft with correct java version:

```js
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fs = require("fs/promises");
const { JavaManager } = require("../../dist/index.cjs");

import mclc from "minecraft-launcher-core";
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
    javaPath: await jmgr.use("1.8.9"),
  };

  launcher.launch(opts);

  launcher.on("debug", (e) => console.log(e));
  launcher.on("data", (e) => console.log(e));
})();


```

### Examples

See [`examples/`](examples) for examples for commonjs/esm with or without [mclc](https://github.com/Pierce01/MinecraftLauncher-core).

## Useful informations

The runtimes are downloaded from the mojang server, which means they are the same as those in the official launcher.

Available runtimes are listed [here](https://launchermeta.mojang.com/v1/products/java-runtime/2ec0cc96c44e5a76b9c8b7c39df7210883d12871/all.json).

Api is documented on the [wiki](https://github.com/HerozDotExe/javamgr/wiki).

**I'm open to suggestions, of course.**
