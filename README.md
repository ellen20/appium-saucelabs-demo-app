# Appium Sauce Labs Demo App — E2E Test Automation

> Native mobile test automation for Sauce Labs' official demo app, built with Appium, WebdriverIO, and TypeScript.

![Appium](https://img.shields.io/badge/appium-2.0-purple)
![WebdriverIO](https://img.shields.io/badge/webdriverio-9.x-orange)
![TypeScript](https://img.shields.io/badge/typescript-strict-blue)
![Platform](https://img.shields.io/badge/platform-Android-green)
![iOS Status](https://img.shields.io/badge/iOS-in%20progress-lightgrey)
![Android E2E CI](https://github.com/ellen20/appium-saucelabs-demo-app/actions/workflows/android-e2e.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📸 Overview

This project demonstrates native mobile test automation against [Sauce Labs' official demo app](https://github.com/saucelabs/my-demo-app-android) — a sample e-commerce shopping app built specifically for Appium practice.

Rather than a shallow "does the app open" smoke test, this suite covers a **full end-to-end purchase journey**: login, product selection, quantity management, cart validation, checkout, payment, and order confirmation — with cross-screen data consistency checks throughout (the same product name, price, quantity, and total are validated as they carry across every screen in the flow).

---

## ✨ What This Covers

- 🔐 **Login flow** — navigating to login via the app's menu, verifying all screen elements, signing in with valid credentials
- 🛍️ **Product selection** — capturing product data (name, price) and verifying it's consistent on the detail page
- 🔢 **Quantity management** — increasing/decreasing item quantity, verifying the running total price updates correctly
- 🛒 **Cart validation** — confirming cart contents, price, and quantity match what was selected, and that the cart badge count and total price stay in sync as quantity changes
- 📦 **Checkout** — filling and validating a full shipping address form
- 💳 **Payment** — filling and validating payment details
- 🧾 **Order review** — cross-checking product name, quantity, delivery address, shipping fee (read dynamically from the UI, not hardcoded), and final total across the whole flow
- ✅ **Order confirmation** — verifying the "Checkout Complete" screen and returning to a clean state

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Automation | Appium 2.0, WebdriverIO |
| Language | TypeScript (strict mode) |
| Test Framework | Mocha |
| Reporting | Allure |
| CI/CD | GitHub Actions |
| Target App | [Sauce Labs My Demo App](https://github.com/saucelabs/my-demo-app-android) (Android), iOS support in progress |
| Cloud Testing | Sauce Labs (config included, local emulator/simulator used for development) |

---

## 📁 Project Structure
```
appium-saucelabs-demo-app/
├── apps/ # App binaries (not committed — see setup below)
│ ├── android/
│ │ └── mda-2.2.0-25.apk
│ └── ios/
│ └── MyDemoApp.app
├── test/
│ ├── fixtures/ # Shared test data (platform-agnostic)
│ │ ├── users.ts
│ │ ├── shippingAddress.ts
│ │ └── payment.ts
│ ├── helpers/ # Reusable utility functions
│ │ ├── price.ts # parsePrice() — strips "$" and parses to float
│ │ └── assertions.ts # expectAllExisting(), expectAllHaveItems()
│ ├── pages/
│ │ └── android/ # Page Object Model — one file per screen
│ │ ├── login.page.ts
│ │ ├── products.page.ts
│ │ ├── productDetail.page.ts
│ │ ├── header.page.ts # Shared component (menu, cart icon, badge)
│ │ ├── cart.page.ts
│ │ ├── checkout.page.ts
│ │ ├── payment.page.ts
│ │ ├── reviewOrder.page.ts
│ │ └── checkoutComplete.page.ts
│ └── specs/
│ └── android/
│ └── purchase-flow.e2e.ts
├── .github/
│ └── workflows/
│ └── android-e2e.yml # Android E2E CI/CD pipeline
├── wdio.conf.ts # Local emulator/simulator config
├── wdio.sauce.conf.ts # Sauce Labs cloud config
├── .env.example
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- [Android Studio](https://developer.android.com/studio) with an AVD created (this project uses `Pixel_6`)
- [Xcode](https://apps.apple.com/us/app/xcode/id497799835) with an iOS Simulator runtime installed (for iOS, in progress)
- A [Sauce Labs](https://saucelabs.com/) account (free trial available) if running against the cloud device grid

### 1. Clone the repo

```bash
git clone https://github.com/ellen20/appium-saucelabs-demo-app.git
cd appium-saucelabs-demo-app
npm install
```

### 2. Download the app binaries

App binaries are not committed to this repo (they're large, versioned assets). Download them from Sauce Labs' official releases:

- **Android:** [my-demo-app-android releases](https://github.com/saucelabs/my-demo-app-android/releases) → download `mda-2.2.0-25.apk` → place in `apps/android/`
- **iOS:** [my-demo-app-ios releases](https://github.com/saucelabs/my-demo-app-ios/releases) → download `SauceLabs-Demo-App.Simulator.zip` → unzip → place the `.app` in `apps/ios/`

### 3. Set up environment variables (for Sauce Labs cloud runs)

```bash
cp .env.example .env
# Fill in your Sauce Labs username and access key
```

### 4. Boot your emulator/simulator

```bash
# Android
emulator -avd Pixel_6

# iOS
open -a Simulator
```

Wait until fully booted before proceeding.

### 5. Run the tests

```bash
npm test
```

---

## 🧪 Test Architecture

### Page Object Model

Every screen has its own page object exposing:
- **Locators** as getters (using Android resource-IDs, verified via Appium Inspector — never guessed)
- **Actions** as async methods (e.g., `login()`, `addToCart()`, `fillShippingAddress()`)

A shared `HeaderComponent` handles elements present across every screen (menu, cart icon, cart badge count), since the app's navigation header persists throughout the entire user journey.

### Fixtures

Test data (valid user credentials, shipping address, payment details) lives in `test/fixtures/`, separate from page objects and test logic — page objects stay data-agnostic and reusable, test files supply the actual data.

### Helpers

- **`parsePrice()`** — centralizes the repeated pattern of stripping `$` and parsing currency strings to numbers, used throughout price/total assertions
- **`expectAllExisting()` / `expectAllHaveItems()`** — reduce repetitive element-visibility checks into single array-based calls

### Dynamic, non-hardcoded assertions

Rather than hardcoding business values (like the shipping fee) into test expectations, values are read directly from the UI at runtime and used to validate the *relationship* between subtotal, fees, and total — so the test remains accurate even if the app's pricing logic changes.

---

## 🐛 Real Bugs Found & Fixed During Development

This project surfaced and required solving several genuine debugging challenges, not just "happy path" scripting:

- **Android compatibility dialog interception** — Appium reinstalls the app fresh each session, which re-triggers a system-level "App Compatibility" dialog that blocks the login screen underneath it. Fixed with a `before()` hook that conditionally dismisses it.
- **Shared-state race condition** — a variable meant to carry cart quantity across sequential test steps was assigned to a differently-named local variable instead of the shared one, producing a confusing `NaN` several steps downstream from the actual bug.
- **Hardcoded business logic** — an initial shipping-fee assumption was hardcoded into total-price calculations; refactored to read the fee dynamically from the UI so the test doesn't break if the app's shipping logic changes.
- **Scroll gesture reliability** — coordinate-based swipe gestures were unreliable on the Review Order screen; switched to `scrollIntoView()` targeting the specific element, which required reordering assertions to capture "above the fold" data before scrolling pushed it out of view.

---

## 📊 Test Reporting

This project uses [Allure](https://allurereport.org/) for rich, visual test reports.

```bash
npm run report
```

This generates and opens an interactive HTML report with step-by-step breakdowns and screenshots on failure.

---

## ⚙️ CI/CD (GitHub Actions)

The Android E2E suite runs automatically on push and pull request to `main`.

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

- ✅ Runs on a macOS runner (required for hardware-accelerated Android emulation)
- ✅ Boots a Pixel 6 (API 34) emulator using [`reactivecircus/android-emulator-runner`](https://github.com/ReactiveCircus/android-emulator-runner)
- ✅ Downloads the app APK fresh from Sauce Labs' official releases
- ✅ Installs Appium and the UiAutomator2 driver
- ✅ Runs the full purchase-flow suite against the booted emulator
- ✅ Uploads Allure results as a workflow artifact

---

## 🗺️ Roadmap

- [x] Full Android purchase flow (login → cart → checkout → payment → order confirmation)
- [x] Page Object Model architecture with shared header component
- [x] Fixtures for test data separation
- [x] Reusable assertion and price-parsing helpers
- [x] Allure reporting integration
- [x] GitHub Actions CI/CD pipeline (Android)
- [ ] iOS purchase flow (parallel page object set, in progress)
- [ ] Negative/edge-case test coverage (invalid login, empty required fields)
- [ ] Sauce Labs cloud device grid execution

---

## 📝 License

MIT — see [LICENSE](LICENSE) for details.

---

**Made with 📱 by Jingling Jin**