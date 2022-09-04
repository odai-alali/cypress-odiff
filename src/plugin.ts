import fs from "fs"
import path from 'path'
import {compare} from 'odiff-bin'

import {
  TASK
} from './constants'

type MatchResult = { match: true }
type LayoutDiffResult =  { match: false; reason: "layout-diff" }
type PixelDiffResult = {
      match: false;
      reason: "pixel-diff";
      /** Amount of different pixels */
      diffCount: number;
      /** Percentage of different pixels in the whole image */
      diffPercentage: number;
    }
type FileNotExistResult = {
      match: false;
      reason: "file-not-exists";
      /** Errored file path */
      file: string;
    }
type NoMatchResult = LayoutDiffResult | PixelDiffResult | FileNotExistResult


async function fileExists(filePath) {
  const absoluteFilePath = path.join(
    process.cwd(),
    filePath
  );
  return fs.existsSync(absoluteFilePath);
}

async function copyFile(args) {
  try {
    const absoluteToPath = path.join(
      process.cwd(),
      args.to
    );
    fs.mkdirSync(path.dirname(absoluteToPath), {recursive: true})
    fs.renameSync(args.from, absoluteToPath);
  } catch (error) {
    return error.message;
  }
  return true;
}

async function compareScreenshotsTask(args) {
  // const shouldUpdateSnapshots = args.updateSnapshots;
  const expectedAbsolutePath = path.join(
    process.cwd(),
    args.expectedScreenshotPath
  );
  const actualAbsolutePath = path.join(
    process.cwd(),
    args.actualScreenshotPath
  );
  const diffAbsolutePath = path.join(
    process.cwd(),
    args.diffScreenshotPath
  );
  const compareResult = await compare(
    actualAbsolutePath,
    expectedAbsolutePath,
    diffAbsolutePath,
    args.compareOptions
  );
  if (compareResult.match) {
    return true;
  }
  switch ((compareResult as NoMatchResult).reason) {
    case "layout-diff":
      return "Screenshots does not have the same layout";
    case "pixel-diff":
      return `Screenshots does not match. ${(compareResult as PixelDiffResult).diffCount} pixels difference (${(compareResult as PixelDiffResult).diffPercentage}%)`;
    case "file-not-exists":
      return `File was not found ${(compareResult as FileNotExistResult).file}`;
  }
  return "Unknown Error: match failed without reason";
}

export function addCompareScreenshotPlugin(on, config) {
  on('task', {
    [TASK.compare]: async (args) => compareScreenshotsTask(args),
    [TASK.fileExists]: async (args) => fileExists(args),
    [TASK.copyFile]: async (args) => copyFile(args),
  })
}

