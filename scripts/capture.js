const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Set 2x scale for retina-like screenshots

        const url = 'http://localhost:3000/event/boda-ana-luis-2026'; // Demo event
        console.log(`Navigating to ${url}...`);

        // --- DESKTOP ---
        await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
        await page.goto(url, { waitUntil: 'networkidle0' });

        console.log('Capturing Desktop Home...');
        await page.screenshot({ path: 'public/screenshots/desktop-home.png' });

        // --- MOBILE ---
        console.log('Switching to mobile viewport...');
        await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
        // await page.reload({ waitUntil: 'networkidle0' });

        // Small delay for layout
        await new Promise(r => setTimeout(r, 1000));

        console.log('Capturing Mobile Home...');
        await page.screenshot({ path: 'public/screenshots/mobile-home.png' });

        // --- INTERACTION ---
        console.log('Opening FAB menu...');
        // The FAB main button is the one with the Plus icon, last in the fixed container
        const fabButton = await page.$('div.fixed.bottom-6.right-6 > button');

        if (fabButton) {
            await fabButton.click();
            // Wait for animation
            await new Promise(r => setTimeout(r, 600));
            console.log('Capturing Mobile Menu...');
            await page.screenshot({ path: 'public/screenshots/mobile-menu.png' });
        } else {
            console.error('FAB button not found');
        }

        await browser.close();
        console.log('Screenshots saved to public/screenshots/');
    } catch (err) {
        console.error('Error taking screenshots:', err);
        process.exit(1);
    }
})();
