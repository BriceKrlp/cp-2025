
import React, { useState, useEffect } from 'react';
import { VacationPeriod, VacationType, VacationBalance, VacationQuota } from '@/types/vacation';
import VacationTypeSelector from './VacationTypeSelector';
import VacationCalendar from './VacationCalendar';
import VacationSummary from './VacationSummary';
import QuotaSettings from './QuotaSettings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const VacationPlanner: React.FC = () => {
  const [selectedType, setSelectedType] = useState<VacationType>('vacation');
  const [vacations, setVacations] = useState<VacationPeriod[]>([]);
  
  // Quotas initiaux configurables
  const [totalQuota, setTotalQuota] = useState<VacationQuota>({
    vacation: 25, // 5 semaines = 25 jours ouvrés
    rtt: 15,      // 3 semaines = 15 jours ouvrés  
    previousYear: 5, // CP N-1 par défaut
    unpaid: 0,    // Pas de limite pour les congés sans solde
  });

  const [balance, setBalance] = useState<VacationBalance>({
    vacation: { used: 0, remaining: totalQuota.vacation },
    rtt: { used: 0, remaining: totalQuota.rtt },
    previousYear: { used: 0, remaining: totalQuota.previousYear },
    unpaid: { used: 0, remaining: 0 },
  });

  // Recalculer le solde quand les vacances ou quotas changent
  useEffect(() => {
    const usedByType = vacations.reduce(
      (acc, vacation) => {
        acc[vacation.type] += vacation.workingDays;
        return acc;
      },
      { vacation: 0, rtt: 0, previousYear: 0, unpaid: 0 }
    );

    setBalance({
      vacation: {
        used: usedByType.vacation,
        remaining: Math.max(0, totalQuota.vacation - usedByType.vacation),
      },
      rtt: {
        used: usedByType.rtt,
        remaining: Math.max(0, totalQuota.rtt - usedByType.rtt),
      },
      previousYear: {
        used: usedByType.previousYear,
        remaining: Math.max(0, totalQuota.previousYear - usedByType.previousYear),
      },
      unpaid: {
        used: usedByType.unpaid,
        remaining: 0, // Pas de limite
      },
    });
  }, [vacations, totalQuota]);

  const handleAddVacation = (newVacation: Omit<VacationPeriod, 'id'>) => {
    // Vérifier si on a assez de jours disponibles
    const currentUsed = balance[newVacation.type].used;
    const quota = totalQuota[newVacation.type];
    
    if (newVacation.type !== 'unpaid' && currentUsed + newVacation.workingDays > quota) {
      const typeLabels = {
        vacation: 'de congés payés',
        rtt: 'de RTT',
        previousYear: 'de CP N-1',
        unpaid: 'sans solde'
      };
      alert(`Pas assez de jours ${typeLabels[newVacation.type]} disponibles !`);
      return;
    }

    const vacation: VacationPeriod = {
      ...newVacation,
      id: Date.now().toString(),
    };

    setVacations(prev => [...prev, vacation]);
  };

  const handleRemoveVacation = (id: string) => {
    setVacations(prev => prev.filter(v => v.id !== id));
  };

  const formatNumber = (num: number): string => {
    return num % 1 === 0 ? num.toString() : num.toString().replace('.', ',');
  };

  const totalAvailableDays = totalQuota.vacation + totalQuota.rtt + totalQuota.previousYear;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Planning de Congés 2025
          </h1>
          <p className="text-gray-600 text-lg">
            Planifiez vos congés avec vos quotas personnalisés (demi-journées incluses)
          </p>
        </div>

        {/* Configuration des quotas */}
        <QuotaSettings 
          quota={totalQuota}
          onQuotaChange={setTotalQuota}
        />

        {/* Résumé des quotas */}
        <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">{formatNumber(totalQuota.vacation)}</div>
                <div className="text-blue-100">Jours de congés payés</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{formatNumber(totalQuota.rtt)}</div>
                <div className="text-green-100">Jours de RTT</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{formatNumber(totalQuota.previousYear)}</div>
                <div className="text-purple-100">Jours de CP N-1</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{formatNumber(totalAvailableDays)}</div>
                <div className="text-white opacity-90">Total jours disponibles</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sélecteur de type de congé */}
        <Card className="shadow-lg border-0 bg-white">
          <CardContent className="p-6">
            <VacationTypeSelector
              selectedType={selectedType}
              onTypeChange={setSelectedType}
            />
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Récapitulatif */}
        <VacationSummary balance={balance} totalQuota={totalQuota} />

        <Separator className="my-8" />

        {/* Calendrier */}
        <VacationCalendar
          vacations={vacations}
          selectedType={selectedType}
          onAddVacation={handleAddVacation}
          onRemoveVacation={handleRemoveVacation}
        />
      </div>
    </div>
  );
};

export default VacationPlanner;
