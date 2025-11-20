const { test } = require("@playwright/test");
const allure = require("allure-js-commons");
const { Eyes, Target, ClassicRunner } = require("@applitools/eyes-playwright");

const runner = new ClassicRunner();

test("fast parallel download test", async ({ page }) => {
    const eyes = new Eyes(runner);
    await eyes.open(page, 'My App', 'Parallel Test');
    const apiKey=process.env.API_KEY

    eyes.setApiKey(apiKey)
    try {

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
                        `${stepName} [${step.isDifferent ? "Mismatch" : "Pass"}]`,
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

    } catch (error) {
        await eyes.abortIfNotClosed();
        throw error;
    }
});