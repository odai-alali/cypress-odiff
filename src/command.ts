/* eslint-disable no-undef */
import { ACTUAL_SUFFIX } from './constants'

const cypressScreenshotOptions = {
  log: true,
  blackout: [],
  capture: 'fullPage', // 'viewport', 'runner',
  clip: null, // { x: 0, y: 0, width: 100, height: 100 },
  disableTimersAndAnimations: true,
  padding: null,
  scale: false,
  overwrite: true,
  onBeforeScreenshot: null,
  onAfterScreenshot: null
}

declare type CompareSnapshotOptions = {
  name?: string,
  errorThreshold?: number
}

declare global {
  namespace Cypress {
    interface Chainable {
      compareSnapshot(options?: Partial<Cypress.ScreenshotOptions | CompareSnapshotOptions> ): void;
    }
  }
}

export function addCompareSnapshotCommand (defaultScreenshotOptions) {
  Cypress.Commands.add(
    'compareSnapshot',
    { prevSubject: 'optional' },
    (subject, name, params = {}) => {
      cy.log('>> Compare Snapshot')
      cy.log('>> Take a screenshot')

      const screenshotPath = `${Cypress.spec.relative}/${Cypress.currentTest.title}${ACTUAL_SUFFIX}`
        .replace(/^cypress\/e2e\//, '')

      cy.log('>>> Screenshot Path: ' + screenshotPath)

      const screenshotOptions = {
        ...cypressScreenshotOptions,
        ...defaultScreenshotOptions
      }
      cy.screenshot(screenshotPath, screenshotOptions)
        .task('odiff:compare', {
          actualScreenshotPath: screenshotPath
        }).then((result: true | string) => {
        if (result !== true) {
          throw new Error(result)
        }
      })
    }
  )
}

