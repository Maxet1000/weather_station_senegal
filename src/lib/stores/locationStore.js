// locationStore.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const defaultValue = '1'; // set default to "1" if that's what you need
const initialValue = browser ? localStorage.getItem('userCity') || defaultValue : defaultValue;

export const storedStation = writable(initialValue);

storedStation.subscribe(val => {
  if (browser) {
    localStorage.setItem('userCity', val);
  }
});
