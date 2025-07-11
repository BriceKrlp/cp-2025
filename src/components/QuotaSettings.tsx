
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

  const formatNumber = (num: number): string => {
    return num % 1 === 0 ? num.toString() : num.toString().replace('.', ',');
  };

  const parseNumber = (value: string): number => {
    const normalizedValue = value.replace(',', '.');
    const parsed = parseFloat(normalizedValue);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleSave = () => {
    onQuotaChange(tempQuota);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempQuota(quota);
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
              step="0.5"
              min="0"
              max="50"
              value={formatNumber(tempQuota.vacation)}
              onChange={(e) => setTempQuota(prev => ({
                ...prev,
                vacation: parseNumber(e.target.value)
              }))}
              placeholder="ex: 25 ou 25,5"
            />
            <div className="text-xs text-gray-500">Vous pouvez saisir des demi-journées (ex: 25,5)</div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rtt-quota">RTT</Label>
            <Input
              id="rtt-quota"
              type="text"
              step="0.5"
              min="0"
              max="30"
              value={formatNumber(tempQuota.rtt)}
              onChange={(e) => setTempQuota(prev => ({
                ...prev,
                rtt: parseNumber(e.target.value)
              }))}
              placeholder="ex: 15 ou 15,5"
            />
            <div className="text-xs text-gray-500">Vous pouvez saisir des demi-journées (ex: 15,5)</div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="previous-year-quota">CP N-1</Label>
            <Input
              id="previous-year-quota"
              type="text"
              step="0.5"
              min="0"
              max="25"
              value={formatNumber(tempQuota.previousYear)}
              onChange={(e) => setTempQuota(prev => ({
                ...prev,
                previousYear: parseNumber(e.target.value)
              }))}
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
