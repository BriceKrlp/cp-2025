
export interface VacationPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  type: VacationType;
  workingDays: number; // Peut maintenant être décimal (0.5, 1, 1.5, etc.)
  periodType: PeriodType; // Nouveau champ pour le type de période
  description?: string;
}

export type VacationType = 'vacation' | 'rtt' | 'unpaid' | 'previousYear';

export type PeriodType = 'full' | 'morning' | 'afternoon';

export interface VacationQuota {
  vacation: number;
  rtt: number;
  unpaid: number;
  previousYear: number;
}

export interface VacationBalance {
  vacation: { used: number; remaining: number };
  rtt: { used: number; remaining: number };
  unpaid: { used: number; remaining: number };
  previousYear: { used: number; remaining: number };
}
