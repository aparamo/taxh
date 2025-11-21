/**
 * Type-safe utility for translating StoreMessage objects
 * This provides a proper type-safe interface for translating messages from the Zustand store
 * 
 * Based on next-intl best practices for type-safe translations
 * @see https://next-intl-docs.vercel.app/docs/workflows/typescript
 */

import type { StoreMessage } from '../types/translations';


/**
 * Type-safe function to translate a StoreMessage
 * 
 * This function properly handles the translation of StoreMessage objects
 * returned from Zustand store actions. It uses type-safe parameters while
 * maintaining compatibility with next-intl's type system.
 * 
 * The function accepts a translation function from useTranslations and a StoreMessage,
 * then safely translates the message key with its parameters.
 * 
 * @param translateFn - The translation function from useTranslations hook
 * @param message - The StoreMessage object containing the key and optional params
 * @returns The translated string, or the key itself if translation fails
 * 
 * @example
 * ```tsx
 * const t = useTranslations('Game.Store.messages');
 * const translated = translateStoreMessage(t, storeMessage);
 * ```
 */
export function translateStoreMessage(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  translateFn: any,
  message: StoreMessage
): string {
  try {
    // The key is a string that should match a key in the translation namespace
    // We cast to string here because the key is dynamically generated from the store
    // but we know it follows the pattern 'Game.Store.messages.{key}'
    // Since the translation function is already scoped to 'Game.Store.messages',
    // we need to strip that prefix from the key
    let key = message.key;
    const prefix = 'Game.Store.messages.';
    if (key.startsWith(prefix)) {
      key = key.substring(prefix.length);
    }
    
    // Params are optional and can contain string, number, or boolean values
    // This matches next-intl's expected parameter types
    const params = message.params;
    
    // Call the function - we use any here because next-intl's useTranslations
    // returns a function with complex generic types that are incompatible with
    // our simple TranslationFunction type, but functionally they work the same
    return translateFn(key, params);
  } catch (error) {
    // Fallback to key if translation fails
    // This ensures the app doesn't break if a translation key is missing
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Translation failed for key: ${message.key}`, error);
    }
    return message.key;
  }
}
