
import React from 'react';
import { VacationBalance, VacationType, VacationQuota } from '@/types/vacation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, DollarSign, History } from 'lucide-react';

interface VacationSummaryProps {
  balance: VacationBalance;
  totalQuota: VacationQuota;
}

const VacationSummary: React.FC<VacationSummaryProps> = ({
  balance,
  totalQuota,
}) => {
  const summaryItems = [
    {
      type: 'vacation' as VacationType,
      label: 'Congés payés',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      progressColor: 'bg-blue-500',
    },
    {
      type: 'rtt' as VacationType,
      label: 'RTT',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      progressColor: 'bg-green-500',
    },
    {
      type: 'previousYear' as VacationType,
      label: 'CP N-1',
      icon: History,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      progressColor: 'bg-purple-500',
    },
    {
      type: 'unpaid' as VacationType,
      label: 'Congés sans solde',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      progressColor: 'bg-orange-500',
    },
  ];

  const formatNumber = (num: number): string => {
    return num % 1 === 0 ? num.toString() : num.toString().replace('.', ',');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Récapitulatif des congés</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryItems.map((item) => {
          const Icon = item.icon;
          const typeBalance = balance[item.type];
          const quota = totalQuota[item.type];
          const usagePercentage = quota > 0 ? (typeBalance.used / quota) * 100 : 0;
          
          return (
            <Card key={item.type} className={`${item.bgColor} border-0 shadow-md hover:shadow-lg transition-shadow duration-200`}>
              <CardHeader className="pb-3">
                <CardTitle className={`flex items-center space-x-2 text-sm ${item.color}`}>
                  <Icon size={16} />
                  <span>{item.label}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-800">
                    {formatNumber(typeBalance.used)}
                  </span>
                  <span className="text-sm text-gray-600">
                    / {formatNumber(quota)} jours
                  </span>
                </div>
                {quota > 0 && (
                  <Progress 
                    value={usagePercentage} 
                    className="h-2"
                  />
                )}
                <div className="text-xs text-gray-600">
                  {formatNumber(typeBalance.remaining)} jours restants
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default VacationSummary;
