import { $, $$ } from '@wdio/globals';

class CartPage {
    public get pageTitle() {
        return $('id=com.saucelabs.mydemoapp.android:id/productTV');
    }

    public get itemTitles() {
        return $$('id=com.saucelabs.mydemoapp.android:id/titleTV');
    }

    public get itemPrices() {
        return $$('id=com.saucelabs.mydemoapp.android:id/priceTV');
    }

    public get itemColors() {
        return $$('id=com.saucelabs.mydemoapp.android:id/colorIV');
    }

    public get itemImages() {
        return $$('id=com.saucelabs.mydemoapp.android:id/productIV');
    }

    public get quantityDisplays() {
        return $$('id=com.saucelabs.mydemoapp.android:id/noTV');
    }

    public get increaseQuantityButtons() {
        return $$('id=com.saucelabs.mydemoapp.android:id/plusIV');
    }

    public get decreaseQuantityButtons() {
        return $$('id=com.saucelabs.mydemoapp.android:id/minusIV');
    }

    public get removeItemButtons() {
        return $$('id=com.saucelabs.mydemoapp.android:id/removeBt');
    }

    public get totalPrice() {
        return $('id=com.saucelabs.mydemoapp.android:id/totalPriceTV');
    }

    public get itemsCount() {
        return $('id=com.saucelabs.mydemoapp.android:id/itemsTV');
    }

    public get checkoutButton() {
        return $('id=com.saucelabs.mydemoapp.android:id/cartBt');
    }

    public async getItemTitleByIndex(index: number): Promise<string> {
        const titles = this.itemTitles;
        return await titles[index].getText();
    }

    public async getItemPriceByIndex(index: number): Promise<string> {
        const prices = this.itemPrices;
        return await prices[index].getText();
    }

    public async removeItemByIndex(index: number) {
        const removeButtons = this.removeItemButtons;
        await removeButtons[index].click();
    }

    public async proceedToCheckout() {
        await this.checkoutButton.click();
    }
}

export default new CartPage();