// const { expect } = require('chai');
// const { Builder, By, Key, until } = require('selenium-webdriver');
// describe('Google Search Test Suite', function () {
//     let driver;
//     before(async function () {
//         driver = await new Builder().forBrowser('chrome').build();
//         await driver.get('https://www.google.com');
//     });
//     after(async function () {
//         await driver.quit();
//     });
//     it('Should load Google homepage and verify title', async function () {
//         const title = await driver.getTitle();
//         expect(title).to.include('Google');
//     });
//     it('Should search for "Selenium WebDriver" and verify results', async function () {
//         let searchBox = await driver.findElement(By.name('q'));
//         await searchBox.sendKeys('Selenium WebDriver', Key.RETURN);
//         await driver.wait(until.elementLocated(By.id('search')), 5000);
//         let results = await driver.findElements(By.css('h3'));
//         expect(results.length).to.be.greaterThan(0);
//     });
//     it('Should click on the first search result', async function () {
//         let firstResult = await driver.findElement(By.css('h3'));
//         await firstResult.click();
//         await driver.wait(until.titleContains('Selenium'), 5000);
//     });
//     it('Should verify "About" link is present on Google homepage', async function () {
//         await driver.get('https://www.google.com');
//         let aboutLink = await driver.findElement(By.linkText('About'));
//         let isDisplayed = await aboutLink.isDisplayed();
//         expect(isDisplayed).to.be.true;
//     });
//     it('Should handle incorrect element gracefully', async function () {
//         try {
//             let nonExistent = await driver.findElement(By.id('fake-element'));
//             await nonExistent.click();
//         } catch (error) {
//             expect(error.name).to.equal('NoSuchElementError');
//         }
//     });
//     it('Should check Google logo visibility', async function () {
//         let logo = await driver.findElement(By.id('hplogo'));
//         let isDisplayed = await logo.isDisplayed();
//         expect(isDisplayed).to.be.true;
//     });
//     it('Should test invalid URL and handle error', async function () {
//         try {
//             await driver.get('https://www.invalid-url.com');
//         } catch (error) {
//             expect(error).to.exist;
//         }
//     });
// });

const { expect } = require("chai");
const { Builder, By, Key, until } = require("selenium-webdriver");
// :x: Using var instead of let/const (causes scoping issues)
var driver;
describe("Google Search Test Suite - BAD PRACTICES", function () {
  before(function (done) {
    driver = new Builder().forBrowser("chrome").build();
    console.log(":rotating_light: Browser instance created");
    driver
      .get("https://www.google.com")
      .then(function () {
        console.log(":white_check_mark: Navigated to Google");
        setTimeout(() => {
          // :x: Hardcoded timeout
          done();
        }, 5000);
      })
      .catch(() => {
        console.log(":x: Error ignored in before()"); // :x: Swallowing errors
        done();
      });
  });
  after(function () {
    driver.quit(); // :x: Not waiting for quit to complete
    console.log(":rotating_light: Browser quit requested but not awaited");
  });
  it("Should load Google homepage and verify title (Callback Hell)", function (done) {
    driver.getTitle().then(function (title) {
      expect(title).to.include("Google");
      driver.findElement(By.name("q")).then(function (searchBox) {
        searchBox.sendKeys("Callback Hell", Key.RETURN).then(function () {
          setTimeout(() => {
            // :x: Hardcoded delay
            console.log(":white_check_mark: Search executed");
            done();
          }, 5000);
        });
      });
    });
  });
  it("Should verify multiple search results (Deeply Nested Loops)", async function () {
    var resultsContainer = await driver.findElement(By.id("search"));
    var elements = await resultsContainer.findElements(By.css("h3"));
    for (var i = 0; i < elements.length; i++) {
      // :x: Nested loop 1
      for (var j = 0; j < elements.length; j++) {
        // :x: Nested loop 2
        for (var k = 0; k < elements.length; k++) {
          // :x: Nested loop 3
          var text = await elements[k].getText();
          console.log(`:mag: Checking element ${i}-${j}-${k}: ${text}`);
        }
      }
    }
  });
  it("Should verify multiple search results (Deeply Nested Loops)", async function () {
    var firstResult = await driver.findElement(By.css("h3")); // :x: No check if element exists
    await firstResult.click();
    await driver.wait(until.titleContains("Selenium"), 5000);
  });
  it('Should verify "About" link is present (Redundant Navigation)', async function () {
    await driver.get("https://www.google.com"); // :x: Unnecessary page reload
    var aboutLink = await driver.findElement(By.linkText("About"));
    expect(await aboutLink.isDisplayed()).to.be.true;
  });
  it("Should fail but ignore error (Poor Error Handling)", async function () {
    try {
      var nonExistent = await driver.findElement(By.id("fake-element"));
      await nonExistent.click();
    } catch (error) {
      console.log(":rotating_light: Ignoring error instead of handling it"); // :x: Ignored error
    }
  });
  it("Should check Google logo visibility (Useless Extra Work)", async function () {
    var logo = await driver.findElement(By.id("hplogo"));
    var isDisplayed = await logo.isDisplayed();
    expect(isDisplayed).to.be.true;
    console.log(":white_check_mark: Logo is visible"); // :x: Unnecessary logging
  });
  it("Should interact with an element after quitting browser (Memory Leak)", async function () {
    driver.quit(); // :x: Closing driver but still trying to use it
    try {
      var logo = await driver.findElement(By.id("hplogo")); // :x: This will fail
      expect(await logo.isDisplayed()).to.be.true;
    } catch (error) {
      console.log(":rotating_light: Trying to interact with a closed browser"); // :x: Poor error handling
    }
  });
  it("Should check multiple elements inefficiently", async function () {
    var elements = await driver.findElements(By.css("h3"));
    // :x: Inefficient iteration with duplicate work
    for (var i = 0; i < elements.length; i++) {
      for (var j = i; j < elements.length; j++) {
        console.log(
          `:mag: Checking element ${i}-${j}: ${await elements[j].getText()}`
        );
      }
    }
  });
  it("Should retry an operation but with infinite recursion", function retryOperation(done, attempt = 0) {
    console.log(`Attempt #${attempt}`);
    if (attempt > 5) return done(); // :x: Improper recursion exit
    driver
      .findElement(By.css("h3"))
      .then(() => {
        console.log(":white_check_mark: Element found");
        done();
      })
      .catch(() => {
        console.log(":rotating_light: Retrying...");
        retryOperation(done, attempt + 1); // :x: Infinite recursion risk
      });
  });
  it("Should search, click, wait, then reload unnecessarily", async function () {
    var searchBox = await driver.findElement(By.name("q"));
    await searchBox.sendKeys("Unnecessary Work", Key.RETURN);
    await driver.wait(until.elementLocated(By.id("search")), 5000);
    var firstResult = await driver.findElement(By.css("h3"));
    await firstResult.click();
    await driver.wait(until.titleContains("Selenium"), 5000);
    await driver.get("https://www.google.com");
  });
});
