
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VacationQuota } from '@/types/vacation';
import { useToast } from '@/hooks/use-toast';

export const useVacationQuotas = (userId: string | null) => {
  const [quotas, setQuotas] = useState<VacationQuota>({
    vacation: 25,
    rtt: 15,
    previousYear: 5,
    unpaid: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Charger les quotas depuis Supabase
  const fetchQuotas = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('vacation_quotas')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setQuotas({
          vacation: Number(data.vacation),
          rtt: Number(data.rtt),
          previousYear: Number(data.previous_year),
          unpaid: Number(data.unpaid),
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des quotas:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les quotas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Sauvegarder les quotas dans Supabase
  const saveQuotas = async (newQuotas: VacationQuota) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('vacation_quotas')
        .upsert({
          user_id: userId,
          vacation: newQuotas.vacation,
          rtt: newQuotas.rtt,
          previous_year: newQuotas.previousYear,
          unpaid: newQuotas.unpaid,
        });

      if (error) throw error;

      setQuotas(newQuotas);
      toast({
        title: "Succès",
        description: "Quotas sauvegardés avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des quotas:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les quotas",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchQuotas();
  }, [userId]);

  return {
    quotas,
    loading,
    saveQuotas,
    refetch: fetchQuotas,
  };
};
