

# Playwright + Allure + Applitools Eyes

> A robust example project demonstrating how to integrate **Applitools Visual AI** testing with **Playwright** and embed the results directly into **Allure Reports**.

## 📚 Overview

This project combines three powerful tools:

1.  **Playwright:** For fast, reliable end-to-end browser automation.
2.  **Applitools Eyes:** To perform AI-powered visual assertions (more stable than pixel-matching).
3.  **Allure Report:** To visualize test results, steps, and attach the Applitools visual diffs directly in the report.

## 🚀 Getting Started

### 1\. Prerequisites

Ensure you have the following installed:

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* An [Applitools Account](https://auth.applitools.com/users/register) (to get your API Key)

### 2\. Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### 3\. Configuration (.env)

You must configure your Applitools API key for the visual tests to work.

1.  Create a file named `.env` in the root directory.
2.  Add your API key:

<!-- end list -->

```properties
# .env file
APPLITOOLS_API_KEY=your_api_key_here
```

*(Note: Ensure `.env` is in your `.gitignore` file so you don't push secrets to GitHub)*

-----

## 🛠 Usage

This project includes several helper scripts to run tests and view reports easily.

| Command | Description |
| :--- | :--- |
| **`npm run runlivetest`** | **(Recommended)** Runs the tests and immediately opens the Allure report in your browser. |
| `npm test` | Runs the Playwright tests without generating the report immediately. |
| `npm run clean-report` | Generates a static HTML folder (`allure-report`) and cleans previous history. |

### Running the full workflow

To run the test and see the results instantly:

```bash
npm run runlivetest
```
<img alt="image in report" src="/images/img.png">
<img alt="link to applitools dachboard" src="/images/img_1.png">
-----

## 📊 What to expect in the Report

When you open the Allure report, navigating to a test case will show:

* **Steps:** Detailed Playwright actions.
* **Visual Checks:** Applitools checkpoints.
* **Attachments:** If configured, you will see the actual screenshots or links to the Applitools Dashboard directly within the test steps or attachments section.

-----

## 🔗 References & Documentation

* **Allure:** [Documentation](https://allurereport.org/docs/) | [Discussions](https://github.com/orgs/allure-framework/discussions)
* **Playwright:** [Official Docs](https://playwright.dev/)
* **Applitools:** [Eyes SDK for Playwright](https://www.google.com/search?q=https://applitools.com/docs/api-ref/header/sdk-references/playwright-js.html)

-----

*Generated Report Example: [https://allure-examples.github.io/playwright-npm-cjs-js](https://allure-examples.github.io/playwright-npm-cjs-js)*
