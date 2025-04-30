import { createI18n } from 'vue-i18n';
import messages from '@intlify/unplugin-vue-i18n/messages';

export const i18n = createI18n({
    globalInjection: false,
    legacy: false,
    allowComposition: true,
    locale: 'en',
    fallbackLocale: 'en',
    messages
});

export async function setLocale(locale: string) {
    // Load locale if not available yet.
    // if (!i18n.global.availableLocales.includes(locale)) {
    //     const messages = await loadLocale(locale);
    //     // fetch() error occurred.
    //     if (messages === null) {
    //         return;
    //     }
    //     // Add locale.
    //     i18n.global.setLocaleMessage(locale, messages);
    // }

    // Set locale.
    i18n.global.locale.value = locale;
}

export function setLocaleMessage(locale: string, locMessages: any) {
    // [OJO] esto es para funcionar con las etiquetas de los ficheros!
    if (!import.meta.env.PROD) return;

    if (locMessages && typeof locMessages === 'object') {
        if (Object.keys(locMessages).length > 0) {
            i18n.global.mergeLocaleMessage(locale, locMessages);
        }
    }
}
