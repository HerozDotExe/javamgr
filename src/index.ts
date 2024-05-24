import type { RuntimeManifest, Runtimes } from "./types.ts";
import fs from "fs/promises";
import { join } from "path";
import { download, fs_exists, getComponent, getJSON, getOS } from "./utils.ts";
import { hash } from "node:crypto";

export * from "./types.ts";
export { getComponent } from "./utils.ts";

const defaultExecutable = process.platform === "win32" ? "java.exe" : "java";

/**
 * Initialize a java manager instance, taking as input the path to the folder storing the runtimes. In the following documentation, a "store" refers to the folder where runtimes are stored.
 */
export class JavaManager {
  path: string;
  private runtimes?: Runtimes;
  private progressCallback?: (progress: number, total: number) => void;

  constructor(path: string) {
    this.path = path;
  }

  private async checkForStore() {
    if (!(await fs_exists(this.path))) {
      throw new Error("Store folder doesn't exist : " + this.path);
    }
  }

  private async getRuntimes() {
    if (!this.runtimes) {
      this.runtimes = await getJSON(
        "https://launchermeta.mojang.com/v1/products/java-runtime/2ec0cc96c44e5a76b9c8b7c39df7210883d12871/all.json"
      );
    }

    return this.runtimes;
  }

  /**
   * Install a runtume by component.
   */
  async install(component: string) {
    await this.checkForStore();

    const destination = join(this.path, component);
    if (await fs_exists(destination)) {
      return;
    } else await fs.mkdir(destination);

    const runtime = await getJSON<RuntimeManifest>(
      (
        await this.getRuntimes()
      )[getOS()][component][0].manifest.url
    );

    let progress = 0;
    const total = Object.keys(runtime.files).length;
    if (this.progressCallback) this.progressCallback(progress, total);
    for (const key in runtime.files) {
      if (Object.prototype.hasOwnProperty.call(runtime.files, key)) {
        const file = runtime.files[key];
        const fileDestination = join(destination, key);

        switch (file.type) {
          case "directory":
            await fs.mkdir(fileDestination);
            break;
          case "file":
            await download(file.downloads.raw.url, fileDestination);
            break;
          case "link":
            await fs.writeFile(fileDestination, `Please see ${file.target}`);
            break;
        }

        progress++;

        if (this.progressCallback) this.progressCallback(progress, total);
      }
    }

    if (process.platform !== "win32") {
      console.log(process.platform, process.platform !== "win32")
      // Java executable seems read/write locked
      await fs.chmod(join(destination, "bin", "java"), 0o777);
    }
  }

  /**
   * Delete a runtime by component.
   */
  async uninstall(component: string) {
    await this.checkForStore();

    const target = join(this.path, component);
    if (await fs_exists(target)) {
      await fs.rm(target, { recursive: true });
    }
  }

  /**
   * Returns an array of component strings, essentially fs.readdir on the store path.
   */
  async list() {
    return await fs.readdir(this.path);
  }

  /**
   * Calls .install with the corresponding Minecraft version and returns the path to the executable. On Windows, you can define the executable as javaw to hide the console.
   */
  async use(mcVersion: string, executable = "java") {
    await this.checkForStore();

    const component = await getComponent(mcVersion);
    const destination = join(this.path, component);

    if (await fs_exists(destination)) {
      return join(destination, "bin", executable);
    }

    await this.install(component);

    return join(destination, "bin", executable || defaultExecutable);
  }

  /**
   * Define the callback function called each time a file is downloaded.
   */
  onProgress(cb: (progress: number, total: number) => void) {
    this.progressCallback = cb;
  }

  /**
   * Compares runtime files with mojang api checksums; if a file doesn't match, it's downloaded again.
   */
  async checkIntegrity(component: string) {
    await this.checkForStore();

    const target = join(this.path, component);
    if (!(await fs_exists(target))) {
      return;
    }

    const runtime = await getJSON<RuntimeManifest>(
      (
        await this.getRuntimes()
      )[getOS()][component][0].manifest.url
    );

    let progress = 0;
    const total = Object.keys(runtime.files).length;
    if (this.progressCallback) this.progressCallback(progress, total);
    for (const key in runtime.files) {
      if (Object.prototype.hasOwnProperty.call(runtime.files, key)) {
        const file = runtime.files[key];
        const fileTarget = join(target, key);

        if (!(await fs_exists(fileTarget))) {
          await download(file.downloads.raw.url, fileTarget);
        } else {
          if (file.type === "file") {
            const fileTargetHash = hash("sha1", await fs.readFile(fileTarget));
            if (fileTargetHash !== file.downloads.raw.sha1) {
              console.log(fileTarget);
              await download(file.downloads.raw.url, fileTarget);
            }
          }
        }

        progress++;

        if (this.progressCallback) this.progressCallback(progress, total);
      }
    }

    // If java executable was faulty, set execute permissions
    await fs.chmod(join(target, "bin", "java"), 0o777);
  }
}