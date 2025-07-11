
export interface VacationPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  type: VacationType;
  workingDays: number;
  description?: string;
}

export type VacationType = 'vacation' | 'rtt' | 'unpaid' | 'previousYear';

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
