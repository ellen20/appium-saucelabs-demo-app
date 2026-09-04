import { $ } from '@wdio/globals';

class LoginPage {
    public get loginHeader() {
        return $('id=com.saucelabs.mydemoapp.android:id/loginTV');
    }

    public get usernameLabel() {
        return $('id=com.saucelabs.mydemoapp.android:id/usernameTV');
    }

    public get passwordLabel() {
        return $('id=com.saucelabs.mydemoapp.android:id/passwordTV');
    }

    public get inputUsername() {
        return $('id=com.saucelabs.mydemoapp.android:id/nameET');
    }

    public get inputPassword() {
        return $('id=com.saucelabs.mydemoapp.android:id/passwordET');
    }

    public get btnSubmit() {
        return $('id=com.saucelabs.mydemoapp.android:id/loginBtn');
    }

    public async login(username: string, password: string) {
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnSubmit.click();
    }
}

export default new LoginPage();