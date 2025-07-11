import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save, X } from 'lucide-react';
import { VacationQuota } from '@/types/vacation';

interface QuotaSettingsProps {
  quota: VacationQuota;
  onQuotaChange: (newQuota: VacationQuota) => void;
}

const QuotaSettings: React.FC<QuotaSettingsProps> = ({
  quota,
  onQuotaChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempQuota, setTempQuota] = useState(quota);
  // État pour les valeurs textuelles des inputs
  const [inputValues, setInputValues] = useState({
    vacation: quota.vacation.toString().replace('.', ','),
    rtt: quota.rtt.toString().replace('.', ','),
    previousYear: quota.previousYear.toString().replace('.', ',')
  });

  const formatNumber = (num: number): string => {
    return num % 1 === 0 ? num.toString() : num.toString().replace('.', ',');
  };

  const parseNumber = (value: string): number => {
    // Remplacer les virgules par des points pour le parsing
    const normalizedValue = value.replace(',', '.');
    const parsed = parseFloat(normalizedValue);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleInputChange = (field: keyof VacationQuota, value: string) => {
    // Permettre seulement les chiffres, virgules et points (une seule virgule/point max)
    let sanitizedValue = value.replace(/[^0-9,\.]/g, '');
    
    // S'assurer qu'il n'y a qu'une seule virgule ou point
    const commaCount = (sanitizedValue.match(/,/g) || []).length;
    const dotCount = (sanitizedValue.match(/\./g) || []).length;
    
    if (commaCount > 1) {
      const firstCommaIndex = sanitizedValue.indexOf(',');
      sanitizedValue = sanitizedValue.slice(0, firstCommaIndex + 1) + sanitizedValue.slice(firstCommaIndex + 1).replace(/,/g, '');
    }
    
    if (dotCount > 1) {
      const firstDotIndex = sanitizedValue.indexOf('.');
      sanitizedValue = sanitizedValue.slice(0, firstDotIndex + 1) + sanitizedValue.slice(firstDotIndex + 1).replace(/\./g, '');
    }

    // Mettre à jour la valeur d'affichage
    setInputValues(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
    
    // Mettre à jour la valeur numérique
    setTempQuota(prev => ({
      ...prev,
      [field]: parseNumber(sanitizedValue)
    }));
  };

  const handleSave = () => {
    onQuotaChange(tempQuota);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempQuota(quota);
    setInputValues({
      vacation: quota.vacation.toString().replace('.', ','),
      rtt: quota.rtt.toString().replace('.', ','),
      previousYear: quota.previousYear.toString().replace('.', ',')
    });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-gray-700">Configuration des quotas</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-700"
          >
            <Settings className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{formatNumber(quota.vacation)}</div>
              <div className="text-sm text-gray-600">Jours de CP</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{formatNumber(quota.rtt)}</div>
              <div className="text-sm text-gray-600">Jours de RTT</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{formatNumber(quota.previousYear)}</div>
              <div className="text-sm text-gray-600">CP N-1</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader>
        <CardTitle className="text-gray-700">Modification des quotas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vacation-quota">Congés payés (CP)</Label>
            <Input
              id="vacation-quota"
              type="text"
              value={inputValues.vacation}
              onChange={(e) => handleInputChange('vacation', e.target.value)}
              placeholder="ex: 25 ou 25,5"
            />
            <div className="text-xs text-gray-500">Vous pouvez saisir des demi-journées (ex: 25,5)</div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rtt-quota">RTT</Label>
            <Input
              id="rtt-quota"
              type="text"
              value={inputValues.rtt}
              onChange={(e) => handleInputChange('rtt', e.target.value)}
              placeholder="ex: 15 ou 15,5"
            />
            <div className="text-xs text-gray-500">Vous pouvez saisir des demi-journées (ex: 15,5)</div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="previous-year-quota">CP N-1</Label>
            <Input
              id="previous-year-quota"
              type="text"
              value={inputValues.previousYear}
              onChange={(e) => handleInputChange('previousYear', e.target.value)}
              placeholder="ex: 5 ou 5,5"
            />
            <div className="text-xs text-gray-500">Vous pouvez saisir des demi-journées (ex: 5,5)</div>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotaSettings;
