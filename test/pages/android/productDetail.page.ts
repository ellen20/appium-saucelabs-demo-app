import { $, $$, browser } from '@wdio/globals';

class ProductDetailPage {
    public get title() {
        return $('id=com.saucelabs.mydemoapp.android:id/productTV');
    }

    public get price() {
        return $('id=com.saucelabs.mydemoapp.android:id/priceTV');
    }

    public get productImage() {
        return $('id=com.saucelabs.mydemoapp.android:id/productIV');
    }

    public get colorOptions() {
        return $$('id=com.saucelabs.mydemoapp.android:id/colorIV');
    }

    public get addToCartButton() {
        return $('id=com.saucelabs.mydemoapp.android:id/cartBt');
    }

    public get quantityDisplay() {
        return $('id=com.saucelabs.mydemoapp.android:id/noTV');
    }

    public get increaseQuantityButton() {
        return $('id=com.saucelabs.mydemoapp.android:id/plusIV');
    }

    public get decreaseQuantityButton() {
        return $('id=com.saucelabs.mydemoapp.android:id/minusIV');
    }

    public async getTitle(): Promise<string> {
        return await this.title.getText();
    }

    public async getPrice(): Promise<string> {
        return await this.price.getText();
    }

    public async getQuantity(): Promise<number> {
    await this.quantityDisplay.waitForDisplayed();
    const text = await this.quantityDisplay.getText();
    return parseInt(text, 10);
    }

    public async increaseQuantity() {
        await this.increaseQuantityButton.click();
    }

    public async decreaseQuantity() {
        await this.decreaseQuantityButton.click();
    }

    public async selectColorByIndex(index: number) {
        const colors = this.colorOptions;
        await colors[index].click();
    }

    public async addToCart() {
        await this.addToCartButton.click();
    }

    public async scrollDown() {
        const container = await $('id=com.saucelabs.mydemoapp.android:id/fragment_container');
        await browser.execute('mobile: scrollGesture', {
            elementId: container.elementId,
            direction: 'down',
            percent: 0.75,
        });
    }
}

export default new ProductDetailPage();