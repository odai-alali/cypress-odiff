import {ACTUAL_SUFFIX, SCREENSHOT_EXT} from './constants'

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

export function addCompareScreenshotCommand(defaultScreenshotOptions) {
  Cypress.Commands.add(
    'compareScreenshot',
    {prevSubject: 'optional'},
    () => {
      const actualScreenshotPath = `${Cypress.spec.relative}/${Cypress.currentTest.title}${ACTUAL_SUFFIX}${SCREENSHOT_EXT}`
        .replace(/^cypress\/e2e\//, '')

      const screenshotOptions = {
        ...cypressScreenshotOptions,
        ...defaultScreenshotOptions
      }
      let screenshotPath = 'sss'
      cy.screenshot({
        ...screenshotOptions,
        onAfterScreenshot($el, props) {
          screenshotPath = props.path
        }
      }).then(() => {
        cy.task('odiff:compare', {
          screenshotPath,
          actualScreenshotPath
        }).then((result: true | string) => {
          if (result !== true) {
            throw new Error(result)
          }
        })
      })

    }
  )
}

