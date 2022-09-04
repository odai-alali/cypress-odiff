/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />

import {addCompareScreenshotPlugin} from "./plugin"
import {addCompareScreenshotCommand, CompareScreenshotOptions} from "./command"

declare global {
  namespace Cypress {
    interface Chainable {
       compareScreenshot(options?: Partial<Cypress.ScreenshotOptions | CompareScreenshotOptions>): void;
    }
  }
}


export {
  addCompareScreenshotPlugin,
  addCompareScreenshotCommand
}
