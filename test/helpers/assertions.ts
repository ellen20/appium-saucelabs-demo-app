import { expect } from '@wdio/globals';
import type { ChainablePromiseElement, ChainablePromiseArray } from 'webdriverio';

export async function expectAllExisting(elements: ChainablePromiseElement[]) {
    for (const el of elements) {
        await expect(el).toBeExisting();
    }
}

export async function expectAllHaveItems(collections: ChainablePromiseArray[]) {
    for (const collection of collections) {
        const resolved = await collection;
        expect(resolved.length).toBeGreaterThan(0);
    }
}