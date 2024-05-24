export type Download = {
  sha1: string;
  size: string;
  url: string;
};

export type Runtimes = {
  [index: string]: {
    [index: string]: [{manifest: {url: string}}];
  };
};

export type RuntimeManifest = {
  files: {
    [index: string]: {
      type: "directory" | "file" | "link";
      executable?: boolean;
      target?: string;
      downloads: {
        lzma: Download;
        raw: Download;
      };
    };
  };
};

export type VersionManifest = {
  javaVersion: {
    component: string;
    majorVersion: number;
  };
};

export type VersionsManifest = {
  latest: {
    release: string;
    snapshot: string;
  };
  versions: { id: string; url: string }[];
};
