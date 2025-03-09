import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const defaultValue = '';
const initialValue = browser ? localStorage.getItem('userCity') || defaultValue : defaultValue;

export const city = writable(initialValue);

city.subscribe(val => {
  if (browser) {
    localStorage.setItem('userCity', val);
  }
});