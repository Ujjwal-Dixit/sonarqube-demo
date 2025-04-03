exports.config = {
    runner: 'local',
    specs: ['test/specs/*.js'],
    maxInstances: 1,
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: ['--headless', '--disable-gpu', '--window-size=1280,800']
        }
    }],
    logLevel: 'info',
    framework: 'mocha',
    mochaOpts: { ui: 'bdd', timeout: 60000 },
    reporters: ['dot'],
    services: [
        ['selenium-standalone', {
            drivers: {
                chrome: { version: 'latest' }  // Ensure Chrome is used
            }
        }]
    ]
    ,
    hostname: 'localhost',
    port: 4444,
    path: '/wd/hub',
    beforeTest: function () {
        const chai = require('chai');
        global.expect = chai.expect;
    }
};
