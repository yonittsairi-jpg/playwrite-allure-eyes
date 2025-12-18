const { test } = require("@playwright/test");
const allure = require("allure-js-commons");
const { Eyes, Target, ClassicRunner } = require("@applitools/eyes-playwright");

const runner = new ClassicRunner();

test("playwright-allure-eyes", async ({ page }) => {
    const eyes = new Eyes(runner);
    const apiKey=process.env.APPLITOOLS_API_KEY
    if (!apiKey) {
        throw new Error('APPLITOOLS_API_KEY environment variable is not set!');
    }

    // Set the key configuration
    eyes.setApiKey(apiKey);
    await eyes.open(page, 'My App', 'Parallel Test');

    eyes.setApiKey(apiKey)
    try {
console.log('popopo')
        await page.goto("https://example.org");
        await eyes.check("Main Page", Target.window());

        // 1. Close Eyes & Get Results
        const results = await eyes.close(false);
        const rawResults = results.toJSON ? results.toJSON() : results;

        // -----------------------------------------------------------
        // FAST PARALLEL DOWNLOAD STRATEGY
        // -----------------------------------------------------------
        console.time("Image Download Time"); // Let's measure the speed

        // 2. Map every step to a Download Promise (Do not await inside the loop!)
        const downloadTasks = rawResults.stepsInfo.map(async (step, index) => {
            const stepName = step.name || `Step ${index + 1}`;

            // Decide URL: Diff if failed, Checkpoint if passed
            const url = step.isDifferent ? step.apiUrls.diffImage : step.apiUrls.checkpointImage;

            if (!url) return;

            try {
                // Fetch with Headers (Bypasses CORS because it's Node.js)
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'X-Eyes-Api-Key': apiKey,
                        'Accept': 'image/png'
                    }
                });

                if (response.ok) {
                    const arrayBuffer = await response.arrayBuffer();

                    // Attach immediately to Allure
                    await allure.attachment(
                        `${stepName} [${step.isDifferent ? "Mismatch - image diff is displayed" : "Pass - check point image is displayed"}]`,
                        Buffer.from(arrayBuffer),
                        "image/png"
                    );
                }
            } catch (err) {
                console.error(`Failed to download ${stepName}:`, err.message);
            }
        });

        // 3. Fire all downloads at once and wait for them to finish
        // This makes it as fast as the slowest single image download
        await Promise.all(downloadTasks);

        console.timeEnd("Image Download Time");
        // -----------------------------------------------------------

        if (results.getStatus() !== 'Passed') {
            throw new Error(`Visual differences found!`);
        }
        const applitoolsUrl = results.getUrl();

        //  Attach the URL to the Allure report using the standard 'link' or 'issue' API
        //    (Requires allure-playwright or allure-js-commons)
        await allure.link(applitoolsUrl, "Applitools Visual Results");
        //Add result json if needed
        // await allure.attachment(
        //     "Applitools Raw JSON",
        //     JSON.stringify(results, null, 2),
        //     "application/json"
        // );
        if (results.getStatus() !== 'Passed') {
            throw new Error(`Visual differences found! See details: ${applitoolsUrl}`);
        }
    } catch (error) {
        await eyes.abortIfNotClosed();
        throw error;
    }

});