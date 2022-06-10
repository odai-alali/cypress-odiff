import fs from "fs"
import path from 'path'
import { compare } from 'odiff-bin'

import {
  ACTUAL_SUFFIX,
  EXPECTED_SUFFIX,
  DIFF_SUFFIX
} from './constants'

let CYPRESS_SCREENSHOT_DIR
// let ALWAYS_GENERATE_DIFF

function setupScreenshotPath (config) {
  // use cypress default path as fallback
  CYPRESS_SCREENSHOT_DIR =
    (config || {}).screenshotsFolder || 'cypress/screenshots'
}

const SCREENSHOT_EXT = '.png'

declare type CompareResult = {
  match: boolean,
  reason?: "layout-diff" | "pixel-diff" | "file-not-exists",
  /** Amount of different pixels */
  diffCount?: number;
  /** Percentage of different pixels in the whole image */
  diffPercentage?: number;
  /** Errored file path */
  file?: string;
}

async function compareScreenshotsTask (args): Promise<true | string> {
  const actualAbsolutePath = path.join(CYPRESS_SCREENSHOT_DIR, args.actualScreenshotPath) + SCREENSHOT_EXT
  const expectedAbsolutePath = actualAbsolutePath.replace(ACTUAL_SUFFIX, EXPECTED_SUFFIX)
  const diffAbsolutePath = actualAbsolutePath.replace(ACTUAL_SUFFIX, DIFF_SUFFIX)
  if (fs.existsSync(expectedAbsolutePath)) {
    const compareResult: CompareResult = await compare(
      actualAbsolutePath,
      expectedAbsolutePath,
      diffAbsolutePath
    )
      switch (compareResult.reason) {
        case "layout-diff":
          return "Screenshots does not have the same layout"
        case "pixel-diff":
          return `Screenshots does not match. ${compareResult.diffCount} pixels difference (${compareResult.diffPercentage}%)`
        case "file-not-exists":
          return `File was not found ${compareResult.file}`
      }
  } else {
    fs.copyFileSync(actualAbsolutePath, expectedAbsolutePath)
  }
  return true
}

export function addCompareScreenshotPlugin (on, config) {
  setupScreenshotPath(config)
  on('task', {
    'odiff:compare': async (args) => compareScreenshotsTask(args)
  })
}

