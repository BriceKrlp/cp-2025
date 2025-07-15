
import React, { useState, useEffect } from 'react';
import { VacationType, VacationBalance } from '@/types/vacation';
import VacationTypeSelector from './VacationTypeSelector';
import VacationCalendar from './VacationCalendar';
import VacationSummary from './VacationSummary';
import QuotaSettings from './QuotaSettings';
import AuthModal from './AuthModal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useVacationQuotas } from '@/hooks/useVacationQuotas';
import { useVacationPeriods } from '@/hooks/useVacationPeriods';

const VacationPlanner: React.FC = () => {
  const [selectedType, setSelectedType] = useState<VacationType>('vacation');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading: authLoading, signOut } = useAuth();
  const { quotas, loading: quotasLoading, saveQuotas } = useVacationQuotas(user?.id || null);
  const { periods, loading: periodsLoading, addPeriod, removePeriod } = useVacationPeriods(user?.id || null);

  const [balance, setBalance] = useState<VacationBalance>({
    vacation: { used: 0, remaining: quotas.vacation },
    rtt: { used: 0, remaining: quotas.rtt },
    previousYear: { used: 0, remaining: quotas.previousYear },
    unpaid: { used: 0, remaining: 0 },
  });

  // Recalculer le solde quand les vacances ou quotas changent
  useEffect(() => {
    const usedByType = periods.reduce(
      (acc, vacation) => {
        acc[vacation.type] += vacation.workingDays;
        return acc;
      },
      { vacation: 0, rtt: 0, previousYear: 0, unpaid: 0 }
    );

    setBalance({
      vacation: {
        used: usedByType.vacation,
        remaining: Math.max(0, quotas.vacation - usedByType.vacation),
      },
      rtt: {
        used: usedByType.rtt,
        remaining: Math.max(0, quotas.rtt - usedByType.rtt),
      },
      previousYear: {
        used: usedByType.previousYear,
        remaining: Math.max(0, quotas.previousYear - usedByType.previousYear),
      },
      unpaid: {
        used: usedByType.unpaid,
        remaining: 0,
      },
    });
  }, [periods, quotas]);

  const handleAddVacation = async (newVacation: Omit<VacationPeriod, 'id'>) => {
    // Vérifier si on a assez de jours disponibles
    const currentUsed = balance[newVacation.type].used;
    const quota = quotas[newVacation.type];
    
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

    await addPeriod(newVacation);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const formatNumber = (num: number): string => {
    return num % 1 === 0 ? num.toString() : num.toString().replace('.', ',');
  };

  const totalAvailableDays = quotas.vacation + quotas.rtt + quotas.previousYear;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Planning de Congés 2025
            </h1>
            <p className="text-gray-600 text-lg">
              Connectez-vous pour planifier vos congés avec sauvegarde automatique
            </p>
            <Button onClick={() => setShowAuthModal(true)} size="lg">
              <User className="mr-2 h-5 w-5" />
              Se connecter / S'inscrire
            </Button>
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header avec déconnexion */}
        <div className="flex justify-between items-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Planning de Congés 2025
            </h1>
            <p className="text-gray-600 text-lg">
              Planifiez vos congés avec sauvegarde automatique dans le cloud
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Configuration des quotas */}
        <QuotaSettings 
          quota={quotas}
          onQuotaChange={saveQuotas}
        />

        {/* Résumé des quotas */}
        <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">{formatNumber(quotas.vacation)}</div>
                <div className="text-blue-100">Jours de congés payés</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{formatNumber(quotas.rtt)}</div>
                <div className="text-green-100">Jours de RTT</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{formatNumber(quotas.previousYear)}</div>
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
        <VacationSummary balance={balance} totalQuota={quotas} />

        <Separator className="my-8" />

        {/* Calendrier */}
        <VacationCalendar
          vacations={periods}
          selectedType={selectedType}
          onAddVacation={handleAddVacation}
          onRemoveVacation={removePeriod}
        />
      </div>
    </div>
  );
};

export default VacationPlanner;
