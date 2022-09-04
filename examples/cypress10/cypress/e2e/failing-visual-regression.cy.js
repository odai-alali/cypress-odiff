/// <reference types="cypress-odiff" />



describe("visual regression", () => {

  Cypress.on('fail', (err, runnable) => {
    const expectedErrors = [
      "Screenshots does not match. 1251 pixels difference (0.0715675057208%)",
      "Expected image is missing"
    ]
    if (!expectedErrors.includes(err.message)) {
      throw err
    }
  })
  it("should fail when expected screenshot is missing", () => {

    cy.visit('https://example.cypress.io')
    cy.wait(1000)
    cy.compareScreenshot({
      screenshotOptions: {
        capture: "viewport"
      },
      pluginOptions:{
        failOnExpectedMissing: true
      }
    })
  })

  it("should fail when diff is detected", () => {

    cy.visit('https://example.cypress.io')
    cy.wait(1000)
    cy.compareScreenshot({
      screenshotOptions: {
        capture: "viewport"
      },
    })
  })


});
