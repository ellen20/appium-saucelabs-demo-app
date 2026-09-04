import { $, $$, browser } from '@wdio/globals';

class ProductsPage {
    public get pageTitle() {
        return $('id=com.saucelabs.mydemoapp.android:id/productTV');
    }

    public get productItems() {
        return $$('id=com.saucelabs.mydemoapp.android:id/titleTV');
    }

    public get productImages() {
        return $$('id=com.saucelabs.mydemoapp.android:id/productIV');
    }

    public get productPrices() {
        return $$('id=com.saucelabs.mydemoapp.android:id/priceTV');
    }

    public get productList() {
        return $('id=com.saucelabs.mydemoapp.android:id/productRV');
    }

    public async selectProductByIndex(index: number) {
        const products = this.productItems;
        await products[index].click();
    }

    public async selectRandomProduct() {
        const products = this.productItems;
        const count = await products.length;
        if (!count) {
            throw new Error('No products found to select');
        }
        const randomIndex = Math.floor(Math.random() * count);
        await products[randomIndex].click();
    }

    public async getProductNameByIndex(index: number): Promise<string> {
        const products = this.productItems;
        return await products[index].getText();
    }

    public async getProductPriceByIndex(index: number): Promise<string> {
        const prices = this.productPrices;
        return await prices[index].getText();
    }

    public async scrollDown() {
        const list = await this.productList;
        await browser.execute('mobile: scrollGesture', {
            elementId: list.elementId,
            direction: 'down',
            percent: 0.75,
        });
    }
}

export default new ProductsPage();