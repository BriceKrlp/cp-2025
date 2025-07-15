
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit2 } from 'lucide-react';

interface PlanningHeaderProps {
  title: string;
  year: number;
  onTitleChange: (title: string) => void;
  onYearChange: (year: number) => void;
}

const PlanningHeader: React.FC<PlanningHeaderProps> = ({
  title,
  year,
  onTitleChange,
  onYearChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [tempYear, setTempYear] = useState(year);

  const handleSave = () => {
    onTitleChange(tempTitle);
    onYearChange(tempYear);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempTitle(title);
    setTempYear(year);
    setIsOpen(false);
  };

  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center gap-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          {title} {year}
        </h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
              <Edit2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le planning</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Nom du planning
                </label>
                <Input
                  id="title"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  placeholder="Planning de Congés"
                />
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium mb-2">
                  Année
                </label>
                <Input
                  id="year"
                  type="number"
                  value={tempYear}
                  onChange={(e) => setTempYear(parseInt(e.target.value) || new Date().getFullYear())}
                  min="2020"
                  max="2030"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancel}>
                  Annuler
                </Button>
                <Button onClick={handleSave}>
                  Sauvegarder
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <p className="text-gray-600 text-lg">
        Planifiez vos congés avec sauvegarde automatique dans le cloud
      </p>
    </div>
  );
};

export default PlanningHeader;
