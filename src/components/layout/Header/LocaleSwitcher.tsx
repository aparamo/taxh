import {useLocale, useTranslations} from 'next-intl';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';
import {locales} from '@/i18n/config';

// Native language names - always display in their own language
const nativeLanguageNames: Record<string, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  pt: 'Português',
  de: 'Deutsch',
  zh: '中文',
};

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={locales.map((loc) => ({
        value: loc,
        label: nativeLanguageNames[loc] || loc
      }))}
      label={t('label')}
    />
  );
}
