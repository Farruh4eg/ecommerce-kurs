import { writable } from "svelte/store";

export const session = writable({
  isLoggedIn: false,
});

export const login = () => {
  session.update((state) => {
    return { ...state, isLoggedIn: true };
  });
};

export const logout = () => {
  session.update((state) => {
    return { ...state, isLoggedIn: false };
  });
};
