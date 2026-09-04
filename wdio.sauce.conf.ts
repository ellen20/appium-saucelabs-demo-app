import { config as localConfig } from './wdio.conf.ts';
import 'dotenv/config';

export const config: WebdriverIO.Config = {
    ...localConfig,

    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,

    region: 'us',

    services: [
        'appium',
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