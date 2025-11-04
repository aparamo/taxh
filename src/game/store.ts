import { create } from 'zustand';
import { GameState, Transaction, Asset, GameRole } from './types';
import { getDefaultScenario } from './data/scenarios';
import { processTransaction } from './logic/transactions';
import { getMechanismById } from './data/mechanisms';
import { addHeat, reduceHeat, isGameOver } from './logic/heat';
import { 
  checkObjectiveCompletion, 
  canAffordTransaction as validateCanAfford, 
  canPurchaseAsset as validateCanPurchase 
} from './logic/validation';
import { calculatePassiveIncome, calculateMaintenanceCosts, shouldSeizeAsset, storeMoneyInAsset as storeMoneyInAssetLogic, liquidateAsset as liquidateAssetLogic } from './logic/assets';
import { checkBetrayalEvents, checkInvestigationTriggers } from './logic/consequences';
import { getRealCaseById, RealCase } from './data/realCases';

interface GameStore extends GameState {
  // Actions
  initializeGame: (role: GameRole) => void;
  loadRealCase: (caseId: string) => void;
  executeTransaction: (
    amount: number,
    mechanismId: string,
    countryId: string
  ) => { success: boolean; message: string };
  purchaseAsset: (asset: Omit<Asset, 'id' | 'purchaseDate'>, countryId?: string) => { success: boolean; message: string };
  updateHeat: (heatChange: Partial<GameState['heat']>) => void;
  completeObjective: () => void;
  resetGame: () => void;
  setGameStatus: (status: GameState['gameStatus']) => void;
  getCurrentRealCase: () => RealCase | undefined;
  
  // New asset actions
  payMaintenance: () => { success: boolean; message: string };
  collectPassiveIncome: () => void;
  storeMoneyInAsset: (assetId: string, amount: number) => { success: boolean; message: string };
  liquidateAsset: (assetId: string) => { success: boolean; message: string };
  checkAssetEvents: () => Array<{ type: string; message: string; asset?: Asset }>;
  
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
  executeTransaction: (amount, mechanismId, countryId) => {
    const state = get();
    
    // Validate affordability
    const affordCheck = validateCanAfford(amount, mechanismId, state.totalFunds);
    if (!affordCheck.canAfford) {
      return { success: false, message: affordCheck.reason || 'No puedes permitirte esta transacción' };
    }
    
    // Apply role-specific capacity check (this is handled in processTransaction, but we can validate here too)
    const mechanism = getMechanismById(mechanismId);
    if (mechanism) {
      let effectiveCapacity = mechanism.launderCapacity;
      if (state.role === 'cartel') {
        effectiveCapacity = mechanism.launderCapacity * 1.3; // Cartel has 30% more capacity
      }
      if (amount > effectiveCapacity) {
        return { 
          success: false, 
          message: `El monto excede la capacidad efectiva de ${effectiveCapacity.toLocaleString()} (${state.role === 'cartel' ? '+30% capacidad por rol' : ''})` 
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
        state.role
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
          return { success: true, message: 'Transacción completada, pero el heat ha alcanzado niveles críticos. Game Over.' };
        }
        
        // Check objective completion
        const updatedState = get();
        if (checkObjectiveCompletion(updatedState.currentObjective, updatedState)) {
          return { success: true, message: 'Transacción completada. ¡Objetivo del tutorial completado!' };
        }
        
        return { success: true, message: `Transacción exitosa. Lavaste $${result.launderedAmount.toLocaleString()}` };
      } else {
        // Transaction failed but still costs fees
        set({
          totalFunds: state.totalFunds - result.fees,
          transactions: [...state.transactions, transaction],
        });
        
        return { success: false, message: 'Transacción fallida. Pagaste las comisiones pero el dinero no se lavó.' };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido en la transacción',
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
      return { success: false, message: purchaseCheck.reason || 'No puedes permitirte este activo' };
    }
    
    // For corruption assets, check if already owned in this country
    if (countryId && (assetData.type === 'politician' || assetData.type === 'judge' || assetData.type === 'police')) {
      const alreadyOwned = state.assets.some(
        (a) => a.type === assetData.type && a.countryId === countryId
      );
      if (alreadyOwned) {
        return { success: false, message: `Ya tienes ${assetData.name} en este país` };
      }
    } else {
      // For non-corruption assets, check if already owned (regardless of country)
      const alreadyOwned = state.assets.some(
        (a) => a.type === assetData.type && !a.countryId
      );
      if (alreadyOwned) {
        return { success: false, message: `Ya posees ${assetData.name}` };
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
        return { success: true, message: `${assetData.name} comprado. ${firstTrigger.message} Game Over.` };
      }
      
      return { success: true, message: `${assetData.name} comprado. ${firstTrigger.message}` };
    }
    
    // Check objective completion
    if (checkObjectiveCompletion(updatedState.currentObjective, updatedState)) {
      return { success: true, message: 'Activo comprado. ¡Objetivo del tutorial completado!' };
    }
    
    return { success: true, message: `${assetData.name} comprado exitosamente` };
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
      return { success: true, message: 'No hay costos de mantenimiento' };
    }
    
    if (state.totalFunds < maintenanceCosts) {
      // Can't pay - trigger betrayals
      // Randomly trigger betrayals for assets you can't maintain
      const betrayals = checkBetrayalEvents(state.assets, state.heat);
      
      if (betrayals.length > 0) {
        const totalHeatSpike = { legal: 0, media: 0, political: 0 };
        const messages: string[] = [];
        
        betrayals.forEach(({ asset, betrayalResult }) => {
          totalHeatSpike.legal += betrayalResult.heatSpike.legal;
          totalHeatSpike.media += betrayalResult.heatSpike.media;
          totalHeatSpike.political += betrayalResult.heatSpike.political;
          messages.push(betrayalResult.message);
          
          // Remove betrayed asset
          set({ assets: state.assets.filter((a) => a.id !== asset.id) });
        });
        
        const newHeat = addHeat(state.heat, totalHeatSpike);
        set({ heat: newHeat });
        
        if (isGameOver(newHeat)) {
          set({ gameStatus: 'lost' });
          return { success: false, message: `No puedes pagar mantenimiento. ${messages.join(' ')} Game Over.` };
        }
        
        return { success: false, message: `No puedes pagar mantenimiento. ${messages.join(' ')}` };
      }
      
      return { success: false, message: `No puedes pagar los costos de mantenimiento ($${maintenanceCosts.toLocaleString()})` };
    }
    
    // Pay maintenance
    set({ totalFunds: state.totalFunds - maintenanceCosts });
    return { success: true, message: `Pagaste $${maintenanceCosts.toLocaleString()} en mantenimiento` };
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
      return { success: false, message: 'Activo no encontrado' };
    }
    
    if (state.cleanFunds < amount) {
      return { success: false, message: 'Fondos limpios insuficientes' };
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
    }
    
    return { success: result.success, message: result.message };
  },
  
  // Liquidate an asset
  liquidateAsset: (assetId) => {
    const state = get();
    const asset = state.assets.find((a) => a.id === assetId);
    
    if (!asset) {
      return { success: false, message: 'Activo no encontrado' };
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
    
    return { success: true, message: result.message };
  },
  
  // Check for asset events (betrayals, seizures, etc.)
  checkAssetEvents: () => {
    const state = get();
    const events: Array<{ type: string; message: string; asset?: Asset }> = [];
    
    // PERFORMANCE: Collect all changes first, then apply in a single state update
    let updatedHeat = state.heat;
    let updatedAssets = [...state.assets];
    let gameOverTriggered = false;
    
    // Check for betrayals
    const betrayals = checkBetrayalEvents(state.assets, state.heat);
    betrayals.forEach(({ asset, betrayalResult }) => {
      events.push({
        type: 'betrayal',
        message: betrayalResult.message,
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
          message: `Las autoridades confiscaron tu ${asset.name}. Perdiste $${((asset.cost || 0) + (asset.storedFunds || 0)).toLocaleString()}.`,
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
