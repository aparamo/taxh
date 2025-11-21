/**
 * Type definitions for translation messages and keys
 * Used throughout the game for type-safe translation handling
 */

/**
 * Structure for a translation key with optional parameters
 * Used by Zustand store and other non-React contexts
 */
export interface TranslationKey {
  /** The translation key path (e.g., 'Game.Store.messages.assetPurchased') */
  key: string;
  /** Optional parameters for the translation (e.g., { assetType: 'yacht', amount: 1000 }) */
  params?: Record<string, string | number | boolean>;
}

/**
 * Structure for store messages returned from Zustand actions
 * Components will translate these using useTranslations
 */
export interface StoreMessage extends TranslationKey {
  /** Translation namespace (e.g., 'Game.Store.messages') */
  namespace?: string;
}

/**
 * Type guard to check if an object is a TranslationKey
 */
export function isTranslationKey(value: unknown): value is TranslationKey {
  return (
    typeof value === 'object' &&
    value !== null &&
    'key' in value &&
    typeof (value as TranslationKey).key === 'string'
  );
}

/**
 * Helper type for game data translation keys
 * Ensures type safety when accessing GameData translations
 */
export type GameDataTranslationKey =
  | `GameData.Countries.${string}.${'name' | 'description'}`
  | `GameData.Mechanisms.${string}.${'name' | 'description'}`
  | `GameData.Assets.${string}.${'name' | 'description'}`
  | `GameData.Scenarios.${string}.${'title' | 'description'}`
  | `GameData.RealCases.${string}.${'name' | 'summary'}`;

