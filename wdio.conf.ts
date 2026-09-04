export const config: WebdriverIO.Config = {
    runner: 'local',
    tsConfigPath: './tsconfig.json',

    port: 4723,

    specs: [
        './test/specs/**/*.ts'
    ],
    exclude: [
        // 'path/to/excluded/files'
    ],

    maxInstances: 10,

    capabilities: [
        {
             platformName: 'Android',
            'appium:deviceName': 'Pixel_6',
            'appium:platformVersion': '17.0',
            'appium:automationName': 'UiAutomator2',
            'appium:app': require('path').join(process.cwd(), './apps/android/mda-2.2.0-25.apk'),
            'appium:appPackage': 'com.saucelabs.mydemoapp.android',
            'appium:appActivity': 'com.saucelabs.mydemoapp.android.view.activities.SplashActivity'
        }
        // {
        //     platformName: 'iOS',
        //     'appium:deviceName': 'iPhone 15',
        //     'appium:platformVersion': '17.5',
        //     'appium:automationName': 'XCUITest',
        //     'appium:app': require('path').join(process.cwd(), './apps/ios/MyDemoApp.app'),
        //     'appium:bundleId': 'com.saucelabs.mydemoapp.rn'
        // }
    ],

    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    services: ['appium'],

    framework: 'mocha',

    reporters: ['spec', ['allure', {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: false,
    }]],

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
};