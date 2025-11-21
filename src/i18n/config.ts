export type Locale = (typeof locales)[number];

export const locales = ['es', 'en', 'fr', 'pt', 'de', 'zh'] as const;
export const defaultLocale: Locale = 'es';

// Import types early to ensure type augmentation is available
import './types';
