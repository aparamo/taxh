/**
 * Type augmentation for next-intl to enable type-safe translations
 * This file must be imported early in the application to ensure types are available
 */

import type { locales, defaultLocale } from './config';
import messages from '../../messages/es.json';

declare module 'next-intl' {
  interface AppConfig {
    /**
     * Type-safe messages from the default locale (Spanish)
     * This enables full type checking for all translation keys
     */
    Messages: typeof messages;
    
    /**
     * Type-safe locale values
     * Only locales defined in config are valid
     */
    Locale: (typeof locales)[number];
  }
}

/**
 * Re-export locale types for convenience
 */
export type Locale = (typeof locales)[number];
export type { defaultLocale };

