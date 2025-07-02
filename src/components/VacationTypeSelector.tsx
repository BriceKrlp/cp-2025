
import React from 'react';
import { VacationType } from '@/types/vacation';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, DollarSign } from 'lucide-react';

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
      icon: Calendar,
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'rtt' as VacationType,
      label: 'RTT',
      icon: Clock,
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
    },
    {
      id: 'unpaid' as VacationType,
      label: 'Congés sans solde',
      icon: DollarSign,
      color: 'bg-orange-500 hover:bg-orange-600',
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800">Type de congé</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {types.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <Button
              key={type.id}
              variant={isSelected ? "default" : "outline"}
              className={`p-4 h-auto flex flex-col items-center space-y-2 transition-all duration-200 ${
                isSelected 
                  ? `${type.color} text-white shadow-lg scale-105` 
                  : `${type.bgColor} ${type.textColor} border-2 hover:scale-102 hover:shadow-md`
              }`}
              onClick={() => onTypeChange(type.id)}
            >
              <Icon size={24} />
              <span className="text-sm font-medium">{type.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default VacationTypeSelector;
