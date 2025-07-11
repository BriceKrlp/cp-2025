
import React from 'react';
import { PeriodType } from '@/types/vacation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Sun, Sunrise, Sunset } from 'lucide-react';

interface PeriodTypeSelectorProps {
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}

const PeriodTypeSelector: React.FC<PeriodTypeSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
}) => {
  const periodOptions = [
    {
      id: 'full' as PeriodType,
      label: 'Journée complète',
      description: '1 jour',
      icon: Sun,
      value: 1,
    },
    {
      id: 'morning' as PeriodType,
      label: 'Matin',
      description: '0,5 jour',
      icon: Sunrise,
      value: 0.5,
    },
    {
      id: 'afternoon' as PeriodType,
      label: 'Après-midi',
      description: '0,5 jour',
      icon: Sunset,
      value: 0.5,
    },
  ];

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">Type de période</Label>
      <RadioGroup
        value={selectedPeriod}
        onValueChange={(value) => onPeriodChange(value as PeriodType)}
        className="grid grid-cols-3 gap-4"
      >
        {periodOptions.map((option) => {
          const Icon = option.icon;
          return (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label
                htmlFor={option.id}
                className="flex items-center space-x-2 cursor-pointer text-sm"
              >
                <Icon className="h-4 w-4" />
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.description}</div>
                </div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default PeriodTypeSelector;
