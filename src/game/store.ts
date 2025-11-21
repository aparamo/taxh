import { create } from 'zustand';
import { GameState, Transaction, Asset, GameRole } from './types';
import { getDefaultScenario } from './data/scenarios';
import { processTransaction } from './logic/transactions';
import { getMechanismById } from './data/mechanisms';
import { getCountryById } from './data/countries';
import { addHeat, reduceHeat, isGameOver } from './logic/heat';
import { 
  checkObjectiveCompletion, 
  canAffordTransaction as validateCanAfford, 
  canPurchaseAsset as validateCanPurchase 
} from './logic/validation';
import { calculatePassiveIncome, calculateMaintenanceCosts, shouldSeizeAsset, storeMoneyInAsset as storeMoneyInAssetLogic, liquidateAsset as liquidateAssetLogic } from './logic/assets';
import { checkBetrayalEvents, checkInvestigationTriggers } from './logic/consequences';
import { getRealCaseById, RealCase } from './data/realCases';
import type { StoreMessage } from './types/translations';

interface GameStore extends GameState {
  // Actions
  initializeGame: (role: GameRole) => void;
  loadRealCase: (caseId: string) => void;
  executeTransaction: (
    amount: number,
    mechanismId: string,
    countryId: string
  ) => { success: boolean; message: StoreMessage };
  purchaseAsset: (asset: Omit<Asset, 'id' | 'purchaseDate'>, countryId?: string) => { success: boolean; message: StoreMessage };
  updateHeat: (heatChange: Partial<GameState['heat']>) => void;
  completeObjective: () => void;
  resetGame: () => void;
  setGameStatus: (status: GameState['gameStatus']) => void;
  getCurrentRealCase: () => RealCase | undefined;
  
  // New asset actions
  payMaintenance: () => { success: boolean; message: StoreMessage };
  collectPassiveIncome: () => void;
  storeMoneyInAsset: (assetId: string, amount: number) => { success: boolean; message: StoreMessage };
  liquidateAsset: (assetId: string) => { success: boolean; message: StoreMessage };
  checkAssetEvents: () => Array<{ type: string; message: StoreMessage; asset?: Asset }>;
  
  // Enhancement actions
  activateEnhancement: (mechanismId: string, countryId: string) => { success: boolean; message: StoreMessage };
  
  // Computed values
  getTotalHeat: () => number;
  getAvailableFunds: () => number;
  canAffordTransaction: (amount: number, mechanismId: string) => boolean;
  getPassiveIncome: () => number;
  getMaintenanceCosts: () => number;
  gameTickInterval?: NodeJS.Timeout;
}

const initialState: Omit<GameState, 'currentObjective'> = {
  role: 'multimillionaire',
  totalFunds: 5000000,
  launderedAmount: 0,
  cleanFunds: 0,
  heat: { legal: 10, media: 5, political: 0, total: 5 },
  activeCountries: [],
  activeMechanisms: [],
  activeEnhancements: [],
  transactions: [],
  assets: [],
  tutorialComplete: false,
  gameStatus: 'tutorial',
  realCaseId: undefined,
  realCaseMode: false,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  currentObjective: getDefaultScenario('multimillionaire').tutorialObjective,
  
  // Initialize game with role
  initializeGame: (role) => {
    const scenario = getDefaultScenario(role);
    const currentState = get();
    
    // Only show tutorial for multimillionaire role if tutorial hasn't been completed yet
    // For other roles, or if tutorial is already complete, start in 'playing' mode
    const shouldShowTutorial = role === 'multimillionaire' && !currentState.tutorialComplete;
    
    set({
      ...initialState,
      role,
      totalFunds: scenario.startingFunds,
      cleanFunds: role === 'cartel' ? 0 : scenario.startingFunds, // Cartel starts with all dirty money
      heat: scenario.startingHeat,
      currentObjective: scenario.tutorialObjective,
      gameStatus: shouldShowTutorial ? 'tutorial' : 'playing',
      activeCountries: [],
      activeMechanisms: [],
      activeEnhancements: [],
      transactions: [],
      assets: [],
      launderedAmount: 0,
      tutorialComplete: currentState.tutorialComplete, // Preserve tutorial completion status
      realCaseId: undefined,
      realCaseMode: false,
    });
  },
  
  // Load a real case scenario
  loadRealCase: (caseId: string) => {
    const realCase = getRealCaseById(caseId);
    if (!realCase) {
      console.error(`Real case ${caseId} not found`);
      return;
    }
    
    const scenario = getDefaultScenario(realCase.role);
    
    set({
      ...initialState,
      role: realCase.role,
      totalFunds: realCase.startingFunds,
      cleanFunds: realCase.startingCleanFunds,
      heat: scenario.startingHeat,
      currentObjective: {
        id: `real-case-${caseId}`,
        description: `Recrea el caso ${realCase.name}. ${realCase.summary}`,
        targets: {
          launderAmount: realCase.totalAmount * 0.3, // 30% of total as goal (reduced from 50%)
          buyAssets: 2,
          maxHeat: 60,
        },
        completed: false,
      },
      gameStatus: 'playing',
      activeCountries: [],
      activeMechanisms: [],
      activeEnhancements: [],
      transactions: [],
      assets: [],
      launderedAmount: 0,
      tutorialComplete: true, // Real cases skip tutorial
      realCaseId: caseId,
      realCaseMode: true,
    });
  },
  
  // Get current real case data
  getCurrentRealCase: () => {
    const state = get();
    if (state.realCaseId) {
      return getRealCaseById(state.realCaseId);
    }
    return undefined;
  },
  
  // Execute a transaction
  executeTransaction: (amount, mechanismId, countryId): { success: boolean; message: StoreMessage } => {
    const state = get();
    
    // Validate mechanism exists
    const mechanism = getMechanismById(mechanismId);
    if (!mechanism) {
      return { 
        success: false, 
        message: {
          key: 'Game.Store.messages.invalidMechanism',
          params: {}
        } as StoreMessage
      };
    }
    
    // Validate country exists and mechanism is available
    const country = getCountryById(countryId);
    if (!country) {
      return { 
        success: false, 
        message: {
          key: 'Game.Store.messages.invalidCountry',
          params: {}
        } as StoreMessage
      };
    }
    
    // In real case mode, allow mechanisms that are part of the real case's core/secondary mechanisms
    // even if they're not normally available in that country
    let isMechanismAllowed = country.availableMechanisms.includes(mechanismId);
    if (!isMechanismAllowed && state.realCaseMode && state.realCaseId) {
      const realCase = getRealCaseById(state.realCaseId);
      if (realCase) {
        const allRealCaseMechanisms = [...realCase.coreMechanisms, ...realCase.secondaryMechanisms];
        isMechanismAllowed = allRealCaseMechanisms.includes(mechanismId);
      }
    }
    
    if (!isMechanismAllowed) {
      return { 
        success: false, 
        message: {
          key: 'Game.Store.messages.mechanismNotAvailableInCountry',
          params: {
            mechanismId,
            countryId: countryId
          }
        } as StoreMessage
      };
    }
    
    // Validate affordability
    const affordCheck = validateCanAfford(amount, mechanismId, state.totalFunds);
    if (!affordCheck.canAfford) {
      return { 
        success: false, 
        message: { 
          key: 'Game.Store.messages.cannotAffordTransaction',
          params: {}
        } as StoreMessage
      };
    }
    
    // Apply role-specific capacity check (this is handled in processTransaction, but we can validate here too)
    if (mechanism) {
      let effectiveCapacity = mechanism.launderCapacity;
      if (state.role === 'cartel') {
        effectiveCapacity = mechanism.launderCapacity * 1.3; // Cartel has 30% more capacity
      }
      if (amount > effectiveCapacity) {
        return { 
          success: false, 
          message: {
            key: 'Game.Store.messages.exceedsEffectiveCapacity',
            params: {
              capacity: effectiveCapacity,
              roleBonus: state.role === 'cartel' ? '+30% capacidad por rol' : ''
            }
          }
        };
      }
    }
    
    try {
      // Process transaction
      const result = processTransaction(
        amount,
        mechanismId,
        countryId,
        state.heat.total,
        state.role,
        state.activeEnhancements
      );
      
      // Create transaction record
      const transaction: Transaction = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        amount,
        sourceCountry: 'origin', // For now, all start from origin
        destinationCountry: countryId,
        mechanism: mechanismId,
        timestamp: Date.now(),
        fees: result.fees,
        heatGenerated: result.heatGenerated.total,
        status: result.success ? 'completed' : 'failed',
      };
      
      if (result.success) {
        // Update state on success
        const newHeat = addHeat(state.heat, result.heatGenerated);
        const newActiveCountries = state.activeCountries.includes(countryId)
          ? state.activeCountries
          : [...state.activeCountries, countryId];
        const newActiveMechanisms = state.activeMechanisms.includes(mechanismId)
          ? state.activeMechanisms
          : [...state.activeMechanisms, mechanismId];
        
        set({
          totalFunds: state.totalFunds - amount - result.fees,
          launderedAmount: state.launderedAmount + result.launderedAmount,
          cleanFunds: state.cleanFunds + result.launderedAmount,
          heat: newHeat,
          activeCountries: newActiveCountries,
          activeMechanisms: newActiveMechanisms,
          transactions: [...state.transactions, transaction],
        });
        
        // Check if game over
        if (isGameOver(newHeat)) {
          set({ gameStatus: 'lost' });
          return { 
            success: true, 
            message: {
              key: 'Game.Store.messages.transactionCompletedGameOver',
              params: {}
            }
          };
        }
        
        // Check objective completion
        const updatedState = get();
        if (checkObjectiveCompletion(updatedState.currentObjective, updatedState)) {
          return { 
            success: true, 
            message: {
              key: 'Game.Store.messages.transactionCompletedObjectiveComplete',
              params: {}
            }
          };
        }
        
        return { 
          success: true, 
          message: {
            key: 'Game.Store.messages.transactionSuccessful',
            params: {
              amount: result.launderedAmount
            }
          }
        };
      } else {
        // Transaction failed but still costs fees
        set({
          totalFunds: state.totalFunds - result.fees,
          transactions: [...state.transactions, transaction],
        });
        
        return { 
          success: false, 
          message: {
            key: 'Game.Store.messages.transactionFailed',
            params: {}
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        message: {
          key: 'Game.Store.messages.transactionUnknownError',
          params: {
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        },
      };
    }
  },
  
  // Purchase an asset
  purchaseAsset: (assetData, countryId) => {
    const state = get();
    
    // Determine which currency to check based on currencyType
    const currencyType = assetData.currencyType || 'clean'; // Default to clean for backwards compat
    let availableFunds = 0;
    
    if (currencyType === 'clean') {
      availableFunds = state.cleanFunds;
    } else if (currencyType === 'dirty') {
      availableFunds = state.totalFunds - state.cleanFunds; // Dirty = total - clean
    } else if (currencyType === 'any') {
      availableFunds = state.totalFunds; // Can use either
    }
    
    const purchaseCheck = validateCanPurchase(assetData.cost, availableFunds);
    if (!purchaseCheck.canPurchase) {
      return { 
        success: false, 
        message: {
          key: 'Game.Store.messages.cannotAffordAsset',
          params: {} as Record<string, string | number | boolean>
        }
      };
    }
    
    // For corruption assets, check if already owned in this country
    if (countryId && (assetData.type === 'politician' || assetData.type === 'judge' || assetData.type === 'police')) {
      const alreadyOwned = state.assets.some(
        (a) => a.type === assetData.type && a.countryId === countryId
      );
      if (alreadyOwned) {
        return { 
          success: false, 
          message: {
            key: 'Game.Store.messages.assetAlreadyOwnedInCountry',
            params: {
              assetType: assetData.type
            } as Record<string, string | number | boolean>
          }
        };
      }
    } else {
      // For non-corruption assets, check if already owned (regardless of country)
      const alreadyOwned = state.assets.some(
        (a) => a.type === assetData.type && !a.countryId
      );
      if (alreadyOwned) {
        return { 
          success: false, 
          message: {
            key: 'Game.Store.messages.assetAlreadyOwned',
            params: {
              assetType: assetData.type
            } as Record<string, string | number | boolean>
          }
        };
      }
    }
    
    const newAsset: Asset = {
      ...assetData,
      id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      purchaseDate: Date.now(),
      countryId: countryId || assetData.countryId,
      storedFunds: 0, // Initialize stored funds
    };
    
    // Determine heat reduction type based on asset type
    let heatType: 'legal' | 'media' | 'political' | 'all' = 'all';
    if (assetData.type === 'judge' || assetData.type === 'police') {
      heatType = 'legal';
    } else if (assetData.type === 'politician') {
      heatType = 'political';
    }
    
    const newHeat = reduceHeat(state.heat, assetData.heatReduction, heatType);
    
    // Deduct cost from appropriate currency
    let newTotalFunds = state.totalFunds;
    let newCleanFunds = state.cleanFunds;
    
    if (currencyType === 'clean') {
      newCleanFunds -= assetData.cost;
      newTotalFunds -= assetData.cost;
    } else if (currencyType === 'dirty') {
      newTotalFunds -= assetData.cost;
      // cleanFunds stays same
    } else {
      // Use clean funds first, then dirty
      if (state.cleanFunds >= assetData.cost) {
        newCleanFunds -= assetData.cost;
      }
      newTotalFunds -= assetData.cost;
    }
    
    set({
      assets: [...state.assets, newAsset],
      totalFunds: newTotalFunds,
      cleanFunds: newCleanFunds,
      heat: newHeat,
    });
    
    // Check investigation triggers
    const updatedState = get();
    const triggers = checkInvestigationTriggers(updatedState.assets, updatedState.heat.total);
    if (triggers.length > 0) {
      const firstTrigger = triggers[0];
      const triggerHeat = addHeat(updatedState.heat, firstTrigger.heatIncrease);
      set({ heat: triggerHeat });
      
      // Check game over
      if (isGameOver(triggerHeat)) {
        set({ gameStatus: 'lost' });
        return { 
          success: true, 
          message: {
            key: 'Game.Store.messages.assetPurchasedGameOver',
            params: {
              assetType: assetData.type,
              triggerMessage: String(firstTrigger.message)
            } as Record<string, string | number | boolean>
          }
        };
      }
      
      return { 
        success: true, 
        message: {
          key: 'Game.Store.messages.assetPurchasedWithTrigger',
          params: {
            assetType: assetData.type,
            triggerMessage: String(firstTrigger.message)
          } as Record<string, string | number | boolean>
        }
      };
    }
    
    // Check objective completion
    if (checkObjectiveCompletion(updatedState.currentObjective, updatedState)) {
      return { 
        success: true, 
        message: {
          key: 'Game.Store.messages.assetPurchasedObjectiveComplete',
          params: {} as Record<string, string | number | boolean>
        }
      };
    }
    
    return { 
      success: true, 
      message: {
        key: 'Game.Store.messages.assetPurchasedSuccessfully',
        params: {
          assetType: assetData.type
        } as Record<string, string | number | boolean>
      }
    };
  },
  
  // Activate an enhancement mechanism (like Nominee Director)
  activateEnhancement: (mechanismId, countryId) => {
    const state = get();
    const mechanism = getMechanismById(mechanismId);
    
    if (!mechanism) {
      return { 
        success: false, 
        message: {
          key: 'Game.Store.messages.invalidMechanism',
          params: {} as Record<string, string | number | boolean>
        }
      };
    }
    
    // Check if mechanism can be activated (has 0 capacity)
    if (mechanism.launderCapacity > 0) {
      return { 
        success: false, 
        message: {
          key: 'Game.Store.messages.notSupportMechanism',
          params: {} as Record<string, string | number | boolean>
        }
      };
    }
    
    // Check if already active
    if (state.activeEnhancements.includes(mechanismId)) {
      return { 
        success: false, 
        message: {
          key: 'Game.Store.messages.enhancementAlreadyActive',
          params: {
            mechanismId
          } as Record<string, string | number | boolean>
        }
      };
    }
    
    // Check if mechanism is available in country
    const country = getCountryById(countryId);
    if (!country) {
      return { 
        success: false, 
        message: {
          key: 'Game.Store.messages.invalidCountry',
          params: {} as Record<string, string | number | boolean>
        }
      };
    }
    
    // In real case mode, allow mechanisms that are part of the real case's core/secondary mechanisms
    // even if they're not normally available in that country
    let isMechanismAllowed = country.availableMechanisms.includes(mechanismId);
    if (!isMechanismAllowed && state.realCaseMode && state.realCaseId) {
      const realCase = getRealCaseById(state.realCaseId);
      if (realCase) {
        const allRealCaseMechanisms = [...realCase.coreMechanisms, ...realCase.secondaryMechanisms];
        isMechanismAllowed = allRealCaseMechanisms.includes(mechanismId);
      }
    }
    
    if (!isMechanismAllowed) {
      return { 
        success: false, 
        message: {
          key: 'Game.Store.messages.mechanismNotAvailableInCountry',
          params: {
            mechanismId,
            countryId: countryId
          } as Record<string, string | number | boolean>
        }
      };
    }
    
    // Check if can afford setup fee
    const setupFee = mechanism.fees.setup;
    if (state.totalFunds < setupFee) {
      return { 
        success: false, 
        message: {
          key: 'Game.Store.messages.insufficientFundsToActivate',
          params: {
            mechanismId,
            setupFee
          } as Record<string, string | number | boolean>
        }
      };
    }
    
    // Deduct setup fee
    const newTotalFunds = state.totalFunds - setupFee;
    const newCleanFunds = Math.max(0, state.cleanFunds - setupFee);
    
    // Generate heat (0.7% as per mechanism definition, but as a flat amount since no amount is laundered)
    const heatGenerated = mechanism.heatGeneration; // This is per $1M, but for setup we'll use it as a flat percentage
    const heatIncrease = {
      legal: heatGenerated * 0.7, // 70% legal heat
      media: heatGenerated * 0.2, // 20% media heat
      political: heatGenerated * 0.1, // 10% political heat
    };
    
    const newHeat = addHeat(state.heat, heatIncrease);
    
    // Add to active enhancements and active mechanisms
    const newActiveEnhancements = [...state.activeEnhancements, mechanismId];
    const newActiveMechanisms = state.activeMechanisms.includes(mechanismId) 
      ? state.activeMechanisms 
      : [...state.activeMechanisms, mechanismId];
    
    // Add country if not already active
    const newActiveCountries = state.activeCountries.includes(countryId)
      ? state.activeCountries
      : [...state.activeCountries, countryId];
    
    set({
      totalFunds: newTotalFunds,
      cleanFunds: newCleanFunds,
      heat: newHeat,
      activeEnhancements: newActiveEnhancements,
      activeMechanisms: newActiveMechanisms,
      activeCountries: newActiveCountries,
    });
    
    // Check game over
    if (isGameOver(newHeat)) {
      set({ gameStatus: 'lost' });
      return { 
        success: true, 
        message: {
          key: 'Game.Store.messages.enhancementActivatedGameOver',
          params: {
            mechanismId
          } as Record<string, string | number | boolean>
        }
      };
    }
    
    return { 
      success: true, 
      message: {
        key: 'Game.Store.messages.enhancementActivatedSuccessfully',
        params: {
          mechanismId
        } as Record<string, string | number | boolean>
      }
    };
  },
  
  // Update heat manually (for special events)
  updateHeat: (heatChange) => {
    const state = get();
    const newHeat = { ...state.heat, ...heatChange };
    newHeat.total = (newHeat.legal + newHeat.media + newHeat.political) / 3;
    
    set({ heat: newHeat });
    
    // Check game over
    if (isGameOver(newHeat)) {
      set({ gameStatus: 'lost' });
    }
  },
  
  // Complete objective
  completeObjective: () => {
    const state = get();
    if (state.currentObjective && !state.currentObjective.completed) {
      const updatedObjective = { ...state.currentObjective, completed: true };
      set({
        currentObjective: updatedObjective,
        tutorialComplete: true,
        gameStatus: 'playing', // Unlock sandbox mode
      });
    }
  },
  
  // Reset game
  resetGame: () => {
    get().initializeGame(get().role);
  },
  
  // Set game status
  setGameStatus: (status) => {
    set({ gameStatus: status });
  },
  
  // Pay maintenance costs for corruption assets
  payMaintenance: () => {
    const state = get();
    const maintenanceCosts = calculateMaintenanceCosts(state.assets);
    
    if (maintenanceCosts === 0) {
      return { 
        success: true, 
        message: {
          key: 'Game.Store.messages.noMaintenanceCosts',
          params: {} as Record<string, string | number | boolean>
        }
      };
    }
    
    if (state.totalFunds < maintenanceCosts) {
      // Can't pay - trigger betrayals
      // Randomly trigger betrayals for assets you can't maintain
      const betrayals = checkBetrayalEvents(state.assets, state.heat);
      
      if (betrayals.length > 0) {
        const totalHeatSpike = { legal: 0, media: 0, political: 0 };
        
        betrayals.forEach(({ asset, betrayalResult }) => {
          totalHeatSpike.legal += betrayalResult.heatSpike.legal;
          totalHeatSpike.media += betrayalResult.heatSpike.media;
          totalHeatSpike.political += betrayalResult.heatSpike.political;
          
          // Remove betrayed asset
          set({ assets: state.assets.filter((a) => a.id !== asset.id) });
        });
        
        const newHeat = addHeat(state.heat, totalHeatSpike);
        set({ heat: newHeat });
        
        if (isGameOver(newHeat)) {
          set({ gameStatus: 'lost' });
          return { 
            success: false, 
            message: {
              key: 'Game.Store.messages.cannotPayMaintenanceGameOver',
              params: {
                betrayalCount: betrayals.length
              } as Record<string, string | number | boolean>
            }
          };
        }
        
        return { 
          success: false, 
          message: {
            key: 'Game.Store.messages.cannotPayMaintenance',
            params: {
              betrayalCount: betrayals.length
            } as Record<string, string | number | boolean>
          }
        };
      }
      
      return { 
        success: false, 
        message: {
          key: 'Game.Store.messages.cannotPayMaintenanceCosts',
          params: {
            amount: maintenanceCosts
          } as Record<string, string | number | boolean>
        }
      };
    }
    
    // Pay maintenance
    set({ totalFunds: state.totalFunds - maintenanceCosts });
    return { 
      success: true, 
      message: {
        key: 'Game.Store.messages.maintenancePaid',
        params: {
          amount: maintenanceCosts
        } as Record<string, string | number | boolean>
      }
    };
  },
  
  // Collect passive income from luxury assets
  collectPassiveIncome: () => {
    const state = get();
    const passiveIncome = calculatePassiveIncome(state.assets);
    
    if (passiveIncome > 0) {
      set({
        cleanFunds: state.cleanFunds + passiveIncome,
        totalFunds: state.totalFunds + passiveIncome,
      });
    }
  },
  
  // Store money in an asset
  storeMoneyInAsset: (assetId, amount) => {
    const state = get();
    const asset = state.assets.find((a) => a.id === assetId);
    
    if (!asset) {
      return { 
        success: false, 
        message: {
          key: 'Game.Store.messages.assetNotFound',
          params: {} as Record<string, string | number | boolean>
        }
      };
    }
    
    if (state.cleanFunds < amount) {
      return { 
        success: false, 
        message: {
          key: 'Game.Store.messages.insufficientCleanFunds',
          params: {} as Record<string, string | number | boolean>
        }
      };
    }
    
    const result = storeMoneyInAssetLogic(asset, amount);
    
    if (result.success) {
      const updatedAssets = state.assets.map((a) =>
        a.id === assetId ? { ...a, storedFunds: result.newStoredFunds } : a
      );
      
      set({
        assets: updatedAssets,
        cleanFunds: state.cleanFunds - amount,
        totalFunds: state.totalFunds - amount,
      });
      
      return {
        success: true,
        message: {
          key: 'Game.Store.messages.moneyStoredInAsset',
          params: {
            amount,
            assetName: asset.name
          } as Record<string, string | number | boolean>
        }
      };
    }
    
    // Convert string message to StoreMessage
    return {
      success: false,
      message: {
        key: 'Game.Store.messages.cannotStoreMoneyInAsset',
        params: {
          reason: result.message
        } as Record<string, string | number | boolean>
      }
    };
  },
  
  // Liquidate an asset
  liquidateAsset: (assetId) => {
    const state = get();
    const asset = state.assets.find((a) => a.id === assetId);
    
    if (!asset) {
      return { 
        success: false, 
        message: {
          key: 'Game.Store.messages.assetNotFound',
          params: {} as Record<string, string | number | boolean>
        }
      };
    }
    
    const result = liquidateAssetLogic(asset);
    
    // Remove asset and refund
    const updatedAssets = state.assets.filter((a) => a.id !== assetId);
    const newTotalFunds = state.totalFunds + result.refundAmount;
    const newCleanFunds = state.cleanFunds + result.refundAmount;
    
    // If lost stored funds, don't add them back
    if (result.loseStoredFunds) {
      // Already accounted for in refundAmount
    }
    
    set({
      assets: updatedAssets,
      totalFunds: newTotalFunds,
      cleanFunds: newCleanFunds,
    });
    
    return {
      success: true,
      message: {
        key: 'Game.Store.messages.assetLiquidated',
        params: {
          assetName: asset.name,
          refundAmount: result.refundAmount,
          lostStoredFunds: result.loseStoredFunds ? 1 : 0
        } as Record<string, string | number | boolean>
      }
    };
  },
  
  // Check for asset events (betrayals, seizures, etc.)
  checkAssetEvents: () => {
    const state = get();
    const events: Array<{ type: string; message: StoreMessage; asset?: Asset }> = [];
    
    // PERFORMANCE: Collect all changes first, then apply in a single state update
    let updatedHeat = state.heat;
    let updatedAssets = [...state.assets];
    let gameOverTriggered = false;
    
    // Check for betrayals
    const betrayals = checkBetrayalEvents(state.assets, state.heat);
    betrayals.forEach(({ asset, betrayalResult }) => {
      events.push({
        type: 'betrayal',
        message: {
          key: 'Game.Store.messages.assetBetrayed',
          params: {
            assetType: asset.type,
            countryId: asset.countryId || ''
          } as Record<string, string | number | boolean>
        },
        asset,
      });
      
      // Apply heat spike (accumulate)
      updatedHeat = addHeat(updatedHeat, betrayalResult.heatSpike);
      
      // Mark asset for removal
      updatedAssets = updatedAssets.filter((a) => a.id !== asset.id);
      
      // Check game over
      if (isGameOver(updatedHeat)) {
        gameOverTriggered = true;
      }
    });
    
    // Check for asset seizures on the current asset list
    const assetsToCheck = [...updatedAssets]; // Snapshot to avoid mutation issues
    assetsToCheck.forEach((asset) => {
      if (shouldSeizeAsset(asset, updatedHeat.total)) {
        events.push({
          type: 'seizure',
          message: {
            key: 'Game.Store.messages.assetSeized',
            params: {
              assetType: asset.type,
              totalLost: (asset.cost || 0) + (asset.storedFunds || 0)
            }
          },
          asset,
        });
        
        // Mark seized asset for removal
        updatedAssets = updatedAssets.filter((a) => a.id !== asset.id);
      }
    });
    
    // CRITICAL: Apply all state changes in a single update to avoid multiple re-renders
    if (events.length > 0) {
      const updates: Partial<GameState> = {
        assets: updatedAssets,
        heat: updatedHeat,
      };
      
      if (gameOverTriggered) {
        updates.gameStatus = 'lost';
      }
      
      set(updates);
    }
    
    return events;
  },
  
  // Computed values
  getTotalHeat: () => get().heat.total,
  getAvailableFunds: () => get().totalFunds,
  canAffordTransaction: (amount, mechanismId) => {
    const state = get();
    return validateCanAfford(amount, mechanismId, state.totalFunds).canAfford;
  },
  getPassiveIncome: () => {
    const state = get();
    return calculatePassiveIncome(state.assets);
  },
  getMaintenanceCosts: () => {
    const state = get();
    return calculateMaintenanceCosts(state.assets);
  },
}));
