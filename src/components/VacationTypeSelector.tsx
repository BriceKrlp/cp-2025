
import React from 'react';
import { VacationType } from '@/types/vacation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, DollarSign, History } from 'lucide-react';

interface VacationTypeSelectorProps {
  selectedType: VacationType;
  onTypeChange: (type: VacationType) => void;
}

const VacationTypeSelector: React.FC<VacationTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
}) => {
  const types = [
    {
      id: 'vacation' as VacationType,
      label: 'Congés payés',
      description: 'Congés payés de l\'année en cours',
      icon: Calendar,
      color: 'blue',
    },
    {
      id: 'rtt' as VacationType,
      label: 'RTT',
      description: 'Réduction du temps de travail',
      icon: Clock,
      color: 'green',
    },
    {
      id: 'previousYear' as VacationType,
      label: 'CP N-1',
      description: 'Congés payés de l\'année précédente',
      icon: History,
      color: 'purple',
    },
    {
      id: 'unpaid' as VacationType,
      label: 'Congés sans solde',
      description: 'Congés non rémunérés',
      icon: DollarSign,
      color: 'orange',
    },
  ];

  const getButtonClasses = (type: VacationType) => {
    const baseClasses = "flex flex-col items-center space-y-2 p-4 h-auto";
    const isSelected = selectedType === type;
    
    const colorClasses = {
      blue: isSelected 
        ? "bg-blue-100 border-blue-500 text-blue-700" 
        : "hover:bg-blue-50 border-gray-200",
      green: isSelected 
        ? "bg-green-100 border-green-500 text-green-700" 
        : "hover:bg-green-50 border-gray-200",
      purple: isSelected 
        ? "bg-purple-100 border-purple-500 text-purple-700" 
        : "hover:bg-purple-50 border-gray-200",
      orange: isSelected 
        ? "bg-orange-100 border-orange-500 text-orange-700" 
        : "hover:bg-orange-50 border-gray-200",
    };
    
    return `${baseClasses} ${colorClasses[type as keyof typeof colorClasses]}`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Type de congé à planifier</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {types.map((type) => {
          const Icon = type.icon;
          return (
            <Button
              key={type.id}
              variant="outline"
              className={getButtonClasses(type.id)}
              onClick={() => onTypeChange(type.id)}
            >
              <Icon className="h-6 w-6" />
              <div className="text-sm font-medium">{type.label}</div>
              <div className="text-xs text-gray-500 text-center">{type.description}</div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default VacationTypeSelector;
