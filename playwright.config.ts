import { defineConfig, devices } from '@playwright/test';
import { on } from 'events';
import type { TestOptions } from './test-option';


require('dotenv').config(); //Таким чином, ми увімкнемо читання файлу env з файлової системи

export default defineConfig<TestOptions>({
  timeout: 40000, // Timeout for each test in milliseconds. Defaults to 30 seconds
  // globalTimeout: 60000,
  expect:{
    timeout: 2000,
    // toMatchSnapshot: {maxDiffPixels: 50}
  },

  fullyParallel: false,
  retries: 1,
  reporter: [
    process.env.CI ? ["dot"] : ["list"],
    [
      "@argos-ci/playwright/reporter",
      {
        uploadToArgos: !!process.env.CI,
        token: process.env.ARGOS_TOKEN,
      },
    ],
    ['json', {outputFile: 'test-results/jsonReporter.json'}],
    ['junit', {outputFile: 'test-results/junit.xml'}],
    // ['allure-playwright'],
    ['html']
  ],

  use: {
    trace: 'on-first-retry',
    // Capture screenshot after each test failure.
    screenshot: "only-on-failure",
    baseURL: 'http://localhost:4201/',
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
    // baseURL: process.env.DEV === '1' ? 'http://localhost:4201/' 
    //         : process.env.STAGING === '1' ? 'http://localhost:4202/'
    //         : 'http://localhost:4201/',

    actionTimeout: 20000, //Default timeout for each Playwright action in milliseconds, defaults to 0 (no timeout).
    navigationTimeout: 25000, //Timeout for each navigation action in milliseconds. Defaults to 0 (no timeout).
    video: { //Whether to record video for each test. Defaults to 'off'
      mode: 'off',
      size: { width: 1920, height: 1000 }
    }
  },

  projects: [
    {
      name: 'dev',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4202/'
      },
    },
    {
      name: 'chromium',
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox'
      },
    },
    {
      name: 'mobile',
      testMatch: 'testMobal.spec.ts',
      use: {
        ...devices['iPhone 13 Pro Max']
      }
    }
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4201/',
    timeout: 180000,  // 3 хвилини для CI (Angular довго компілюється)
    reuseExistingServer: !process.env.CI
  }
});