import { $ } from '@wdio/globals';

class CheckoutCompletePage {
    public get completeTitle() {
        return $('id=com.saucelabs.mydemoapp.android:id/completeTV');
    }

    public get thankYouText() {
        return $('id=com.saucelabs.mydemoapp.android:id/thankYouTV');
    }

    public get swagText() {
        return $('id=com.saucelabs.mydemoapp.android:id/swagTV');
    }

    public get orderText() {
        return $('id=com.saucelabs.mydemoapp.android:id/orderTV');
    }

    public get continueShoppingButton() {
        return $('id=com.saucelabs.mydemoapp.android:id/shoopingBt');
    }

    public async continueShopping() {
        await this.continueShoppingButton.click();
    }
}

export default new CheckoutCompletePage();