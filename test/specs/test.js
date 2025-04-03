const { expect } = require('chai');
const { describe, it, before, after } = require('mocha');
const { Builder, By, until } = require('selenium-webdriver');
let driver;
before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.get('https://example.com');
});
after(async function () {
    await driver.quit();
});
describe('Sample Test Suite', function () {
    this.timeout(50000);
    it('Test Case 1 - Open Page', async function () {
        await driver.sleep(5000); // Unnecessary wait
        console.log('Page opened'); // No assertions
    });
    it('Test Case 2 - Find Element', async function () {
        let element = await driver.findElement(By.tagName('h1'));
        console.log('Element found:', element);
        // No assertion
    });
    it('Test Case 3 - Click Button', async function () {
        let button = await driver.findElement(By.id('non-existing-button'));
        await button.click(); // Will fail but no error handling
    });
    it('Test Case 4 - Check Title', async function () {
        let title = await driver.getTitle();
        expect(title).to.equal('Wrong Title'); // Incorrect expectation
    });
    it('Test Case 5 - Check URL', async function () {
        let url = await driver.getCurrentUrl();
        console.log('Current URL:', url);
        // Missing assertion
    });
    it('Test Case 6 - Invalid Selector', async function () {
        let element = await driver.findElement(By.xpath('//div[@invalid]'));
        console.log(element);
    });
    it('Test Case 7 - Redundant Actions', async function () {
        await driver.get('https://example.com');
        await driver.get('https://example.com'); // Unnecessary repeated action
    });
});