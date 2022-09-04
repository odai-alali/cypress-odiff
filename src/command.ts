import { ODiffOptions } from 'odiff-bin';
/// <reference types="cypress" />

import {ACTUAL_SUFFIX, DIFF_SUFFIX, EXPECTED_SUFFIX, TASK} from './constants'

export type CompareScreenshotOptions = {
  screenshotOptions?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.ScreenshotOptions>,
  compareOptions?: ODiffOptions,
  pluginOptions?: {
    customSnapshotsDir?: string
    updateSnapshots?: boolean,
    failOnExpectedMissing?: boolean
  }
}

export function addCompareScreenshotCommand(defaultScreenshotOptions: CompareScreenshotOptions = {
  pluginOptions: {
    customSnapshotsDir: "cypress/snapshots"
  }
}) {
  Cypress.Commands.add(
    'compareScreenshot',
    {prevSubject: 'optional'},
    (subject, options: CompareScreenshotOptions = {}) => {
      const specRelativPath = Cypress.spec.relative.replace(
        /^cypress\/(e2e|integrations)\//,
        ""
      );
      const screenshotTitle = Cypress.currentTest.titlePath.join(" -- ");
      const screenshotOptions = {
        ...defaultScreenshotOptions.screenshotOptions,
        ...options.screenshotOptions,
      };
      const compareOptions = {
        ...defaultScreenshotOptions.compareOptions,
        ...options.compareOptions,
      };
      const pluginOptions = {
        ...defaultScreenshotOptions.pluginOptions,
        ...options.pluginOptions,
      };
      const expectedScreenshotPath = `${pluginOptions.customSnapshotsDir}/${specRelativPath}/${screenshotTitle}${EXPECTED_SUFFIX}.png`;
      const actualScreenshotPath = `${pluginOptions.customSnapshotsDir}/${specRelativPath}/${screenshotTitle}${ACTUAL_SUFFIX}.png`;
      const diffScreenshotPath = `${pluginOptions.customSnapshotsDir}/${specRelativPath}/${screenshotTitle}${DIFF_SUFFIX}.png`;

      let screenshotPath;
      (subject ? cy.wrap(subject) : cy)
        .screenshot({
          ...screenshotOptions,
          onAfterScreenshot($el, props) {
            screenshotPath = props.path;
          },
        })
        .task(TASK.fileExists, expectedScreenshotPath)
        .then((fileExists) => {
          if (pluginOptions.updateSnapshots) {
            cy.task(TASK.copyFile, {
              from: screenshotPath,
              to: expectedScreenshotPath,
            });
          } else if (!fileExists) {
            if (
              pluginOptions.failOnExpectedMissing &&
              !pluginOptions.updateSnapshots
            ) {
              throw new Error("Expected image is missing");
            }
            cy.task(TASK.copyFile, {
              from: screenshotPath,
              to: expectedScreenshotPath,
            }).then((copyResult: true | string) => {
              if (copyResult !== true) {
                throw new Error(copyResult)
              }
            });
          } else {
            cy.task(TASK.copyFile, {
              from: screenshotPath,
              to: actualScreenshotPath,
            }).then(() => {
              cy.task(TASK.compare, {
                expectedScreenshotPath,
                actualScreenshotPath,
                diffScreenshotPath,
                compareOptions,
              }).then((result: true | string) => {
                if (result !== true) {
                  throw new Error(result);
                }
              });
            });
          }
        });
    }
  )
}

