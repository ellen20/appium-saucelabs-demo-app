import { $ } from '@wdio/globals';

class CheckoutPage {
    public get pageTitle() {
        return $('id=com.saucelabs.mydemoapp.android:id/checkoutTitleTV');
    }

    public get sectionHeader() {
        return $('id=com.saucelabs.mydemoapp.android:id/enterShippingAddressTV');
    }

    public get fullNameLabel() {
        return $('id=com.saucelabs.mydemoapp.android:id/fullNameTV');
    }

    public get fullNameInput() {
        return $('id=com.saucelabs.mydemoapp.android:id/fullNameET');
    }

    public get address1Label() {
        return $('id=com.saucelabs.mydemoapp.android:id/address1TV');
    }

    public get address1Input() {
        return $('id=com.saucelabs.mydemoapp.android:id/address1ET');
    }

    public get address2Label() {
        return $('id=com.saucelabs.mydemoapp.android:id/address2TV');
    }

    public get address2Input() {
        return $('id=com.saucelabs.mydemoapp.android:id/address2ET');
    }

    public get cityLabel() {
        return $('id=com.saucelabs.mydemoapp.android:id/cityTV');
    }

    public get cityInput() {
        return $('id=com.saucelabs.mydemoapp.android:id/cityET');
    }

    public get stateLabel() {
        return $('id=com.saucelabs.mydemoapp.android:id/stateTV');
    }

    public get stateInput() {
        return $('id=com.saucelabs.mydemoapp.android:id/stateET');
    }

    public get zipLabel() {
        return $('id=com.saucelabs.mydemoapp.android:id/zipTV');
    }

    public get zipInput() {
        return $('id=com.saucelabs.mydemoapp.android:id/zipET');
    }

    public get countryLabel() {
        return $('id=com.saucelabs.mydemoapp.android:id/countryTV');
    }

    public get countryInput() {
        return $('id=com.saucelabs.mydemoapp.android:id/countryET');
    }

    public get toPaymentButton() {
        return $('id=com.saucelabs.mydemoapp.android:id/paymentBtn');
    }

    public async fillShippingAddress(address: {
        fullName: string;
        address1: string;
        address2?: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    }) {
        await this.fullNameInput.setValue(address.fullName);
        await this.address1Input.setValue(address.address1);
        if (address.address2) {
            await this.address2Input.setValue(address.address2);
        }
        await this.cityInput.setValue(address.city);
        await this.stateInput.setValue(address.state);
        await this.zipInput.setValue(address.zip);
        await this.countryInput.setValue(address.country);
    }

    public async proceedToPayment() {
        await this.toPaymentButton.click();
    }
}

export default new CheckoutPage();