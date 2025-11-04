// Game balance configuration
export const balanceConfig = {
  // Betrayal risk base rates by asset type (0-100)
  betrayalRisk: {
    politician: 25,
    judge: 15,
    police: 35,
  },

  // Seizure risk base rates (0-100)
  seizureRisk: {
    yacht: 15,
    mansion: 20,
    art: 10,
  },

  // Passive income rates per game tick (in milliseconds)
  passiveIncome: {
    yacht: 50000, // $50k
    mansion: 30000, // $30k
    art: 20000, // $20k
  },

  // Maintenance costs per game tick
  maintenanceCost: {
    politician: 50000, // $50k
    judge: 100000, // $100k
    police: 30000, // $30k
  },

  // Game tick interval (milliseconds) - how often asset events are checked
  gameTickInterval: 60000, // 60 seconds

  // Heat multipliers for various events
  heatMultipliers: {
    betrayal: 0.5, // Heat increases betrayal chance by up to 50%
    seizure: 2.0, // Heat increases seizure chance by up to 200%
  },

  // Rival interference thresholds
  rivalInterference: {
    low: 2, // 2 corruption assets = 5% increase
    medium: 4, // 4 corruption assets = 15% increase
    high: 6, // 6+ corruption assets = 25% increase
  },

  // Corruption fee escalation
  corruptionFeeEscalation: {
    perAsset: 0.03, // 3% per corruption asset
    maxMultiplier: 1.3, // Cap at 30% increase
  },

  // Asset storage limits
  assetStorage: {
    maxMultiplier: 2, // Can store up to 2x asset cost
  },

  // Liquidation rates
  liquidation: {
    refundRate: 0.7, // Get 70% back when liquidating
  },
};
