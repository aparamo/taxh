/**
 * Helper functions and components for type-safe game data translations
 * These provide a consistent API for accessing translated game content
 */

import { useTranslations } from 'next-intl';
import React from 'react';

// ============================================================================
// Hook-based translation functions (for use in React components)
// ============================================================================

/**
 * Get translated country name and description
 * @param countryId - The country ID (e.g., 'panama', 'bvi')
 * @returns Object with translated name and description
 */
export function useCountryTranslation(countryId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations(`GameData.Countries.${countryId}` as any) as any;
  return {
    name: t('name'),
    description: t('description'),
  };
}

/**
 * Get translated mechanism name and description
 * @param mechanismId - The mechanism ID (e.g., 'shell-company', 'trust')
 * @returns Object with translated name and description
 */
export function useMechanismTranslation(mechanismId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations(`GameData.Mechanisms.${mechanismId}` as any) as any;
  return {
    name: t('name'),
    description: t('description'),
  };
}

/**
 * Get translated asset name and description
 * @param assetType - The asset type (e.g., 'yacht', 'mansion', 'politician')
 * @returns Object with translated name and description
 */
export function useAssetTranslation(assetType: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations(`GameData.Assets.${assetType}` as any) as any;
  return {
    name: t('name'),
    description: t('description'),
  };
}

/**
 * Get translated scenario title and description
 * @param scenarioId - The scenario ID
 * @returns Object with translated title and description
 */
export function useScenarioTranslation(scenarioId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations(`GameData.Scenarios.${scenarioId}` as any) as any;
  return {
    title: t('title'),
    description: t('description'),
  };
}

/**
 * Get translated real case name and summary
 * @param caseId - The real case ID (e.g., 'panama-papers', '1mdb')
 * @returns Object with translated name and summary
 */
export function useRealCaseTranslation(caseId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations(`GameData.RealCases.${caseId}` as any) as any;
  return {
    name: t('name'),
    summary: t('summary'),
  };
}

/**
 * Get translated educational content
 * @param contentId - The educational content ID
 * @returns Translated content object
 */
export function useEducationalContentTranslation(contentId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations(`GameData.EducationalContent.${contentId}` as any) as any;
  return {
    title: t('title'),
    description: t('description'),
    content: t('content'),
  };
}

// ============================================================================
// Helper Components for JSX (better for use in loops and conditionals)
// ============================================================================

/**
 * Display component for country name with fallback
 */
export function CountryNameDisplay({ 
  countryId, 
  fallbackName, 
  className = "font-bold text-white text-lg" 
}: { 
  countryId: string; 
  fallbackName: string; 
  className?: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations(`GameData.Countries.${countryId}` as any) as any;
  try {
    return <span className={className}>{t('name')}</span>;
  } catch {
    return <span className={className}>{fallbackName}</span>;
  }
}

/**
 * Display component for country description with fallback
 */
export function CountryDescriptionDisplay({ 
  countryId, 
  fallbackDescription, 
  className = "text-sm text-gray-400" 
}: { 
  countryId: string; 
  fallbackDescription: string; 
  className?: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations(`GameData.Countries.${countryId}` as any) as any;
  try {
    return <p className={className}>{t('description')}</p>;
  } catch {
    return <p className={className}>{fallbackDescription}</p>;
  }
}

/**
 * Display component for mechanism name with fallback
 */
export function MechanismNameDisplay({ 
  mechanismId, 
  fallbackName, 
  className = "font-bold text-white" 
}: { 
  mechanismId: string; 
  fallbackName: string; 
  className?: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations(`GameData.Mechanisms.${mechanismId}` as any) as any;
  try {
    return <h3 className={className}>{t('name')}</h3>;
  } catch {
    return <h3 className={className}>{fallbackName}</h3>;
  }
}

/**
 * Display component for mechanism description with fallback
 */
export function MechanismDescriptionDisplay({ 
  mechanismId, 
  fallbackDescription, 
  className = "text-sm text-gray-400 mb-3 line-clamp-2" 
}: { 
  mechanismId: string; 
  fallbackDescription: string; 
  className?: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations(`GameData.Mechanisms.${mechanismId}` as any) as any;
  try {
    return <p className={className}>{t('description')}</p>;
  } catch {
    return <p className={className}>{fallbackDescription}</p>;
  }
}

/**
 * Display component for asset name with fallback
 */
export function AssetNameDisplay({ 
  assetType, 
  fallbackName, 
  className = "font-bold text-white" 
}: { 
  assetType: string; 
  fallbackName: string; 
  className?: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations(`GameData.Assets.${assetType}` as any) as any;
  try {
    return <span className={className}>{t('name')}</span>;
  } catch {
    return <span className={className}>{fallbackName}</span>;
  }
}

/**
 * Display component for asset description with fallback
 */
export function AssetDescriptionDisplay({ 
  assetType, 
  fallbackDescription, 
  className = "text-sm text-gray-400" 
}: { 
  assetType: string; 
  fallbackDescription: string; 
  className?: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations(`GameData.Assets.${assetType}` as any) as any;
  try {
    return <p className={className}>{t('description')}</p>;
  } catch {
    return <p className={className}>{fallbackDescription}</p>;
  }
}

/**
 * Display component for real case name with fallback
 */
export function RealCaseNameDisplay({ 
  caseId, 
  fallbackName, 
  className = "text-xl font-bold text-white" 
}: { 
  caseId: string; 
  fallbackName: string; 
  className?: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations(`GameData.RealCases.${caseId}` as any) as any;
  try {
    return <span className={className}>{t('name')}</span>;
  } catch {
    return <span className={className}>{fallbackName}</span>;
  }
}

/**
 * Display component for real case summary with fallback
 */
export function RealCaseSummaryDisplay({ 
  caseId, 
  fallbackSummary, 
  className = "text-sm text-gray-400" 
}: { 
  caseId: string; 
  fallbackSummary: string; 
  className?: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations(`GameData.RealCases.${caseId}` as any) as any;
  try {
    return <p className={className}>{t('summary')}</p>;
  } catch {
    return <p className={className}>{fallbackSummary}</p>;
  }
}

// ============================================================================
// Non-React helper functions (for use in Zustand store, game logic, etc.)
// ============================================================================

/**
 * Get translated country name (for non-React contexts)
 * @param countryId - The country ID
 * @param _locale - The locale (defaults to 'es') - unused for now
 * @returns Translated country name or fallback
 * @deprecated Use translation keys in store instead. This is a temporary fallback.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getTranslatedCountryName(countryId: string, _locale: string = 'es'): string {
  // This will be used server-side or in non-React contexts
  // For now, fallback to the original data
  // TODO: Implement proper server-side translation lookup
  return countryId;
}

/**
 * Get translated mechanism name (for non-React contexts)
 * @param mechanismId - The mechanism ID
 * @param _locale - The locale (defaults to 'es') - unused for now
 * @returns Translated mechanism name or fallback
 * @deprecated Use translation keys in store instead. This is a temporary fallback.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getTranslatedMechanismName(mechanismId: string, _locale: string = 'es'): string {
  // This will be used server-side or in non-React contexts
  // For now, fallback to the original data
  // TODO: Implement proper server-side translation lookup
  return mechanismId;
}

/**
 * Get translated asset name (for non-React contexts)
 * @param assetType - The asset type
 * @param _locale - The locale (defaults to 'es') - unused for now
 * @returns Translated asset name or fallback
 * @deprecated Use translation keys in store instead. This is a temporary fallback.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getTranslatedAssetName(assetType: string, _locale: string = 'es'): string {
  // This will be used server-side or in non-React contexts
  // For now, fallback to the original data
  // TODO: Implement proper server-side translation lookup
  return assetType;
}

