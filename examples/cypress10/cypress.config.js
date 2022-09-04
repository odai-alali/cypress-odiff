const { defineConfig } = require("cypress");
const { addCompareScreenshotPlugin } = require('cypress-odiff')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      addCompareScreenshotPlugin(on, config)
    },
  },
});
