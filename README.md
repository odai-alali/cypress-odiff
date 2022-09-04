# Cypress ODiff

A plugin for adding visual regression test to [Cypress](https://cypress.io) using [ODiff](https://github.com/dmtrKovalenko/odiff) _The fastest pixel-by-pixel image visual difference tool in the world_.

## Why?

ODiff [Benchmarks](https://github.com/dmtrKovalenko/odiff#benchmarks) are the main motivation for this. 🚀

## Getting Started

Install:

```sh
$ npm install cypress-odiff
```

Add the plugin

```js
const { addCompareScreenshotPlugin } = require('cypress-odiff')

module.exports = defineConfig({
  trashAssetsBeforeRuns: false, // needed to avoid deleting expeted screenshot
  e2e: {
    setupNodeEvents (on, config) {
      addCompareScreenshotPlugin(on, config)
    }
  }
})
```

Add the command in support/commands.js

```js
const { addCompareScreenshotCommand } = require('cypress-odiff')

addCompareScreenshotCommand({})
```

## Using in Tests

Given the following test case under `cypress/e2e/example.cy.js`

```js
describe('example', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
    cy.compareScreenshot()
  })
})
```

the command `compareScreenshot` will:
- create a screenshot (expected) under `cypress/screenshots/example.cy.js/passes.png` and save it for further runs
- if the screenshot is already created, the command will compare the recorded screenshot (actual) with the previously saved one (expected) and fail if there is a difference between these two screenshots. An image with the highlighted differences (diff) will be created.

## Options

`compareScreenshot` accepts an options object with the following keys:
- **screenshotOptions**: will be passed to `cy.screenshot()` command to capture screenshot. see Cypress `screenshot` options [docs](https://docs.cypress.io/api/commands/screenshot#Arguments).
- **compareOptions**: will be passed to `compare` method from []() package. see [ODiff Nodejs](https://github.com/dmtrKovalenko/odiff#nodejs-1).
- **pluginOptions**: These options define how this plugin should behave.

### Plugin Options
| name | default | |
|---|---|---|
| `customSnapshotsDir` | `"cypress/snapshots"` | should be under cypress directory. `.expected`, `.actual`, `.diff` screenshots will be saved under this path. |
| `updateSnapshots` | `undefined` | if `true`, plugin will save the screenshot with `.expected` suffix and this image will be used for furthur visual regressions tests |
| `failOnExpectedMissing` | `undefined` | if `true` the test will fail when `.expected` screenshot does not exist. This is particulary usefull when running test on ci.|
