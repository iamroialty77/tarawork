export type EnergyLevel = "High" | "Balanced" | "Low" | "Exhausted";
export type WorkloadStatus = "Underutilized" | "Balanced" | "Overloaded";

export interface UserWellness {
  weeklyCapacity: number; // hours
  currentWorkload: number; // hours (calculated from active tasks)
  energyRating: EnergyLevel;
  focusHours: number;
  burnoutRiskScore: number; // 0-100
  workToRestRatio: number; // ratio
  lastRecoveryBlock?: string; // date
  consecutiveHighLoadDays: number;
  sustainabilityIndex: number; // 0-100: reliability + consistency + health
  energyEfficiency: number; // revenue per focus hour
  verifiedSustainable: boolean; // badge status
}

export interface FocusSession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration: number; // minutes
  tasks: string[]; // task IDs
  interruptionCount: number;
  energyLevelBefore: EnergyLevel;
  energyLevelAfter?: EnergyLevel;
}

export interface TeamWellness {
  teamId: string;
  energyBalance: number; // average energy rating
  overworkedMembers: string[]; // user IDs
  distributionBalance: number; // 0-100
  chronicOvertimePattern: boolean;
}
