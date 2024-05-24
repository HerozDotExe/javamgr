import fs from "fs/promises";
import { createWriteStream } from "fs";
import { Writable } from "stream";
import type { VersionManifest, VersionsManifest } from "./types.ts";

export async function fs_exists(path: string) {
  try {
    await fs.stat(path);
    return true;
  } catch {
    return false;
  }
}

export async function getJSON<T>(url: string): Promise<T> {
  return await (await fetch(url)).json();
}

export async function download(url: string, destination: string) {
  const response = await fetch(url);
  const stream = Writable.toWeb(createWriteStream(destination));

  if (response.ok && response.body) {
    await response.body.pipeTo(stream);
  } else
    throw new Error(`Couldn't download (HTTP CODE ${response.status}): ${url}`);
}

export function getOS() {
  switch (process.platform) {
    case "linux": {
      switch (process.arch) {
        case "ia32":
          return "linux-i386";
        case "x64":
          return "linux";
        default:
          throw new Error("Unsupported arch");
      }
    }
    case "win32": {
      switch (process.arch) {
        case "arm64":
          return "windows-arm64";
        case "ia32":
          return "windows-x86";
        case "x64":
          return "windows-x64";
        default:
          throw new Error("Unsupported arch");
      }
    }
    case "darwin": {
      switch (process.arch) {
        case "arm64":
          return "macos-arm64";
        case "x64":
          return "macos";
        default:
          throw new Error("Unsupported arch");
      }
    }
    default:
      throw new Error("Unsupported operating system");
  }
}

/**
 * Returns the component associated with the input minecraft version. Needed for any function other that .use
 */
export async function getComponent(mcVersion: string): Promise<string> {
  const versions = (
    await getJSON<VersionsManifest>(
      "https://launchermeta.mojang.com/mc/game/version_manifest_v2.json"
    )
  ).versions;

  const versionManifestURL = versions.find(
    (version) => version.id === mcVersion
  )?.url;
  if (!versionManifestURL) throw new Error(`${mcVersion} doesn't exist.`);

  const versionManifest = await getJSON<VersionManifest>(versionManifestURL);
  let component = versionManifest.javaVersion?.component;

  if (!component) {
    console.warn(
      "Versions near 1.6.3 miss java informations, assuming java 8 is needed. This can be ignored."
    );
    component = "jre-legacy";
  }

  return component;
}
