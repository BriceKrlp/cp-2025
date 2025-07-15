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

  /**
   * Charger les quotas depuis Supabase
   */
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
      } else {
        // Si aucun quota n'existe, on garde les valeurs par défaut
        setQuotas({
          vacation: 25,
          rtt: 15,
          previousYear: 5,
          unpaid: 0,
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des quotas:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les quotas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sauvegarder les quotas (insert si inexistant, sinon update)
   */
  const saveQuotas = async (newQuotas: VacationQuota) => {
    if (!userId) return;

    try {
      // Vérifier si l'utilisateur a déjà un quota
      const { data: existing, error: selectError } = await supabase
        .from('vacation_quotas')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (selectError) throw selectError;

      if (existing) {
        // Si existe → update
        const { error: updateError } = await supabase
          .from('vacation_quotas')
          .update({
            vacation: newQuotas.vacation,
            rtt: newQuotas.rtt,
            previous_year: newQuotas.previousYear,
            unpaid: newQuotas.unpaid,
          })
          .eq('user_id', userId);

        if (updateError) throw updateError;
      } else {
        // Si n'existe pas → insert
        const { error: insertError } = await supabase
          .from('vacation_quotas')
          .insert({
            user_id: userId,
            vacation: newQuotas.vacation,
            rtt: newQuotas.rtt,
            previous_year: newQuotas.previousYear,
            unpaid: newQuotas.unpaid,
          });

        if (insertError) throw insertError;
      }

      // Mettre à jour le state local
      setQuotas(newQuotas);

      toast({
        title: 'Succès',
        description: 'Quotas sauvegardés avec succès',
      });

      // Rafraîchir depuis la base pour être 100% synchro
      await fetchQuotas();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des quotas:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les quotas',
        variant: 'destructive',
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
