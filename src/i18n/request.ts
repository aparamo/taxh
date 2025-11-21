import {getRequestConfig} from 'next-intl/server';
import {getUserLocale} from '../services/locale';
import type {Locale} from './config';

export default getRequestConfig(async () => {
  const locale = await getUserLocale() as Locale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
