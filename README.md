# Appium Sauce Labs Demo App — E2E Test Automation

> Native mobile test automation for Sauce Labs' official demo app, built with Appium, WebdriverIO, and TypeScript.

![Android E2E Tests](https://github.com/ellen20/appium-saucelabs-demo-app/actions/workflows/android-e2e.yml/badge.svg?branch=main)
![Appium](https://img.shields.io/badge/appium-2.0-purple)
![WebdriverIO](https://img.shields.io/badge/webdriverio-9.x-orange)
![TypeScript](https://img.shields.io/badge/typescript-strict-blue)
![Platform](https://img.shields.io/badge/platform-Android-green)
![iOS Status](https://img.shields.io/badge/iOS-in%20progress-lightgrey)
![CI](https://img.shields.io/badge/CI-Sauce%20Labs%20Cloud-1E90FF)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📸 Overview

This project demonstrates native mobile test automation against [Sauce Labs' official demo app](https://github.com/saucelabs/my-demo-app-android) — a sample e-commerce shopping app built specifically for Appium practice.

Rather than a shallow "does the app open" smoke test, this suite covers a **full end-to-end purchase journey**: login, product selection, quantity management, cart validation, checkout, payment, and order confirmation — with cross-screen data consistency checks throughout (the same product name, price, quantity, and total are validated as they carry across every screen in the flow).

The suite runs both locally against an emulator/simulator for development, and in CI against **Sauce Labs' real cloud device grid** — a deliberate architecture choice made to solve a genuine infrastructure limitation (see [CI/CD](#️-cicd-github-actions) below).

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
| CI/CD | GitHub Actions, running against Sauce Labs cloud (see [CI/CD](#️-cicd-github-actions) below) |
| Target App | [Sauce Labs My Demo App](https://github.com/saucelabs/my-demo-app-android) (Android), iOS support in progress |
| Cloud Testing | Sauce Labs real device grid — used for both CI and optional local cloud runs |

---

## 📁 Project Structure
```
appium-saucelabs-demo-app/
├── apps/ # App binaries (not committed — see setup below)
│ ├── android/
│ │ └── mda-2.2.0-25.apk
│ └── ios/
│ └── SauceLabs-Demo-App.Simulator.zip
├── test/
│ ├── fixtures/ # Shared test data (platform-agnostic)
│ │ ├── users.ts
│ │ ├── shippingAddress.ts
│ │ └── payment.ts
│ ├── helpers/ # Reusable utility functions
│ │ ├── price.ts # parsePrice() — strips "$" and parses to float
│ │ └── assertions.ts # expectAllExisting(), expectAllHaveItems()
│ ├── pages/
│ │ ├── android/ # Page Object Model — one file per screen
│ │ │ ├── login.page.ts
│ │ │ ├── products.page.ts
│ │ │ ├── productDetail.page.ts
│ │ │ ├── header.page.ts # Shared component (menu, cart icon, badge)
│ │ │ ├── cart.page.ts
│ │ │ ├── checkout.page.ts
│ │ │ ├── payment.page.ts
│ │ │ ├── reviewOrder.page.ts
│ │ │ └── checkoutComplete.page.ts
│ │ └── ios/ # iOS page objects (in progress)
│ └── specs/
│ ├── android/
│ │ └── purchase-flow.e2e.ts
│ └── ios/
│ └── purchase-flow.e2e.ts # in progress
├── .github/
│ └── workflows/
│ └── android-e2e.yml # CI pipeline — runs against Sauce Labs cloud
├── wdio.conf.ts # Local emulator/simulator config
├── wdio.sauce.conf.ts # Sauce Labs cloud config (used locally and in CI)
├── .env.example
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- [Android Studio](https://developer.android.com/studio) with an AVD created (this project uses `Pixel_6`) — for local runs
- [Xcode](https://apps.apple.com/us/app/xcode/id497799835) with an iOS Simulator runtime installed (for iOS, in progress)
- A [Sauce Labs](https://saucelabs.com/) account (free trial available) to run against the cloud device grid, either locally or via CI

### 1. Clone the repo

```bash
git clone https://github.com/ellen20/appium-saucelabs-demo-app.git
cd appium-saucelabs-demo-app
npm install
```

### 2. Download the app binaries

App binaries are not committed to this repo (they're large, versioned assets). Download them from Sauce Labs' official releases:

- **Android:** [my-demo-app-android releases](https://github.com/saucelabs/my-demo-app-android/releases) → download `mda-2.2.0-25.apk` → place in `apps/android/`
- **iOS:** [my-demo-app-ios releases](https://github.com/saucelabs/my-demo-app-ios/releases) → download `SauceLabs-Demo-App.Simulator.zip` → unzip → place in `apps/ios/`

### 3. Set up environment variables (for Sauce Labs cloud runs)

```bash
cp .env.example .env
# Fill in your Sauce Labs username and access key
```

### 4a. Run locally against an emulator/simulator

Boot your emulator/simulator first and wait until fully loaded:

```bash
# Android
emulator -avd Pixel_6

# iOS
open -a Simulator
```

Then run:

```bash
npm test
```

### 4b. Run locally against Sauce Labs cloud

No local emulator/simulator needed — Sauce Labs boots and manages the device on their own infrastructure.

```bash
npx wdio run wdio.sauce.conf.ts
```

Results (video, screenshots, logs, pass/fail) are viewable on the [Sauce Labs dashboard](https://app.saucelabs.com/), under the **Automated** tab.

---

## 🧪 Test Architecture

### Page Object Model

Every screen has its own page object exposing:
- **Locators** as getters (using platform-native resource-IDs/accessibility-IDs, verified via Appium Inspector — never guessed)
- **Actions** as async methods (e.g., `login()`, `addToCart()`, `fillShippingAddress()`)

A shared `HeaderComponent` handles elements present across every screen (menu, cart icon, cart badge count), since the app's navigation header persists throughout the entire user journey.

Page object files follow a lowercase, dot-separated naming convention (`login.page.ts`, `checkout.page.ts`) under `test/pages/android/` or `test/pages/ios/`; specs follow `name.e2e.ts` under `test/specs/`.

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
- **CI config inheriting local connection settings** — `wdio.sauce.conf.ts` initially spread in the entire local config (`...localConfig`), which meant it silently inherited `port: 4723` (the local Appium server's default port) instead of using Sauce Labs' cloud endpoint. This caused every session request to hang and eventually time out (`ETIMEDOUT`) rather than fail immediately with a clear error, since it looked like a network issue but was actually a routing issue. Fixed by explicitly clearing `hostname`/`port`/`path` in the Sauce config.
- **Orphaned cloud sessions from premature client retries** — with WebdriverIO's default retry behavior, a slow-to-provision cloud session could get abandoned client-side before finishing server-side, leaving a "ghost" session that silently consumed the account's one concurrent-session slot and caused every subsequent run to fail instantly with a concurrency-limit error. Resolved by setting `connectionRetryCount: 0` and a longer `connectionRetryTimeout`, so a slow run is given time to finish cleanly instead of being abandoned and duplicated.
- **Dependency installed locally but never committed** — `@wdio/sauce-service` worked fine in local runs (since it was physically present in local `node_modules`), but CI's `npm ci` install exact-matches `package.json`/`package-lock.json` and has no access to local `node_modules` — surfacing a "works on my machine" gap that only appeared once the workflow ran on a clean CI environment. Fixed by explicitly re-committing the dependency after confirming it was missing from the pushed manifest.
- **Cloud interaction speed vs. local timeouts** — Mocha's default test timeout (tuned for local emulator speed) was too short for the same steps running against Sauce's cloud, where network round-trips add real latency. Increased `mochaOpts.timeout` specifically in the Sauce config to account for the slower, cloud-based execution environment.

---

## 📊 Test Reporting

This project uses [Allure](https://allurereport.org/) for rich, visual test reports.

```bash
npm run report
```

This generates and opens an interactive HTML report with step-by-step breakdowns and screenshots on failure.

CI runs also upload Allure results as a workflow artifact, viewable from the corresponding GitHub Actions run.

---

## ⚙️ CI/CD (GitHub Actions)

A GitHub Actions workflow (`.github/workflows/android-e2e.yml`) runs the Android E2E suite automatically on push and pull request to `main`.

**Infrastructure limitation discovered:** GitHub-hosted macOS runners are themselves virtual machines, and Android emulators require hardware virtualization (`HVF`/Hypervisor.framework) to run with acceleration — nested virtualization isn't supported on these runners. This was confirmed with an `HVF error: HV_UNSUPPORTED` failure across multiple runner versions (`macos-latest`, `macos-14`) and system image architectures (`x86_64`, `arm64-v8a`). This is a documented constraint of nested virtualization on GitHub's hosted runners, not an issue with this project's test logic — the suite was verified passing via local execution against a physical/local emulator throughout development.

**Resolution implemented:** CI execution now runs against **Sauce Labs' cloud device grid** instead of a local emulator. The workflow uploads the app binary to Sauce Storage, then runs the suite via `wdio.sauce.conf.ts` against a Sauce-hosted virtual device. Since Sauce Labs provisions and manages the device entirely on their own infrastructure, the CI runner never needs to virtualize anything itself — sidestepping the HVF limitation completely. Required credentials (`SAUCE_USERNAME`, `SAUCE_ACCESS_KEY`) are stored as GitHub repository secrets and injected into the workflow at runtime.

**Result:** the workflow is merged into `main` and passing — see the live status badge at the top of this README, or check the [Actions tab](https://github.com/ellen20/appium-saucelabs-demo-app/actions/workflows/android-e2e.yml) for the full run history. Getting here required working through several distinct issues beyond the initial HVF discovery: a config bug that silently routed cloud requests through a local-only port, orphaned cloud sessions from premature client-side retries eating the account's concurrency limit, and a dependency that was installed locally but never committed — each documented in [Real Bugs Found & Fixed](#-real-bugs-found--fixed-during-development) above.

---

## 🗺️ Roadmap

- [x] Full Android purchase flow (login → cart → checkout → payment → order confirmation)
- [x] Page Object Model architecture with shared header component
- [x] Fixtures for test data separation
- [x] Reusable assertion and price-parsing helpers
- [x] Allure reporting integration
- [x] GitHub Actions CI/CD pipeline configured
- [x] Diagnosed GitHub-hosted runner HVF limitation blocking local emulator use in CI
- [x] Migrated CI execution to Sauce Labs cloud device grid
- [ ] iOS purchase flow (parallel page object set, in progress — blocked on an incomplete purchase flow in the current iOS demo app build)
- [ ] Negative/edge-case test coverage (invalid login, empty required fields)

---

## 📝 License

This project is unlicensed — for portfolio/demonstration purposes.

---

**Made with 📱 by Jingling Jin**
