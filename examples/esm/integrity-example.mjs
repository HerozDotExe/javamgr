import path from "path";
import fs from "fs/promises";
import { JavaManager, getComponent } from "../../dist/index.mjs";
import { execSync } from "child_process";

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

  // .use return javaPath
  const executablePath = await jmgr.use("1.8.9");
  console.log("Java executable path : " + executablePath);

  // .use doesn't need getComponent but everything else does
  await jmgr.checkIntegrity(await getComponent("1.8.9"));

  execSync(executablePath + " -version");
})();
