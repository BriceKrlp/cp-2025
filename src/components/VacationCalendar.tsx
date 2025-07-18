
import React, { useState } from 'react';
import { VacationPeriod, VacationType, PeriodType } from '@/types/vacation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDateRange, getWorkingDaysBetween, formatWorkingDays } from '@/utils/dateUtils';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { fr } from 'date-fns/locale';
import PeriodTypeSelector from './PeriodTypeSelector';

interface VacationCalendarProps {
  vacations: VacationPeriod[];
  selectedType: VacationType;
  onAddVacation: (vacation: Omit<VacationPeriod, 'id'>) => void;
  onRemoveVacation: (id: string) => void;
}

const VacationCalendar: React.FC<VacationCalendarProps> = ({
  vacations,
  selectedType,
  onAddVacation,
  onRemoveVacation,
}) => {
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('full');
  const [isSelectingRange, setIsSelectingRange] = useState(false);

  const getVacationTypeColor = (type: VacationType) => {
    switch (type) {
      case 'vacation': return 'bg-blue-500 text-white';
      case 'rtt': return 'bg-green-500 text-white';
      case 'previousYear': return 'bg-purple-500 text-white';
      case 'unpaid': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getVacationTypeLabel = (type: VacationType) => {
    switch (type) {
      case 'vacation': return 'CP';
      case 'rtt': return 'RTT';
      case 'previousYear': return 'CP N-1';
      case 'unpaid': return 'CS';
      default: return '';
    }
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    if (!range) {
      setSelectedDates(undefined);
      return;
    }
    
    setSelectedDates(range);
    
    if (range.from && range.to) {
      const workingDays = getWorkingDaysBetween(range.from, range.to, selectedPeriod);
      const newVacation: Omit<VacationPeriod, 'id'> = {
        startDate: range.from,
        endDate: range.to,
        type: selectedType,
        workingDays,
        periodType: selectedPeriod,
      };
      
      onAddVacation(newVacation);
      setSelectedDates(undefined);
      setIsSelectingRange(false);
    }
  };

  const isDateInVacation = (date: Date) => {
    return vacations.some(vacation => 
      date >= vacation.startDate && date <= vacation.endDate
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Planification des congés</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-white hover:bg-gray-50 border-2 shadow-sm"
              onClick={() => setIsSelectingRange(true)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Ajouter une période
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="start">
            <div className="space-y-4">
              <PeriodTypeSelector
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
              <Calendar
                mode="range"
                selected={selectedDates}
                onSelect={handleDateSelect}
                numberOfMonths={2}
                locale={fr}
                className={cn("p-3 pointer-events-auto")}
                modifiers={{
                  vacation: (date) => isDateInVacation(date),
                }}
                modifiersStyles={{
                  vacation: { 
                    backgroundColor: 'rgba(59, 130, 246, 0.3)',
                    color: 'white',
                    fontWeight: 'bold'
                  },
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vue calendrier principale */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="text-center text-gray-700">
              Calendrier {new Date().getFullYear()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="multiple"
              numberOfMonths={1}
              locale={fr}
              className="w-full pointer-events-auto"
              modifiers={{
                vacation: (date) => isDateInVacation(date),
              }}
              modifiersStyles={{
                vacation: { 
                  backgroundColor: 'rgba(59, 130, 246, 0.8)',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: '4px'
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Liste des congés planifiés */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="text-gray-700">Congés planifiés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {vacations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="mx-auto h-12 w-12 mb-3 opacity-50" />
                <p>Aucun congé planifié</p>
                <p className="text-sm">Cliquez sur "Ajouter une période" pour commencer</p>
              </div>
            ) : (
              vacations.map((vacation) => (
                <div
                  key={vacation.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`px-2 py-1 rounded text-xs font-bold ${getVacationTypeColor(vacation.type)}`}>
                      {getVacationTypeLabel(vacation.type)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {formatDateRange(vacation.startDate, vacation.endDate, vacation.periodType)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatWorkingDays(vacation.workingDays)} ouvré{vacation.workingDays > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveVacation(vacation.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VacationCalendar;
