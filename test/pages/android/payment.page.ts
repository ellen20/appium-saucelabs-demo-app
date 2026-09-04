import { $ } from '@wdio/globals';

class PaymentPage {
    public get cardLabel() {
        return $('id=com.saucelabs.mydemoapp.android:id/cardTV');
    }

    public get nameLabel() {
        return $('id=com.saucelabs.mydemoapp.android:id/nameTV');
    }

    public get nameInput() {
        return $('id=com.saucelabs.mydemoapp.android:id/nameET');
    }

    public get cardNumberLabel() {
        return $('id=com.saucelabs.mydemoapp.android:id/cardNumberTV');
    }

    public get cardNumberInput() {
        return $('id=com.saucelabs.mydemoapp.android:id/cardNumberET');
    }

    public get expirationDateLabel() {
        return $('id=com.saucelabs.mydemoapp.android:id/expirationDateTV');
    }

    public get expirationDateInput() {
        return $('id=com.saucelabs.mydemoapp.android:id/expirationDateET');
    }

    public get securityCodeLabel() {
        return $('id=com.saucelabs.mydemoapp.android:id/securityCodeTV');
    }

    public get securityCodeInput() {
        return $('id=com.saucelabs.mydemoapp.android:id/securityCodeET');
    }

    public get billingAddressCheckbox() {
        return $('id=com.saucelabs.mydemoapp.android:id/billingAddressCB');
    }

    // Conditional billing address fields (shown only when checkbox is UNCHECKED)
    public get billingFullNameLabel() {
        return $('id=com.saucelabs.mydemoapp.android:id/fullNameTV');
    }

    public get billingFullNameInput() {
        return $('id=com.saucelabs.mydemoapp.android:id/fullNameET');
    }

    public get billingAddress1Input() {
        return $('id=com.saucelabs.mydemoapp.android:id/address1ET');
    }

    public get billingAddress2Input() {
        return $('id=com.saucelabs.mydemoapp.android:id/address2ET');
    }

    public get billingCityInput() {
        return $('id=com.saucelabs.mydemoapp.android:id/cityET');
    }

    public get billingStateInput() {
        return $('id=com.saucelabs.mydemoapp.android:id/stateET');
    }

    public get billingZipInput() {
        return $('id=com.saucelabs.mydemoapp.android:id/zipET');
    }

    public get billingCountryInput() {
        return $('id=com.saucelabs.mydemoapp.android:id/countryET');
    }

    public get reviewOrderButton() {
        return $('id=com.saucelabs.mydemoapp.android:id/paymentBtn');
    }

    public async fillPaymentDetails(payment: {
        name: string;
        cardNumber: string;
        expirationDate: string;
        securityCode: string;
    }) {
        await this.nameInput.setValue(payment.name);
        await this.cardNumberInput.setValue(payment.cardNumber);
        await this.expirationDateInput.setValue(payment.expirationDate);
        await this.securityCodeInput.setValue(payment.securityCode);
    }

    public async uncheckSameAsShipping() {
        await this.billingAddressCheckbox.click();
    }

    public async fillBillingAddress(address: {
        fullName: string;
        address1: string;
        address2?: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    }) {
        await this.billingFullNameInput.setValue(address.fullName);
        await this.billingAddress1Input.setValue(address.address1);
        if (address.address2) {
            await this.billingAddress2Input.setValue(address.address2);
        }
        await this.billingCityInput.setValue(address.city);
        await this.billingStateInput.setValue(address.state);
        await this.billingZipInput.setValue(address.zip);
        await this.billingCountryInput.setValue(address.country);
    }

    public async reviewOrder() {
        await this.reviewOrderButton.click();
    }
}

export default new PaymentPage();