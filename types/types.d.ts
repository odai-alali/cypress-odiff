/// <reference types="cypress" />

declare type CompareScreenshotOptions = {
  name?: string,
  errorThreshold?: number
}

declare namespace Cypress {
  interface Chainable {
    compareScreenshot(options?: Partial<Cypress.ScreenshotOptions | CompareScreenshotOptions>): void;
  }
}
