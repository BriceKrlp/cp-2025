
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VacationPeriod } from '@/types/vacation';
import { useToast } from '@/hooks/use-toast';

export const useVacationPeriods = (userId: string | null) => {
  const [periods, setPeriods] = useState<VacationPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Charger les périodes depuis Supabase
  const fetchPeriods = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('vacation_periods')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedPeriods = data.map(period => ({
          id: period.id,
          startDate: new Date(period.start_date),
          endDate: new Date(period.end_date),
          type: period.type as VacationPeriod['type'],
          workingDays: Number(period.working_days),
          periodType: period.period_type as VacationPeriod['periodType'],
          description: period.description || undefined,
        }));
        setPeriods(formattedPeriods);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des périodes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les périodes de congés",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Ajouter une période
  const addPeriod = async (newPeriod: Omit<VacationPeriod, 'id'>) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('vacation_periods')
        .insert({
          user_id: userId,
          start_date: newPeriod.startDate.toISOString().split('T')[0],
          end_date: newPeriod.endDate.toISOString().split('T')[0],
          type: newPeriod.type,
          working_days: newPeriod.workingDays,
          period_type: newPeriod.periodType,
          description: newPeriod.description,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const formattedPeriod: VacationPeriod = {
          id: data.id,
          startDate: new Date(data.start_date),
          endDate: new Date(data.end_date),
          type: data.type as VacationPeriod['type'],
          workingDays: Number(data.working_days),
          periodType: data.period_type as VacationPeriod['periodType'],
          description: data.description || undefined,
        };
        
        setPeriods(prev => [...prev, formattedPeriod]);
        toast({
          title: "Succès",
          description: "Période de congés ajoutée avec succès",
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la période:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la période de congés",
        variant: "destructive",
      });
    }
  };

  // Supprimer une période
  const removePeriod = async (periodId: string) => {
    try {
      const { error } = await supabase
        .from('vacation_periods')
        .delete()
        .eq('id', periodId);

      if (error) throw error;

      setPeriods(prev => prev.filter(period => period.id !== periodId));
      toast({
        title: "Succès",
        description: "Période de congés supprimée avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la période:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la période de congés",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, [userId]);

  return {
    periods,
    loading,
    addPeriod,
    removePeriod,
    refetch: fetchPeriods,
  };
};
