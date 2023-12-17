import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const defaultValue = {
  isLoggedIn: false,
  userData: {},
};

const initialValue = browser
  ? JSON.parse(window.localStorage.getItem('session')) || defaultValue
  : defaultValue;

const session = writable(initialValue);

session.subscribe((value) => {
  if (browser) {
    window.localStorage.setItem('session', JSON.stringify(value));
  }
});

export default session;
