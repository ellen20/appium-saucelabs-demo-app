import { $ } from '@wdio/globals';

class ReviewOrderPage {
    public get sectionHeader() {
        return $('id=com.saucelabs.mydemoapp.android:id/enterShippingAddressTV');
    }

    public get productImage() {
        return $('id=com.saucelabs.mydemoapp.android:id/productIV');
    }

    public get productTitle() {
        return $('id=com.saucelabs.mydemoapp.android:id/titleTV');
    }

    public get productPrice() {
        return $('id=com.saucelabs.mydemoapp.android:id/priceTV');
    }

    public get productColor() {
        return $('id=com.saucelabs.mydemoapp.android:id/colorIV');
    }

    public get deliveryFullName() {
        return $('id=com.saucelabs.mydemoapp.android:id/fullNameTV');
    }

    public get deliveryAddress() {
        return $('id=com.saucelabs.mydemoapp.android:id/addressTV');
    }

    public get deliveryCity() {
        return $('id=com.saucelabs.mydemoapp.android:id/cityTV');
    }

    public get deliveryCountry() {
        return $('id=com.saucelabs.mydemoapp.android:id/countryTV');
    }

    public get itemCount() {
        return $('id=com.saucelabs.mydemoapp.android:id/itemNumberTV');
    }

    public get shippingAmount() {
        return $('id=com.saucelabs.mydemoapp.android:id/amountTV');
    }

    public get totalAmount() {
        return $('id=com.saucelabs.mydemoapp.android:id/totalAmountTV');
    }

    public get placeOrderButton() {
        return $('id=com.saucelabs.mydemoapp.android:id/paymentBtn');
    }

    public async getProductTitle(): Promise<string> {
        return await this.productTitle.getText();
    }

    public async getShippingAmount(): Promise<string> {
        return await this.shippingAmount.getText();
    }

    public async getTotalAmount(): Promise<string> {
        return await this.totalAmount.getText();
    }

    public async getItemCount(): Promise<string> {
        return await this.itemCount.getText();
    }

    public async scrollToShippingAmount() {
        await this.shippingAmount.scrollIntoView();
    }

    public async placeOrder() {
        await this.placeOrderButton.click();
    }
}

export default new ReviewOrderPage();