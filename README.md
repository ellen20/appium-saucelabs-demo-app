# Appium Sauce Labs Demo App — E2E Test Automation

> Native mobile test automation for Sauce Labs' official demo app, built with Appium, WebdriverIO, and TypeScript.

![Appium](https://img.shields.io/badge/appium-2.0-purple)
![WebdriverIO](https://img.shields.io/badge/webdriverio-9.x-orange)
![TypeScript](https://img.shields.io/badge/typescript-strict-blue)
![Platform](https://img.shields.io/badge/platform-Android-green)
![iOS Status](https://img.shields.io/badge/iOS-in%20progress-lightgrey)
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
| CI/CD | GitHub Actions (see known limitation below) |
| Target App | [Sauce Labs My Demo App](https://github.com/saucelabs/my-demo-app-android) (Android), iOS support in progress |
| Cloud Testing | Sauce Labs (config included, local emulator/simulator used for development) |

---

## 📁 Project Structure
