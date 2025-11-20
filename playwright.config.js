require('dotenv').config();
const { devices, defineConfig } = require("@playwright/test");

export default defineConfig({
  testDir: "./test",
  reporter: [
    ["list"],
    [
      "allure-playwright",
      {
        resultsDir: "./out/allure-results",
        environmentInfo: {
          node_version: process.version,
        },
      },
    ],
  ],
    use: {
        screenshot: 'on', // Optional: helpful for allure reports
        video: 'retain-on-failure', // Optional
    },
  projects: [
    {
      name: "playwright-allure-eyes",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
