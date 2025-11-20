// const { test, request} = require("@playwright/test");
// const allure = require("allure-js-commons");
// // 1. Import Applitools classes
// const { Eyes, Target, ClassicRunner } = require("@applitools/eyes-playwright");
//
// // 2. Create a runner (manages the test execution)
// const runner = new ClassicRunner();
//
// test("sample test1", async ({ page }) => {
//     // 3. Initialize Eyes for this specific test
//     // await allure.suite("My Custom Suite1");
//     const eyes = new Eyes(runner);
//
//     // Optional: Set your API Key here if not set in environment variables
//     // eyes.setApiKey('YOUR_APPLITOOLS_API_KEY');
//
//     try {
//         // 4. Start the visual test
//         // Arguments: (driver, AppName, TestName)
//         await eyes.open(page, 'My Allure App', 'Sample Allure Test');
//
//         await allure.links(...[{ url: "https://example.org"}]);
//         await allure.owner("John Doe");
//         await allure.issue("JIRA-2", "https://example.org");
//
//         // Navigate to the page you want to test
//         await page.goto("https://example.org");
//
//         await allure.step("step 1", async () => {
//             await allure.step("step 1.2", async () => {
//                 await allure.attachment("text attachment", "some data", "text/plain");
//
//                 // 5. Take a visual snapshot (Check) inside the step
//                 // This captures the state of the page at this specific moment
//                  await eyes.check("Step 1.2 Visual Check", Target.window());
//             });
//         });
//
//         await allure.step("step 2", async () => {
//             await page.getByText("Learn more").click();
//             // You can add another check here if the UI changes
//             await eyes.check("Step 2 Visual Check", Target.window());
//         });
//
//         // 6. End the visual test
//         const results = await eyes.close(false);
//
//         // 1. We need the API key to authorize the image view
//         // (Assuming you are using the raw JSON object you pasted earlier)
//         // If 'results' is the SDK object, use: results.toJSON() first.
//         const rawResults = results.toJSON ? results.toJSON() : results;
//         const apiKey = "0touVLz5DT7lGWD3Sy100lXx6c6vEtjVlJ26k83eelCHY110"
//
//         for (const [index, step] of rawResults.stepsInfo.entries()) {
//             const stepName = step.name || `Step ${index + 1}`;
//
//             // Deciding which image to download (Diff if failed, Checkpoint if passed)
//             const imageUrl = step.isDifferent ? step.apiUrls.diffImage : step.apiUrls.checkpointImage;
//
//             if (imageUrl) {
//                 console.log(`Downloading image for: ${stepName}...`);
//                 const requestOptions = {
//                     method: "GET",
//                     headers: { 'X-Eyes-Api-Key': apiKey, // <--- Your specific header requirement
//                         'Content-Type': 'application/json'},
//                     redirect: "follow"
//                 };
//
//
//                 const response = fetch("https://eyesapi.applitools.com/api/sessions/batches/00000251638664212268/00000251638664212152/steps/1/images/checkpoint", requestOptions)
//                     .then((response) => response.text())
//                     .then((result) => console.log(result)
//                     )
//                     .catch((error) => console.error(error));
//
//
//
//
//                 if (response.ok) {
//                     // 4. Convert ArrayBuffer to Buffer (Required for Allure)
//                     const arrayBuffer = await response.arrayBuffer();
//                     const imageBuffer = Buffer.from(arrayBuffer);
//
//                     // 5. Attach to Allure
//                     await allure.attachment(
//                         `${stepName} [${step.isDifferent ? "Diff" : "Checkpoint"}]`,
//                         imageBuffer,
//                         "image/png"
//                     );
//
//                 } else {
//                     console.error(`Failed to download image for ${stepName}: ${response.status()}`);
//                 }
//             }
//         }
//         const applitoolsUrl = results.getUrl();
//
//         // 3. Attach the URL to the Allure report using the standard 'link' or 'issue' API
//         //    (Requires allure-playwright or allure-js-commons)
//         await allure.link(applitoolsUrl, "Applitools Visual Results");
//         await allure.attachment(
//             "Applitools Raw JSON",
//             JSON.stringify(results, null, 2),
//             "application/json"
//         );
//         // 4. Now manually fail the test if Applitools found differences
//         if (results.getStatus() !== 'Passed') {
//             throw new Error(`Visual differences found! See details: ${applitoolsUrl}`);
//         }
//
//
//     } catch (error) {
//         // 7. Handle errors and ensure eyes are closed if test fails
//         await eyes.abortIfNotClosed();
//         console.error(error);
//     }
// });