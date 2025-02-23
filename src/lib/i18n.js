import { register, init } from 'svelte-i18n';

register('en', () => import('./locals/en.json'));
register('fr', () => import('./locals/fr.json'));

init({
    fallbackLocale: 'fr',
    initialLocale: {navigator: true},
});