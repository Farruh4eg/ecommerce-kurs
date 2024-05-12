import { writable } from 'svelte/store';

export const totalProductCountStore = writable<Record<string, number>>({});
export const totalProductPriceStore = writable<Record<string, number>>({});
