import { $ } from '@wdio/globals';

class HeaderComponent {
    public get appLogo() {
        return $('id=com.saucelabs.mydemoapp.android:id/mTvTitle');
    }

    public get menuButton() {
        return $('id=com.saucelabs.mydemoapp.android:id/menuIV');
    }

    public get cartIcon() {
        return $('id=com.saucelabs.mydemoapp.android:id/cartIV');
    }

    public get cartBadgeCount() {
        return $('id=com.saucelabs.mydemoapp.android:id/cartTV');
    }

    public get loginMenuItem() {
        return $('~Login Menu Item');
    }

    public get logOutMenuItem() {
        return $('~Logout Menu Item');
    }

    public get logOutConfirmButton() {
        return $('android=new UiSelector().text("LOGOUT")');
    }

    public async openMenu() {
        await this.menuButton.click();
    }

    public async goToLogin() {
        await this.openMenu();
        await this.loginMenuItem.click();
    }

    public async logout() {
        await this.openMenu();
        await this.logOutMenuItem.click();
        await this.logOutConfirmButton.click();
    }

    public async openCart() {
        await this.cartIcon.click();
    }

    public async getCartBadgeCount(): Promise<number> {
        const text = await this.cartBadgeCount.getText();
        return parseInt(text, 10);
    }
}

export default new HeaderComponent();