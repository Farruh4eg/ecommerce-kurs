import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const defaultValue = {
  isLoggedIn: false,
};

const initialValue = browser
  ? JSON.parse(window.localStorage.getItem('session')!) || defaultValue
  : defaultValue;

export const session = writable(initialValue);

session.subscribe((value) => {
  if (browser) {
    window.localStorage.setItem('session', JSON.stringify(value));
  }
});

export const wishlistCountStore = writable(0);
export const cartCountStore = writable(0);
