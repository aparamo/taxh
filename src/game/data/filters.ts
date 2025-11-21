import { GameRole } from '../types';
import { countries } from './countries';
import { mechanisms } from './mechanisms';
import { getAllAssetTemplates } from './assets';
import { getRealCaseById } from './realCases';

/**
 * Get countries available for a specific role/scenario
 * Tutorial mode shows only 3 basic countries (BVI, Panama, Switzerland)
 */
export function getFilteredCountries(role: GameRole, isTutorial: boolean = false): typeof countries {
  if (isTutorial) {
    // Tutorial: Only show basic countries
    return countries.filter(c => ['bvi', 'panama', 'switzerland'].includes(c.id));
  }

  // Role-based filtering
  switch (role) {
    case 'multimillionaire':
      // Multimillionaires prefer established tax havens
      return countries.filter(c => 
        ['bvi', 'panama', 'switzerland', 'cayman', 'luxembourg', 'singapore', 'jersey', 'monaco', 'isle-of-man', 'hong-kong'].includes(c.id)
      );
    
    case 'cartel':
      // Cartels prefer high-secrecy, low-regulation countries
      return countries.filter(c => 
        ['panama', 'uae', 'bvi', 'cayman', 'singapore', 'seychelles', 'mauritius', 'gibraltar'].includes(c.id)
      );
    
    case 'multinational':
      // Multinationals prefer countries with trade mechanisms and banking infrastructure
      return countries.filter(c => 
        ['delaware', 'ireland', 'netherlands', 'luxembourg', 'singapore', 'switzerland', 'hong-kong', 'bermuda', 'mauritius', 'gibraltar'].includes(c.id)
      );
    
    default:
      return countries;
  }
}

/**
 * Get mechanisms available for a specific role/scenario
 * Tutorial mode shows only basic mechanisms (shell-company, trust)
 */
export function getFilteredMechanisms(role: GameRole, isTutorial: boolean = false): typeof mechanisms {
  if (isTutorial) {
    // Tutorial: Only show basic mechanisms
    return mechanisms.filter(m => ['shell-company', 'trust'].includes(m.id));
  }

  // Role-based filtering
  switch (role) {
    case 'multimillionaire':
      // Multimillionaires prefer legal structures
      return mechanisms.filter(m => 
        ['shell-company', 'trust', 'nominee-director', 'beneficial-ownership'].includes(m.id)
      );
    
    case 'cartel':
      // Cartels prefer fast, high-volume mechanisms
      return mechanisms.filter(m => 
        ['trade-based-ml', 'correspondent-banking', 'shell-company'].includes(m.id)
      );
    
    case 'multinational':
      // Multinationals prefer tax optimization mechanisms
      return mechanisms.filter(m => 
        ['transfer-pricing', 'trust', 'shell-company', 'beneficial-ownership'].includes(m.id)
      );
    
    default:
      return mechanisms;
  }
}

/**
 * Get assets available for a specific role/scenario
 * Tutorial mode shows only simple assets (luxury_car, rolex)
 */
export function getFilteredAssets(role: GameRole, isTutorial: boolean = false) {
  if (isTutorial) {
    // Tutorial: Only show simple luxury assets
    return getAllAssetTemplates().filter(a => 
      a.type === 'luxury_car' || a.type === 'rolex'
    );
  }

  const allAssets = getAllAssetTemplates();

  // Role-based filtering
  switch (role) {
    case 'multimillionaire':
      // Multimillionaires prefer luxury assets and low-risk corruption
      return allAssets.filter(a => 
        !a.isCorruption || a.type === 'politician' || a.type === 'judge'
      );
    
    case 'cartel':
      // Cartels prefer corruption assets for protection, avoid luxury assets
      return allAssets.filter(a => 
        a.isCorruption || a.type === 'yacht' || a.type === 'luxury_car'
      );
    
    case 'multinational':
      // Multinationals prefer corporate assets, infrastructure, and avoid luxury assets
      return allAssets.filter(a => 
        // Corporate assets
        a.type === 'corporate_office' ||
        a.type === 'patent_portfolio' ||
        a.type === 'offshore_subsidiary' ||
        a.type === 'distribution_network' ||
        a.type === 'data_center' ||
        // Infrastructure
        a.type === 'bank_relationship' ||
        // Low-profile corruption only
        (a.isCorruption && a.type === 'politician')
      );
    
    default:
      return allAssets;
  }
}

/**
 * Get countries available for a specific real case
 * Returns two-tier system: core (historically used) and secondary (contextually relevant)
 * ONLY APPLIES WHEN realCaseMode === true
 */
export function getFilteredCountriesForRealCase(caseId: string) {
  const realCase = getRealCaseById(caseId);
  
  if (!realCase) {
    // Fallback to all countries if case not found
    return {
      core: [],
      secondary: [],
      all: countries
    };
  }
  
  const core = countries.filter(c => realCase.coreCountries.includes(c.id));
  const secondary = countries.filter(c => realCase.secondaryCountries.includes(c.id));
  
  return {
    core,
    secondary,
    all: [...core, ...secondary]
  };
}

/**
 * Get mechanisms available for a specific real case
 * Returns two-tier system: core (historically used) and secondary (contextually relevant)
 * ONLY APPLIES WHEN realCaseMode === true
 */
export function getFilteredMechanismsForRealCase(caseId: string) {
  const realCase = getRealCaseById(caseId);
  
  if (!realCase) {
    // Fallback to all mechanisms if case not found
    return {
      core: [],
      secondary: [],
      all: mechanisms
    };
  }
  
  const core = mechanisms.filter(m => realCase.coreMechanisms.includes(m.id));
  const secondary = mechanisms.filter(m => realCase.secondaryMechanisms.includes(m.id));
  
  return {
    core,
    secondary,
    all: [...core, ...secondary]
  };
}

/**
 * Get assets available for a specific real case
 * ONLY APPLIES WHEN realCaseMode === true
 */
export function getFilteredAssetsForRealCase(caseId: string) {
  const realCase = getRealCaseById(caseId);
  
  if (!realCase) {
    // Fallback to all assets if case not found
    return getAllAssetTemplates();
  }
  
  const allAssets = getAllAssetTemplates();
  return allAssets.filter(a => realCase.recommendedAssets.includes(a.type));
}
