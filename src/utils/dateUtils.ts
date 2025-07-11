
import { PeriodType } from '@/types/vacation';

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
};

export const getWorkingDaysBetween = (startDate: Date, endDate: Date, periodType: PeriodType = 'full'): number => {
  let workingDays = 0;
  const currentDate = new Date(startDate);
  
  // Si c'est le même jour avec une demi-journée
  if (startDate.getTime() === endDate.getTime() && periodType !== 'full') {
    return isWeekend(startDate) ? 0 : 0.5;
  }
  
  // Si c'est le même jour avec une journée complète
  if (startDate.getTime() === endDate.getTime() && periodType === 'full') {
    return isWeekend(startDate) ? 0 : 1;
  }
  
  // Pour les périodes multi-jours, on compte les jours complets
  while (currentDate <= endDate) {
    if (!isWeekend(currentDate)) {
      workingDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return workingDays;
};

export const formatDateRange = (startDate: Date, endDate: Date, periodType: PeriodType = 'full'): string => {
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'short' 
  };
  
  const periodLabel = {
    full: '',
    morning: ' (matin)',
    afternoon: ' (après-midi)'
  };
  
  if (startDate.getTime() === endDate.getTime()) {
    return startDate.toLocaleDateString('fr-FR', options) + periodLabel[periodType];
  }
  
  return `${startDate.toLocaleDateString('fr-FR', options)} - ${endDate.toLocaleDateString('fr-FR', options)}`;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

export const formatWorkingDays = (days: number): string => {
  if (days === 0.5) {
    return '0,5 jour';
  } else if (days === 1) {
    return '1 jour';
  } else if (days % 1 === 0) {
    return `${days} jours`;
  } else {
    return `${days.toString().replace('.', ',')} jours`;
  }
};
