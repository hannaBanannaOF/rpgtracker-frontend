import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async () => {
  const defaultLocale = 'en';
  const suportedLocales = ['en', 'pt-BR'];

  let locale = navigator.language;
  if (!suportedLocales.includes(locale)) {
    locale = locale.split('-')[0];
    if (!suportedLocales.includes(locale)) {
      locale = defaultLocale;
    }
  }
 
  return {
    locale,
    messages: (await import(`./translations/${locale}.json`)).default
  };
});