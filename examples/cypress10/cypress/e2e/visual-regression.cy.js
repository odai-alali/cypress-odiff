/// <reference types="cypress-odiff" />



describe("visual regression", () => {
  it("should compare screenshots", () => {
    cy.visit('https://example.cypress.io')
    cy.compareScreenshot({
      screenshotOptions: {
        capture: "viewport"
      }
    })
  });
});
