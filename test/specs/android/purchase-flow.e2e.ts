/**
 * Purchase flow (Android native app).
 *
 * Validates the full end-to-end shopping journey in Sauce Labs' My Demo App:
 * login, browse products, add an item to cart, adjust quantity, review the
 * cart, complete checkout (shipping + payment), review the order, and
 * confirm completion.
 *
 * Flow: dismiss Android compatibility dialog if present → navigate to login
 * via menu → verify login screen → sign in → select first product → verify
 * detail page matches → adjust quantity → add to cart → verify cart badge →
 * open cart → verify item/price/total/badge stay consistent through
 * quantity changes → proceed to checkout → fill shipping address → enter
 * payment details → review order (name, total, quantity, badge, delivery
 * address all consistent) → place order → confirm "Checkout Complete" →
 * continue shopping → back to Products page.
 */
import { expect, $, browser } from '@wdio/globals';
import LoginPage from '../../pages/android/login.page';
import ProductsPage from '../../pages/android/products.page';
import ProductDetailPage from '../../pages/android/productDetail.page';
import HeaderComponent from '../../pages/android/header.page';
import CartPage from '../../pages/android/cart.page';
import CheckoutPage from '../../pages/android/checkout.page';
import PaymentPage from '../../pages/android/payment.page';
import ReviewOrderPage from '../../pages/android/reviewOrder.page';
import CheckoutCompletePage from '../../pages/android/checkoutComplete.page';
import { VALID_USER } from '../../fixtures/users';
import { VALID_SHIPPING_ADDRESS } from '../../fixtures/shippingAddress';
import { VALID_PAYMENT } from '../../fixtures/payment';
import { parsePrice } from '../../helpers/price';
import { expectAllExisting, expectAllHaveItems } from '../../helpers/assertions';

describe('Purchase flow — login, add to cart, checkout, and confirm order', () => {

    before(async () => {
        // Dismiss the "Android App Compatibility" system dialog if it appears
        // (Appium reinstalls the app fresh each session, which can retrigger it)
        await browser.pause(2000);
        const dontShowAgainButton = $('android=new UiSelector().text("Don\'t Show Again")');
        if (await dontShowAgainButton.isExisting()) {
            await dontShowAgainButton.click();
        }
    });

    let selectedProductName!: string;
    let selectedProductPrice!: string;
    let cartQuantity!: number;

    it('should navigate to login, verify the login screen, and sign in with valid credentials', async () => {
        await HeaderComponent.goToLogin();

        await expect(LoginPage.loginHeader).toHaveText('Login');
        await expect(LoginPage.usernameLabel).toHaveText('Username');
        await expect(LoginPage.passwordLabel).toHaveText('Password');

        await expectAllExisting([
            LoginPage.inputUsername,
            LoginPage.inputPassword,
            LoginPage.btnSubmit,
        ]);

        await LoginPage.login(VALID_USER.username, VALID_USER.password);

        await expect(ProductsPage.pageTitle).toHaveText('Products');
    });

    it('should capture the first product info, click into its detail page, and confirm all elements match', async () => {
        selectedProductName = await ProductsPage.getProductNameByIndex(0);
        selectedProductPrice = await ProductsPage.getProductPriceByIndex(0);

        expect(selectedProductName).not.toBe('');
        expect(selectedProductPrice).toContain('$');

        const firstImage = (await ProductsPage.productImages)[0];
        await firstImage.click();

        await expectAllExisting([
            ProductDetailPage.title,
            ProductDetailPage.price,
            ProductDetailPage.productImage,
            ProductDetailPage.addToCartButton,
            ProductDetailPage.quantityDisplay,
            ProductDetailPage.increaseQuantityButton,
            ProductDetailPage.decreaseQuantityButton,
        ]);

        const detailName = await ProductDetailPage.getTitle();
        const detailPrice = await ProductDetailPage.getPrice();

        expect(detailName).toBe(selectedProductName);
        expect(detailPrice).toBe(selectedProductPrice);
    });

    it('should increase and decrease item quantity correctly', async () => {
        const initialQuantity = await ProductDetailPage.getQuantity();
        expect(initialQuantity).toBe(1);

        await ProductDetailPage.increaseQuantity();
        let currentQuantity = await ProductDetailPage.getQuantity();
        expect(currentQuantity).toBe(2);

        await ProductDetailPage.increaseQuantity();
        currentQuantity = await ProductDetailPage.getQuantity();
        expect(currentQuantity).toBe(3);

        await ProductDetailPage.decreaseQuantity();
        currentQuantity = await ProductDetailPage.getQuantity();
        expect(currentQuantity).toBe(2);
    });

    it('should add the product to cart and see the cart badge match the selected quantity', async () => {
        cartQuantity = await ProductDetailPage.getQuantity();

        await ProductDetailPage.addToCart();

        await expect(HeaderComponent.cartIcon).toBeExisting();
        await expect(HeaderComponent.cartBadgeCount).toBeExisting();

        const badgeCount = await HeaderComponent.getCartBadgeCount();
        expect(badgeCount).toBe(cartQuantity);
    });

    it('should open the cart, verify all elements, confirm item matches, and validate total and badge update with quantity', async () => {
        await HeaderComponent.openCart();

        // ── Verify baseline cart screen elements ──────────────────────────
        await expect(CartPage.pageTitle).toHaveText('My Cart');

        await expectAllExisting([
            CartPage.totalPrice,
            CartPage.itemsCount,
            CartPage.checkoutButton,
        ]);

        await expectAllHaveItems([
            CartPage.itemTitles,
            CartPage.itemPrices,
            CartPage.itemImages,
            CartPage.quantityDisplays,
            CartPage.increaseQuantityButtons,
            CartPage.decreaseQuantityButtons,
            CartPage.removeItemButtons,
        ]);

        // ── Confirm cart item matches what was selected earlier ───────────
        const cartItemName = await CartPage.getItemTitleByIndex(0);
        const cartItemPrice = await CartPage.getItemPriceByIndex(0);

        expect(cartItemName).toBe(selectedProductName);
        expect(cartItemPrice).toBe(selectedProductPrice);

        // ── Increase/decrease quantity and confirm total + badge stay in sync ──
        const unitPrice = parsePrice(selectedProductPrice);
        let currentCartQuantity = cartQuantity;

        const increaseButtons = CartPage.increaseQuantityButtons;
        await increaseButtons[0].click();
        currentCartQuantity += 1;
        let currentTotal = parsePrice(await CartPage.totalPrice.getText());
        expect(currentTotal).toBeCloseTo(unitPrice * currentCartQuantity, 2);
        let badgeCount = await HeaderComponent.getCartBadgeCount();
        expect(badgeCount).toBe(currentCartQuantity);

        await increaseButtons[0].click();
        currentCartQuantity += 1;
        currentTotal = parsePrice(await CartPage.totalPrice.getText());
        expect(currentTotal).toBeCloseTo(unitPrice * currentCartQuantity, 2);
        badgeCount = await HeaderComponent.getCartBadgeCount();
        expect(badgeCount).toBe(currentCartQuantity);

        const decreaseButtons = CartPage.decreaseQuantityButtons;
        await decreaseButtons[0].click();
        currentCartQuantity -= 1;
        currentTotal = parsePrice(await CartPage.totalPrice.getText());
        expect(currentTotal).toBeCloseTo(unitPrice * currentCartQuantity, 2);
        badgeCount = await HeaderComponent.getCartBadgeCount();
        expect(badgeCount).toBe(currentCartQuantity);

        cartQuantity = currentCartQuantity;
    });

    it('should proceed to checkout, verify all elements, fill in shipping address, and proceed to payment', async () => {
        await CartPage.proceedToCheckout();

        await expect(CheckoutPage.pageTitle).toHaveText('Checkout');
        await expect(CheckoutPage.sectionHeader).toHaveText('Enter a shipping address');
        await expect(CheckoutPage.fullNameLabel).toHaveText('Full Name', { containing: true });
        await expect(CheckoutPage.address1Label).toHaveText('Address Line 1', { containing: true });
        await expect(CheckoutPage.address2Label).toHaveText('Address Line 2');
        await expect(CheckoutPage.cityLabel).toHaveText('City', { containing: true });
        await expect(CheckoutPage.stateLabel).toHaveText('State', { containing: true });
        await expect(CheckoutPage.zipLabel).toHaveText('Zip Code', { containing: true });
        await expect(CheckoutPage.countryLabel).toHaveText('Country', { containing: true });
        await expect(CheckoutPage.toPaymentButton).toHaveText('To Payment');

        await expectAllExisting([
            CheckoutPage.fullNameInput,
            CheckoutPage.address1Input,
            CheckoutPage.address2Input,
            CheckoutPage.cityInput,
            CheckoutPage.stateInput,
            CheckoutPage.zipInput,
            CheckoutPage.countryInput,
        ]);

        await CheckoutPage.fillShippingAddress(VALID_SHIPPING_ADDRESS);
        await CheckoutPage.proceedToPayment();
    });

    it('should display all payment page elements correctly and fill in payment details', async () => {
        await expect(PaymentPage.cardLabel).toHaveText('Card');
        await expect(PaymentPage.nameLabel).toHaveText('Full Name', { containing: true });
        await expect(PaymentPage.cardNumberLabel).toHaveText('Card Number', { containing: true });
        await expect(PaymentPage.expirationDateLabel).toHaveText('Expiration Date', { containing: true });
        await expect(PaymentPage.securityCodeLabel).toHaveText('Security Code', { containing: true });
        await expect(PaymentPage.reviewOrderButton).toHaveText('Review Order');

        await expectAllExisting([
            PaymentPage.nameInput,
            PaymentPage.cardNumberInput,
            PaymentPage.expirationDateInput,
            PaymentPage.securityCodeInput,
            PaymentPage.billingAddressCheckbox,
        ]);

        await PaymentPage.fillPaymentDetails(VALID_PAYMENT);
        await PaymentPage.reviewOrder();
    });

    it('should display all review order elements, confirm total price, quantity, and badge are correct, and place the order', async () => {
        await expect(ReviewOrderPage.sectionHeader).toHaveText('Review your order');

        await expectAllExisting([
            ReviewOrderPage.productImage,
            ReviewOrderPage.productTitle,
            ReviewOrderPage.productPrice,
            ReviewOrderPage.productColor,
            ReviewOrderPage.deliveryFullName,
            ReviewOrderPage.deliveryAddress,
            ReviewOrderPage.deliveryCity,
            ReviewOrderPage.deliveryCountry,
            ReviewOrderPage.itemCount,
        ]);

        // Capture all "above the fold" data BEFORE scrolling
        const reviewProductName = await ReviewOrderPage.getProductTitle();
        const reviewItemCount = await ReviewOrderPage.getItemCount();
        const deliveryName = await ReviewOrderPage.deliveryFullName.getText();
        const deliveryCity = await ReviewOrderPage.deliveryCity.getText();

        await ReviewOrderPage.scrollToShippingAmount();

        await expect(ReviewOrderPage.shippingAmount).toBeExisting();
        const shippingFeeText = await ReviewOrderPage.getShippingAmount();
        expect(shippingFeeText).toContain('$');

        await expect(ReviewOrderPage.totalAmount).toBeExisting();
        await expect(ReviewOrderPage.placeOrderButton).toHaveText('Place Order');

        expect(reviewProductName).toBe(selectedProductName);

        // Shipping fee is read dynamically from the UI rather than hardcoded,
        // since the app's shipping rate could change independently of this test
        const shippingFee = parsePrice(shippingFeeText);
        const unitPrice = parsePrice(selectedProductPrice);
        const expectedTotal = (unitPrice * cartQuantity) + shippingFee;

        expect(reviewItemCount).toContain(String(cartQuantity));

        const reviewTotal = parsePrice(await ReviewOrderPage.getTotalAmount());
        expect(reviewTotal).toBeCloseTo(expectedTotal, 2);

        const badgeCount = await HeaderComponent.getCartBadgeCount();
        expect(badgeCount).toBe(cartQuantity);

        expect(deliveryName).toBe(VALID_SHIPPING_ADDRESS.fullName);
        expect(deliveryCity).toContain(VALID_SHIPPING_ADDRESS.city);

        await ReviewOrderPage.placeOrder();
    });

    it('should confirm checkout is complete with correct confirmation elements and return to shopping', async () => {
        await expect(CheckoutCompletePage.completeTitle).toHaveText('Checkout Complete');
        await expect(CheckoutCompletePage.thankYouText).toHaveText('Thank you for your order');
        await expect(CheckoutCompletePage.swagText).toHaveText('Your new swag is on its way');
        await expect(CheckoutCompletePage.continueShoppingButton).toHaveText('Continue Shopping');
        await expect(CheckoutCompletePage.orderText).toBeExisting();

        await CheckoutCompletePage.continueShopping();

        await expect(ProductsPage.pageTitle).toHaveText('Products');
    });
});