import { config as localConfig } from './wdio.conf.ts';
import 'dotenv/config';

export const config: WebdriverIO.Config = {
    ...localConfig,

    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,

    // Explicitly cleared — otherwise inherited from localConfig and
    // pointed requests at local Appium's port 4723 instead of Sauce's
    // cloud endpoint, causing ETIMEDOUT errors.
    hostname: undefined,
    port: undefined,
    path: undefined,

    region: 'us',

    // Generous timeout since trial-tier device provisioning has been
    // slow (one successful run took 2m45s). Retry count set to 0 so a
    // slow-but-eventually-successful session doesn't get abandoned
    // client-side while still running server-side, which was leaving
    // behind "ghost" Running sessions that ate the concurrency slot.
    connectionRetryTimeout: 300000,
    connectionRetryCount: 0,

    services: [
        ['sauce', {
            sauceConnect: false
        }]
    ],

    capabilities: [{
        platformName: 'Android',
        'appium:deviceName': 'Google Pixel 6 GoogleAPI Emulator',
        'appium:platformVersion': '13.0',
        'appium:automationName': 'UiAutomator2',
        'appium:app': 'storage:filename=mda-2.2.0-25.apk',
        'sauce:options': {
            build: 'appium-saucelabs-demo-app-build',
            name: 'Android My Demo App Test'
        }
    }]
};