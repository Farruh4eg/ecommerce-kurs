import { writable } from 'svelte/store';

export const totalProductCountStore = writable(0);
export const totalProductPriceStore = writable(new Map<number, number>());

export function incrementTotalCount() {
  totalProductCountStore.update((n) => n + 1);
}

export function decrementTotalCount() {
  totalProductCountStore.update((n) => n - 1);
}
